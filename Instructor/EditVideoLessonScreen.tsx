import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { EDIT_VIDEO_LESSON_API_URL, GET_VIDEO_LESSON_API_URL } from '../config/apiConfig';
const EditVideoLessonScreen = ({ route, navigation }) => {
    const { courseId } = route.params;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchLessonData();
    }, []);
  
    const fetchLessonData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const res = await axios.get(GET_VIDEO_LESSON_API_URL(courseId), {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = res.data;
        setTitle(data.title);
        setDescription(data.description);
        setDuration(String(data.duration));
        if (data.document_url) {
          setDocument({ uri: data.document_url, name: 'เอกสารเดิม' });
        }
  
      } catch (error) {
        if (error.response) {
            console.error('🔴 SERVER RESPONSE ERROR:', error.response.status);
            console.error(error.response.data);
          } else if (error.request) {
            console.error('🔴 NO RESPONSE FROM SERVER:', error.request);
          } else {
            console.error('🔴 REQUEST SETUP ERROR:', error.message);
          }
        Alert.alert('ผิดพลาด', 'ไม่สามารถโหลดข้อมูลบทเรียนได้');
      } finally {
        setLoading(false);
      }
    };
  
    const handleVideoPick = () => {
      launchImageLibrary({ mediaType: 'video' }, response => {
        if (!response.didCancel && response.assets?.length > 0) {
          setVideoFile(response.assets[0]);
        }
      });
    };
  
    const handleFilePick = async () => {
      try {
        const res = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
        });
        setDocument({ uri: res.uri, type: res.type, name: res.name });
      } catch (err) {
        if (!DocumentPicker.isCancel(err)) {
          Alert.alert('Error', 'ไม่สามารถเลือกไฟล์ได้');
        }
      }
    };
  
    const handleSubmit = async () => {
      if (!title || !description || !duration) {
        Alert.alert('Error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }
  
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('duration', duration);
  
      if (videoFile) {
        formData.append('video_file', {
          uri: videoFile.uri,
          type: videoFile.type,
          name: videoFile.fileName || 'video.mp4',
        });
      }
  
      if (document && document.uri && !document.uri.startsWith('http')) {
        // แนบเฉพาะกรณีที่ผู้ใช้เลือกเอกสารใหม่เท่านั้น (ไม่ใช่เอกสารเดิมจากเซิร์ฟเวอร์)
        formData.append('document', {
          uri: document.uri,
          type: document.type || 'application/pdf',
          name: document.name,
        });
      }
      
  
      try {
        const response = await axios.put(EDIT_VIDEO_LESSON_API_URL(courseId), formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          Alert.alert('สำเร็จ', 'อัปเดตวิดีโอสำเร็จ');
          navigation.navigate('VideoCourses');
        }
      } catch (error) {
        if (error.response) {
            console.error('🔴 SERVER RESPONSE ERROR:', error.response.status);
            console.error(error.response.data);
          } else if (error.request) {
            console.error('🔴 NO RESPONSE FROM SERVER:', error.request);
          } else {
            console.error('🔴 REQUEST SETUP ERROR:', error.message);
          }
        Alert.alert('Error', 'ไม่สามารถอัปเดตบทเรียนได้');
      }
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
  
        <Text style={styles.title}>แก้ไขวิดีโอบทเรียน</Text>
  
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
          <Text style={styles.buttonText}>เลือกวิดีโอใหม่</Text>
        </TouchableOpacity>
        {videoFile && <Text style={styles.fileName}>{videoFile.fileName}</Text>}
  
        <TouchableOpacity style={styles.button} onPress={handleFilePick}>
          <Text style={styles.buttonText}>เลือกเอกสารใหม่</Text>
        </TouchableOpacity>
        {document && <Text style={styles.fileName}>{document.name}</Text>}
  
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>บันทึกการแก้ไข</Text>
        </TouchableOpacity>
      </View>
    );
  };

export default EditVideoLessonScreen;

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
    textAlign: 'center',
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
    fontWeight: 'bold',
  },
  fileName: {
    color: '#555',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
