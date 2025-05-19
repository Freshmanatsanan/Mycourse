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
import styles from '../styles/EditCourseDetailsStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { EDIT_COURSE_DETAILS_API_URL, GET_COURSE_DETAILS_API_URL } from '../config/apiConfig';

const EditCourseDetailsScreen = ({ navigation, route }) => {
  const { courseId } = route.params;
  const [courseDetails, setCourseDetails] = useState({
    name: '',
    description: '',
    additional_description: '',
    image: null,
    additional_image: null,
    extra_image_1: null,
    extra_image_2: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return Alert.alert('กรุณาเข้าสู่ระบบใหม่');

      const response = await axios.get(GET_COURSE_DETAILS_API_URL(courseId), {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCourseDetails({
        name: response.data.name,
        description: response.data.description,
        additional_description: response.data.additional_description,
        image: response.data.image ? { uri: response.data.image } : null,
        additional_image: response.data.additional_image ? { uri: response.data.additional_image } : null,
        extra_image_1: response.data.extra_image_1 ? { uri: response.data.extra_image_1 } : null,
        extra_image_2: response.data.extra_image_2 ? { uri: response.data.extra_image_2 } : null,
      });

      setLoading(false);
    } catch (err) {
      console.error("❌ fetch error", err);
      Alert.alert('ผิดพลาด', 'ไม่สามารถโหลดรายละเอียดคอร์สได้');
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCourseDetails({ ...courseDetails, [field]: value });
  };

  const pickImage = async (field) => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets?.length) {
      const image = result.assets[0];
      setCourseDetails({
        ...courseDetails,
        [field]: {
          uri: image.uri,
          name: image.fileName || 'image.jpg',
          type: image.type || 'image/jpeg',
        }
      });
    }
  };

  const submitEditCourseDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return Alert.alert('กรุณาเข้าสู่ระบบใหม่');

      const formData = new FormData();
      formData.append('name', courseDetails.name);
      formData.append('description', courseDetails.description);
      formData.append('additional_description', courseDetails.additional_description);

      ['image', 'additional_image', 'extra_image_1', 'extra_image_2'].forEach(field => {
        const file = courseDetails[field];
        if (file && file.uri && file.name) {
          formData.append(field, {
            uri: file.uri,
            name: file.name,
            type: file.type || 'image/jpeg',
          });
        }
      });

      const response = await axios.put(EDIT_COURSE_DETAILS_API_URL(courseId), formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ❌ อย่าใส่ Content-Type
          'Content-Type': 'multipart/form-data'

        },
      });

      Alert.alert('สำเร็จ', 'แก้ไขรายละเอียดคอร์สสำเร็จ!');
      navigation.navigate('ReservationCourses');
    } catch (err) {
      console.error("❌ submit error", err);
      Alert.alert('ผิดพลาด', 'ไม่สามารถอัปเดตรายละเอียดคอร์สได้');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>แก้ไขรายละเอียดคอร์สเรียน</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="ชื่อ *"
            value={courseDetails.name}
            onChangeText={text => handleInputChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="คำอธิบาย *"
            value={courseDetails.description}
            onChangeText={text => handleInputChange('description', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="คำอธิบายเพิ่มเติม *"
            value={courseDetails.additional_description}
            onChangeText={text => handleInputChange('additional_description', text)}
          />

          {['image', 'additional_image', 'extra_image_1', 'extra_image_2'].map((field, index) => (
            <View key={index}>
              <TouchableOpacity onPress={() => pickImage(field)} style={styles.imagePicker}>
                <Text style={styles.imagePickerText}>เลือกรูปภาพ {field}</Text>
              </TouchableOpacity>
              {courseDetails[field]?.uri ? (
                <Image source={{ uri: courseDetails[field].uri }} style={styles.previewImage} />
              ) : (
                <Text style={{ color: 'red', textAlign: 'center' }}>❌ ไม่มีรูป</Text>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.submitButton} onPress={submitEditCourseDetails}>
            <Text style={styles.submitButtonText}>บันทึกและส่งตรวจสอบ</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};  

export default EditCourseDetailsScreen;
