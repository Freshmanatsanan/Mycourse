import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import styles from '../styles/ProfileUserStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PROFILE_API_URL } from '../config/apiConfig';
import axios from 'axios';

const ProfileAdminScreen = ({ navigation }: any) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>(''); // เก็บชื่อผู้ใช้

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
          console.warn('No authentication token found');
          Alert.alert('Session Expired', 'กรุณาเข้าสู่ระบบใหม่');
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get(PROFILE_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUserName(response.data.username || ''); // ตั้งค่าชื่อผู้ใช้
          setProfileImage(response.data.profile_picture || null); // ตั้งค่ารูปภาพโปรไฟล์
        } else {
          console.warn('Unexpected response:', response);
        }
      } catch (error: any) {
        console.error('Error fetching profile data:', error);
        if (error.response?.status === 401) {
          Alert.alert('Session Expired', 'กรุณาเข้าสู่ระบบใหม่');
          navigation.navigate('Login');
        } else {
          Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');
        }
      }
    };

    fetchProfileData();
  }, []);

  // ฟังก์ชันเลือกภาพ
  const chooseImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.error('ImagePicker Error: ', response.errorMessage);
          Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเลือกภาพ');
        } else if (response.assets && response.assets.length > 0) {
          setProfileImage(response.assets[0].uri || null);
        }
      }
    );
  };

  // ฟังก์ชันออกจากระบบ
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      console.log('Token ถูกลบเรียบร้อย');

      Alert.alert('ออกจากระบบ', 'คุณออกจากระบบเรียบร้อยแล้ว');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Card */}
      <View style={styles.profileCard}>
        <Text style={styles.user}>ข้อมูลผู้ใช้งาน</Text>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/BG.png')}
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.userName}>{userName}</Text>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <MaterialIcons name="edit" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>แก้ไขข้อมูลส่วนตัว</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileAdminScreen;
