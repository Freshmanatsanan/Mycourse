import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { ADD_VIDEO_COURSE_DETAILS_API_URL } from "../config/apiConfig";  // Import URL API
import styles from '../styles/AddVideoCourseDetailsScreen';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddVideoCourseDetailsScreen = ({ route, navigation }) => {
    const { courseId } = route.params;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [additionalDescription, setAdditionalDescription] = useState('');
    const [image, setImage] = useState(null);
    const [additionalImage, setAdditionalImage] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);


    const handleImagePick = (type) => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
            if (!response.didCancel) {
                if (type === 'image') setImage(response.assets[0]);
                else if (type === 'additional_image') setAdditionalImage(response.assets[0]);
            }
        });
    };

    const handleVideoPick = () => {
        launchImageLibrary(
          { mediaType: 'video', quality: 1, selectionLimit: 1 },
          response => {
            console.log('📦 Full response:', JSON.stringify(response, null, 2));
      
            if (response.didCancel) {
              Alert.alert('Error', 'การเลือกวิดีโอถูกยกเลิก');
            } else if (response.assets && response.assets.length > 0) {
              const video = response.assets[0];
              console.log('🎬 video.uri:', video.uri);
              console.log('🎬 video.type:', video.type);
              console.log('🎬 video.fileSize:', video.fileSize);
      
              if (
                video.uri &&
                video.type &&
                video.type.includes('video') &&
                video.fileSize > 0
              ) {
                setPreviewVideo(video);
              } else {
                Alert.alert('Error', 'ไฟล์ที่เลือกไม่ใช่วิดีโอหรือไฟล์เสีย');
              }
            } else {
              Alert.alert('Error', 'ไม่พบวิดีโอที่เลือก');
            }
          }
        );
      };
      

    const handleSubmit = async () => {
        if (!name || !description || !image || !previewVideo) {
            Alert.alert('Error', 'กรุณากรอกข้อมูลให้ครบถ้วนและเลือกวิดีโอ');
            return;
        }

        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'กรุณาเข้าสู่ระบบใหม่');
          return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('additional_description', additionalDescription);

        // ตรวจสอบว่า image ถูกเลือกก่อน
        if (image) {
            formData.append('image', {
                uri: image.uri,
                type: image.type,
                name: image.fileName
            });
        }

        // ตรวจสอบว่า additionalImage ถูกเลือกก่อน
        if (additionalImage) {
            formData.append('additional_image', {
                uri: additionalImage.uri,
                type: additionalImage.type,
                name: additionalImage.fileName
            });
        }

        // ตรวจสอบว่า previewVideo ถูกเลือกก่อน
        if (previewVideo) {
            formData.append('preview_video', {
                uri: previewVideo.uri,
                type: previewVideo.type,
                name: previewVideo.fileName
            });
        }

        // ตรวจสอบค่า courseId ว่ามีค่าอยู่
        if (!courseId) {
            Alert.alert('Error', 'ไม่พบข้อมูลคอร์ส');
            return;
        }

        try {
            const response = await axios.post(ADD_VIDEO_COURSE_DETAILS_API_URL(courseId), formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',

                  }
            });

            if (response.status === 201) {
                navigation.navigate('AddVideoLessonScreen', { courseId: courseId });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>เพิ่มรายละเอียดคอร์สเรียนแบบวิดีโอ</Text>
            
            <TextInput
                style={styles.input}
                placeholder="ชื่อรายละเอียดคอร์ส"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="คำอธิบาย"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="คำอธิบายเพิ่มเติม"
                value={additionalDescription}
                onChangeText={setAdditionalDescription}
            />
            
            <TouchableOpacity style={styles.fileButton} onPress={() => handleImagePick('image')}>
                <Text style={styles.fileButtonText}>เลือกรูปภาพตารางเรียน</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}
            
            <TouchableOpacity style={styles.fileButton} onPress={() => handleImagePick('additional_image')}>
                <Text style={styles.fileButtonText}>เลือกรูปภาพเพิ่มเติม</Text>
            </TouchableOpacity>
            {additionalImage && <Image source={{ uri: additionalImage.uri }} style={styles.imagePreview} />}
            
            <TouchableOpacity style={styles.fileButton} onPress={handleVideoPick}>
                <Text style={styles.fileButtonText}>เลือกรูปวิดีโอตัวอย่าง</Text>
            </TouchableOpacity>
            {previewVideo && <Text>{previewVideo.fileName}</Text>}
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>บันทึกและไปเพิ่มวิดีโอ</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddVideoCourseDetailsScreen;
