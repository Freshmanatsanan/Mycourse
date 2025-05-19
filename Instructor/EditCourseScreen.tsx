import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import styles from '../styles/EditCourseStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { EDIT_COURSE_API_URL,GET_RESERVATION_COURSE_API_URL } from '../config/apiConfig';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


const EditCourseScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { courseId } = route.params;
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: '',
    image: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('ข้อผิดพลาด', 'กรุณาเข้าสู่ระบบใหม่');
        navigation.navigate('LoginScreen');
        return;
      }

      const response = await axios.get(GET_RESERVATION_COURSE_API_URL(courseId), {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCourseData({
        title: response.data.title,
        description: response.data.description,
        instructor: response.data.instructor,
        price: response.data.price.toString(),
        image: response.data.image_url ? { uri: response.data.image_url } : null,
      });

      setLoading(false);

    } catch (error) {
      console.error("🚨 Error fetching course:", error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลคอร์สได้');
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCourseData({ ...courseData, [field]: value });
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setCourseData({ ...courseData, image: result.assets[0] });
    }
  };

  const submitEditCourse = async () => {
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

      if (courseData.image && courseData.image.uri) {
        formData.append('image', {
          uri: courseData.image.uri,
          name: courseData.image.fileName || 'course.jpg',
          type: courseData.image.type || 'image/jpeg',
        } as any);
      }

      const response = await axios.put(EDIT_COURSE_API_URL(courseId), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      Alert.alert('สำเร็จ', 'แก้ไขคอร์สเรียนสำเร็จ!');
      navigation.navigate('EditCourseDetailsScreen', { courseId });

    } catch (error) {
      console.error("🚨 Error submitting edit:", error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถแก้ไขคอร์สได้');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.headerText}>แก้ไขคอร์สเรียน</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="ชื่อคอร์ส"
            value={courseData.title}
            onChangeText={(text) => handleInputChange('title', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="คำอธิบาย"
            multiline
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
          {courseData.image && <Image source={{ uri: courseData.image.uri }} style={styles.previewImage} />}
          <TouchableOpacity style={styles.submitButton} onPress={submitEditCourse}>
            <Text style={styles.submitButtonText}>บันทึกและไปแก้ไขรายละเอียดคอร์สเรียน</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default EditCourseScreen;