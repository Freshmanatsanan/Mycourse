// ✅ แก้ไขข้อมูลหลักของคอร์สวิดีโอ (พร้อมดึงข้อมูลเดิม)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import styles from '../styles/AddCourseStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  EDIT_VIDEO_COURSE_API_URL,
  GET_VIDEO_COURSE_BY_ID_API_URL, // ✅ ต้องเพิ่มใน apiConfig.js
} from '../config/apiConfig';

const EditVideoCourseScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(GET_VIDEO_COURSE_BY_ID_API_URL(courseId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const course = response.data;
      setCourseData({
        title: course.title || '',
        description: course.description || '',
        price: course.price?.toString() || '',
      });

      if (course.image) {
        setImage({ uri: course.image });
      }
    } catch (error) {
      console.error('❌ ไม่สามารถโหลดข้อมูลคอร์สได้:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลคอร์สได้');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleInputChange = (field, value) => {
    setCourseData({ ...courseData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('price', courseData.price);

      if (image && image.uri && image.fileName) {
        formData.append('image', {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        });
      }

      await axios.put(EDIT_VIDEO_COURSE_API_URL(courseId), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('สำเร็จ', 'แก้ไขคอร์สสำเร็จ');
      navigation.navigate('EditVideoCourseDetailsScreen', { courseId });
    } catch (error) {
      console.error('❌ แก้ไขคอร์สไม่สำเร็จ:', error);
      Alert.alert('ผิดพลาด', 'ไม่สามารถแก้ไขคอร์สได้');
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
            value={courseData.description}
            onChangeText={(text) => handleInputChange('description', text)}
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

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>บันทึกข้อมูล</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default EditVideoCourseScreen;
