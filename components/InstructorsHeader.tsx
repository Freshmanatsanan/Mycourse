import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/InstructorHeaderStyles';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INSTRUCTOR_PROFILE_API_URL } from '../config/apiConfig';


const InstructorHeader: React.FC = () => {
  const navigation = useNavigation();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorProfile();
  }, []);

  const fetchInstructorProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error("Token is missing");
        setLoading(false); // ✅ หยุด loading แม้ไม่มี token
        return;
      }
  
      const response = await axios.get(INSTRUCTOR_PROFILE_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.data && response.data.profile_picture) {
        console.log("Profile Picture URL:", response.data.profile_picture); // ✅ Debugging
        setProfilePicture(response.data.profile_picture);
      } else {
        console.warn("No profile picture found");
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    } finally {
      setLoading(false); // ✅ หยุด loading ทันทีที่ API ตอบกลับ
    }
  };
  
  return (
    <LinearGradient
      colors={['#f7a383', '#e28bc4', '#9085e5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      {/* โลโก้ */}
      <Image source={require('../assets/logo0.png')} style={styles.logo} />

      {/* ข้อความ Welcome */}
      <Text style={styles.title}>
        Welcome To <Text style={styles.highlight}>I say ROAR!</Text>
      </Text>

      {/* ไอคอนโปรไฟล์ */}
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => navigation.navigate('ProfileInstructorScreen')} // ไปหน้าโปรไฟล์เมื่อกด
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <MaterialIcons name="person" size={28} color="#fff" />
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default InstructorHeader;
