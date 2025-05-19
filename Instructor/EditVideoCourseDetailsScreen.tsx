import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { EDIT_VIDEO_COURSE_DETAILS_API_URL, GET_VIDEO_COURSE_DETAILS_API_URL } from '../config/apiConfig';
import styles from '../styles/AddVideoCourseDetailsScreen';

const EditVideoCourseDetailsScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [form, setForm] = useState({
    name: '',
    description: '',
    additional_description: '',
  });
  const [image, setImage] = useState(null);
  const [additionalImage, setAdditionalImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await axios.get(GET_VIDEO_COURSE_DETAILS_API_URL(courseId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setForm({
        name: data.name || '',
        description: data.description || '',
        additional_description: data.additional_description || '',
      });

      if (data.image) setImage({ uri: data.image });
      if (data.additional_image) setAdditionalImage({ uri: data.additional_image });
      if (data.preview_video) setPreviewVideo({ uri: data.preview_video });
    } catch (err) {
      console.error('❌ ไม่สามารถโหลดข้อมูลรายละเอียดคอร์สได้:', err);
      Alert.alert('ข้อผิดพลาด', 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const pickMedia = (type) => {
    const mediaType = type === 'previewVideo' ? 'video' : 'photo';
    launchImageLibrary({ mediaType }, (res) => {
      if (!res.didCancel && res.assets?.length > 0) {
        if (type === 'image') setImage(res.assets[0]);
        else if (type === 'additionalImage') setAdditionalImage(res.assets[0]);
        else if (type === 'previewVideo') setPreviewVideo(res.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) return Alert.alert('กรุณาเข้าสู่ระบบใหม่');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('additional_description', form.additional_description);
    if (image && image.uri && !image.fileName) {
      // ภาพเดิม ไม่แนบซ้ำ
    } else if (image) {
      formData.append('image', {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      });
    }
    if (additionalImage && additionalImage.uri && !additionalImage.fileName) {
      // ไม่แนบซ้ำ
    } else if (additionalImage) {
      formData.append('additional_image', {
        uri: additionalImage.uri,
        name: additionalImage.fileName,
        type: additionalImage.type,
      });
    }
    if (previewVideo && previewVideo.uri && !previewVideo.fileName) {
      // วิดีโอเดิม
    } else if (previewVideo) {
      formData.append('preview_video', {
        uri: previewVideo.uri,
        name: previewVideo.fileName,
        type: previewVideo.type,
      });
    }

    try {
      const res = await axios.put(EDIT_VIDEO_COURSE_DETAILS_API_URL(courseId), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.status === 200) {
        Alert.alert('สำเร็จ', 'อัปเดตรายละเอียดคอร์สแล้ว');
        navigation.navigate('EditVideoLessonScreen', { courseId });
      }
    } catch (err) {
      console.error(err);
      Alert.alert('เกิดข้อผิดพลาด', 'โปรดลองใหม่ภายหลัง');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.title}>แก้ไขรายละเอียดคอร์ส</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="หัวข้อรายละเอียด"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="คำอธิบาย"
            value={form.description}
            onChangeText={(text) => handleChange('description', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="รายละเอียดเพิ่มเติม"
            value={form.additional_description}
            onChangeText={(text) => handleChange('additional_description', text)}
          />

          <TouchableOpacity style={styles.fileButton} onPress={() => pickMedia('image')}>
            <Text style={styles.fileButtonText}>เลือกรูปภาพหลัก</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}

          <TouchableOpacity style={styles.fileButton} onPress={() => pickMedia('additionalImage')}>
            <Text style={styles.fileButtonText}>เลือกรูปภาพเพิ่มเติม</Text>
          </TouchableOpacity>
          {additionalImage && <Image source={{ uri: additionalImage.uri }} style={styles.imagePreview} />}

          <TouchableOpacity style={styles.fileButton} onPress={() => pickMedia('previewVideo')}>
            <Text style={styles.fileButtonText}>เลือกวิดีโอตัวอย่าง</Text>
          </TouchableOpacity>
          {previewVideo && <Text style={styles.fileName}>{previewVideo.fileName || previewVideo.uri}</Text>}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>อัปเดตรายละเอียด</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default EditVideoCourseDetailsScreen;
