import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, TouchableOpacity,StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { ADD_VIDEO_COURSE_API_URL } from "../config/apiConfig";  // Import URL API
import styles from '../styles/AddVideoCourseScreen';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // เพิ่มการนำเข้า AsyncStorage

const AddVideoCourseScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [instructor, setInstructor] = useState('');
    const [image, setImage] = useState(null);

    const handleImagePick = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
            if (!response.didCancel) {
                setImage(response.assets[0]);
            }
        });
    };

    const handleSubmit = async () => {
        if (!title || !description || !price || !instructor || !image) {
            Alert.alert('Error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('instructor', instructor);
        formData.append('image', {
            uri: image.uri,
            type: image.type,
            name: image.fileName
        });

        try {
            const token = await AsyncStorage.getItem("authToken"); // ดึง token จาก AsyncStorage
            if (!token) {
                Alert.alert('Error', 'ไม่พบ token กรุณาล็อกอินอีกครั้ง');
                return;
            }

            const response = await axios.post(ADD_VIDEO_COURSE_API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // ใช้ token ที่ดึงมา
                }
            });

            if (response.status === 201) {
                navigation.navigate('AddVideoCourseDetailsScreen', { courseId: response.data.course_id });
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
            <Text style={styles.header}>เพิ่มคอร์สเรียนแบบวิดีโอ</Text>

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>ชื่อคอร์ส</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ชื่อคอร์ส"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>คำอธิบาย</Text>
                <TextInput
                    style={styles.input}
                    placeholder="คำอธิบาย"
                    value={description}
                    onChangeText={setDescription}
                />
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>ราคา</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ราคา"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>ชื่อผู้สอน</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ชื่อผู้สอน"
                    value={instructor}
                    onChangeText={setInstructor}
                />
            </View>

            <TouchableOpacity onPress={handleImagePick}>
                <Text style={styles.imagePickerText}>เลือกรูปภาพคอร์ส</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>บันทึกและไปเพิ่มรายละเอียดคอร์สเรียน</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddVideoCourseScreen;