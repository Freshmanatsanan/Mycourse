import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import axios from 'axios';
import styles from '../styles/AddCourseDetailsStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { ADD_COURSE_DETAILS_API_URL } from '../config/apiConfig';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AddCourseDetailsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { courseId } = route.params;
  const [courseDetails, setCourseDetails] = useState({
    name: '',
    description: '',
    additional_description: '',
  });

  const [images, setImages] = useState<any>({
    image: null,
    additional_image: null,
    extra_image_1: null,
    extra_image_2: null,
  });

  const handleInputChange = (field: string, value: string) => {
    setCourseDetails({ ...courseDetails, [field]: value });
  };

  const pickImage = async (field: string) => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setImages({ ...images, [field]: result.assets[0] });
    }
  };

  const submitCourseDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('ข้อผิดพลาด', 'กรุณาเข้าสู่ระบบใหม่');
        return;
      }

      const formData = new FormData();
      formData.append('name', courseDetails.name);
      formData.append('description', courseDetails.description);
      formData.append('additional_description', courseDetails.additional_description);
      Object.keys(images).forEach((key) => {
        if (images[key]) {
          formData.append(key, {
            uri: images[key].uri,
            name: `${key}.jpg`,
            type: images[key].type,
          } as any);
        }
      });

      console.log("📌 API URL ที่ใช้:", ADD_COURSE_DETAILS_API_URL(courseId));
      console.log("📌 ข้อมูลที่ส่ง:", formData);

      const response = await axios.post(ADD_COURSE_DETAILS_API_URL(courseId), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Alert.alert('สำเร็จ', 'เพิ่มรายละเอียดคอร์สเรียนสำเร็จ!');
        navigation.navigate('ReservationCourses');
      }
    } catch (error) {
      console.error("📌 Error Response:", error.response?.data);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเพิ่มรายละเอียดคอร์สได้');
    }
  };

  return (
    <View style={styles.container}>

     <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}> กลับไปแก้ไขหน้าเพิ่มคอร์ส</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>เพิ่มรายละเอียดคอร์สเรียน</Text>

        <TextInput
          style={styles.input}
          placeholder="ชื่อ *"
          value={courseDetails.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="คำอธิบาย *"
          value={courseDetails.description}
          onChangeText={(text) => handleInputChange('description', text)}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="คำอธิบายเพิ่มเติม *"
          value={courseDetails.additional_description}
          onChangeText={(text) => handleInputChange('additional_description', text)}
          multiline
        />

        {/* อัปโหลดรูปภาพ */}
        {['image', 'additional_image', 'extra_image_1', 'extra_image_2'].map((field, index) => (
          <View key={index} style={styles.imageUploadContainer}>
            <TouchableOpacity onPress={() => pickImage(field)} style={styles.imagePicker}>
              <Text style={styles.imagePickerText}>
                {field === 'image'
                  ? 'เลือกรูปภาพตารางเรียน *'
                  : field === 'additional_image'
                  ? 'เลือกรูปภาพตารางเรียนเพิ่มเติม *'
                  : `เลือกรูปภาพกิจกรรม ${index - 1}`}
              </Text>
            </TouchableOpacity>
            {images[field] && <Image source={{ uri: images[field].uri }} style={styles.previewImage} />}
          </View>
        ))}
      </ScrollView>

      {/* ปุ่มส่งข้อมูล */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={submitCourseDetails}>
          <Text style={styles.submitButtonText}>บันทึกและส่งคอร์สเรียน</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default AddCourseDetailsScreen;
