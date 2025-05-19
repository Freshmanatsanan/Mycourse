import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADD_VIDEO_LESSON_API_URL } from "../config/apiConfig";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DocumentPicker from 'react-native-document-picker';

const AddVideoLessonScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [document, setDocument] = useState(null);

  const handleVideoPick = () => {
    launchImageLibrary({ mediaType: 'video', quality: 1 }, response => {
      if (!response.didCancel && response.assets?.length > 0) {
        setVideoFile(response.assets[0]);
      }
    });
  };


  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx],
      });
  
      console.log('📄 Selected file:', res);
      setDocument({
        uri: res.uri,
        type: res.type,
        name: res.name,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('ยกเลิกการเลือกไฟล์');
      } else {
        Alert.alert('Error', 'ไม่สามารถเลือกไฟล์ได้');
        console.error(err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !duration || !videoFile) {
      Alert.alert('Error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('video_file', {
      uri: videoFile.uri,
      type: videoFile.type,
      name: videoFile.fileName || 'video.mp4',
    });
    if (document) {
      formData.append('document', {
        uri: document.uri,
        type: document.type,
        name: document.fileName || 'document.pdf',
      });
    }

    try {
      const response = await axios.post(ADD_VIDEO_LESSON_API_URL(courseId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.status === 201) {
        Alert.alert('สำเร็จ', 'เพิ่มวิดีโอสำเร็จ');
        navigation.navigate('VideoCourses');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔙 ปุ่มกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>เพิ่มวิดีโอการสอน</Text>

      <TextInput
        style={styles.input}
        placeholder="ชื่อวิดีโอ"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="คำอธิบาย"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="ระยะเวลา (นาที)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleVideoPick}>
        <Text style={styles.buttonText}>เลือกรูปวิดีโอ</Text>
      </TouchableOpacity>
      {videoFile && <Text style={styles.fileName}>{videoFile.fileName}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleFilePick}>
        <Text style={styles.buttonText}>เลือกรูปเอกสารประกอบการเรียน</Text>
      </TouchableOpacity>
      {document && <Text style={styles.fileName}>{document.fileName}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>บันทึกและอัปโหลดวิดีโอ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddVideoLessonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  backButton: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 30,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4682B4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  fileName: {
    color: '#555',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center'
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});
