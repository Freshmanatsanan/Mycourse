import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import styles from '../styles/EditProfileStyles';
import { PROFILE_API_URL, UPDATE_PROFILE_API_URL } from '../config/apiConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EditProfileScreen = ({ navigation }: any) => {
  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // ใช้สำหรับรอโหลดข้อมูล

  // 📌 ดึงข้อมูลโปรไฟล์จาก API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('ข้อผิดพลาด', 'กรุณาเข้าสู่ระบบใหม่');
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get(PROFILE_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setProfileData({
            username: response.data.username || '',
            firstName: response.data.first_name || '',
            lastName: response.data.last_name || '',
            email: response.data.email || '',
            profilePicture: response.data.profile_picture || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        Alert.alert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลโปรไฟล์');
      } finally {
        setFetching(false);
      }
    };

    fetchProfileData();
  }, []);

  // 📌 ฟังก์ชันเลือกและอัปโหลดรูป
  const chooseImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเลือกภาพ');
        } else if (response.assets && response.assets.length > 0) {
          setProfileData({ ...profileData, profilePicture: response.assets[0].uri });
        }
      }
    );
  };

  // 📌 ฟังก์ชันบันทึกข้อมูลโปรไฟล์
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const formData = new FormData();
      formData.append('username', profileData.username);
      formData.append('first_name', profileData.firstName);
      formData.append('last_name', profileData.lastName);
      formData.append('email', profileData.email);

      if (profileData.profilePicture) {
        formData.append('profile_picture', {
          uri: profileData.profilePicture,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      const response = await axios.put(UPDATE_PROFILE_API_URL, formData, { 
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      

      if (response.status === 200) {
        Alert.alert('สำเร็จ', 'อัปเดตโปรไฟล์เรียบร้อยแล้ว');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7D0C" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={chooseImage}>
          <Image
            source={
              profileData.profilePicture
                ? { uri: profileData.profilePicture }
                : require('../assets/BG.png') // ✅ ใช้ require()
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.changeImageText}>เปลี่ยนรูปโปรไฟล์</Text>
      </View>

      {/* ฟอร์มแก้ไขข้อมูล */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="ชื่อผู้ใช้"
          value={profileData.username}
          onChangeText={(text) => setProfileData({ ...profileData, username: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="ชื่อ"
          value={profileData.firstName}
          onChangeText={(text) => setProfileData({ ...profileData, firstName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="นามสกุล"
          value={profileData.lastName}
          onChangeText={(text) => setProfileData({ ...profileData, lastName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="อีเมล"
          value={profileData.email}
          onChangeText={(text) => setProfileData({ ...profileData, email: text })}
        />
      </View>

      {/* ปุ่ม */}
      <TouchableOpacity
  style={[styles.button, styles.passwordButton]}
  onPress={() => navigation.navigate('VerifyPassword')}
>
  <Text style={styles.buttonText}>เปลี่ยนแปลงรหัสผ่าน</Text>
</TouchableOpacity>


      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={handleSaveProfile}
      >
        <Text style={styles.buttonText}>{loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;
