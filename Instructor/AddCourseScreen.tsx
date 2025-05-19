import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import styles from '../styles/AddCourseStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { ADD_COURSE_API_URL } from '../config/apiConfig';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AddCourseScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: '',
  });
  const [image, setImage] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setCourseData({ ...courseData, [field]: value });
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

const submitCourse = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('ข้อผิดพลาด', 'กรุณาเข้าสู่ระบบใหม่');
        return;
      }
  
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('instructor', courseData.instructor);
      formData.append('price', courseData.price);
      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: 'course.jpg',
          type: image.type,
        } as any);
      }
  
      console.log("📌 ส่งไปยัง API:", ADD_COURSE_API_URL);
      console.log("📌 ข้อมูลที่ส่ง:", formData);
  
      const response = await axios.post(ADD_COURSE_API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        Alert.alert('สำเร็จ', 'เพิ่มคอร์สเรียนสำเร็จ!');
        navigation.navigate('AddCourseDetails', { courseId: response.data.course_id });
      }
    } catch (error) {
      console.error("📌 Error Response:", error.response?.data);
      
      if (error.response?.status === 404) {
        Alert.alert('ข้อผิดพลาด', 'ไม่พบ API หรือ URL อาจผิด');
      } else if (error.response?.status === 502) {
        Alert.alert('ข้อผิดพลาด', 'เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่อีกครั้ง');
      } else {
        Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเพิ่มคอร์สได้');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#FFF" />
      </TouchableOpacity>
    

      <Text style={styles.headerText}>เพิ่มคอร์สเรียน</Text>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="ชื่อคอร์ส"
        value={courseData.title}
        onChangeText={(text) => handleInputChange('title', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="คำอธิบาย"
        value={courseData.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="ผู้สอน"
        value={courseData.instructor}
        onChangeText={(text) => handleInputChange('instructor', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="ราคา"
        value={courseData.price}
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange('price', text)}
      />
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>เลือกรูปภาพ</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image.uri }} style={styles.previewImage} />}
      <TouchableOpacity style={styles.submitButton} onPress={submitCourse}>
        <Text style={styles.submitButtonText}>เพิ่มคอร์สเรียน</Text>
      </TouchableOpacity>

    </View>
  );
};

export default AddCourseScreen;
