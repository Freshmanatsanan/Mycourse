import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { INSTRUCTORS_API_URL, PROFILE_API_URL ,COURSES_API_URL} from '../config/apiConfig';
import styles from '../styles/OurTeachersStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OurTeachersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

    // ฟังก์ชันส่งคำค้นหาจากหน้า OurTeachers ไปที่หน้า CoursesScreen
  const handleSearchSubmit = () => {
      navigation.navigate('Courses', { searchQuery }); // ส่งค่า searchQuery ไปที่หน้า CoursesScreen
    };

  useEffect(() => {
    fetchInstructors();
    fetchProfilePicture();
  }, []);

  // ✅ โหลดข้อมูลผู้สอนจาก API
  const fetchInstructors = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error("⚠️ Token is missing! กรุณาเข้าสู่ระบบใหม่");
        return;
      }
  
      console.log("🔑 Token ที่ใช้:", token);
      console.log("📌 Requesting API:", INSTRUCTORS_API_URL);  // ✅ Debug API URL
  
      const response = await axios.get(INSTRUCTORS_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // ✅ ตรวจสอบให้ใช้ Content-Type ที่ถูกต้อง
        },
      });
  
      console.log("📌 Instructor API Response:", response.data);
      setInstructors(response.data);
  
    } catch (error) {
      console.error("❌ Error fetching instructors:", error);
  
      if (error.response) {
        console.error("❌ API Response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ ฟิลเตอร์ค้นหาผู้สอน
  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.full_name.includes(searchQuery) || instructor.subject.includes(searchQuery)
  );

  // ✅ โหลดข้อมูลโปรไฟล์จาก API
  const fetchProfilePicture = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
      const response = await axios.get(PROFILE_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.profile_picture) {
        setProfilePicture(response.data.profile_picture);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  // ✅ แสดงรายการผู้สอน
  const renderInstructor = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.profile_picture }} style={styles.teacherImage} />
      <Text style={styles.courseName}>{item.subject}</Text>
      <Text style={styles.instructorName}>โดย {item.full_name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาคอร์สเรียน"
            value={searchQuery}
            onChangeText={setSearchQuery} // อัปเดตค่าค้นหา
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchSubmit}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          ) : (
            <Text style={styles.profileIcon}>👤</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Header Title */}
      <Text style={styles.headerTitle}>ครูของเรา</Text>

      {/* Instructor List */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF7D0C" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredInstructors}
          renderItem={renderInstructor}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default OurTeachersScreen;
