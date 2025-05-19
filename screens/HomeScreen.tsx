import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../styles/HomeStyles';
import { COURSES_API_URL, BANNERS_API_URL, PROFILE_API_URL } from '../config/apiConfig'; // ✅ ใช้ URL API ที่ตั้งค่าไว้
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const bannerListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videoCourses, setVideoCourses] = useState<any[]>([]);

  useEffect(() => {
    checkToken();
    fetchCourses();
    fetchBanners();
    fetchProfilePicture();
  }, []);

  // ✅ ใช้ useEffect เพื่อทำให้ Banner เลื่อนอัตโนมัติ
  useEffect(() => {
    if (banners.length === 0) return; 

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      setCurrentIndex(nextIndex);

      bannerListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000); 

    return () => clearInterval(interval); 
  }, [currentIndex, banners]);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('ข้อผิดพลาด', 'กรุณาเข้าสู่ระบบก่อน');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการตรวจสอบ Token');
    }
  };

  // ✅ โหลดข้อมูลคอร์สทั้งหมด (รวมทั้งคอร์สจองและวิดีโอ)
  const fetchCourses = async () => {
    try {
      const response = await axios.get(COURSES_API_URL);
      console.log('API Response:', response.data);

      setBanners(response.data.banners);
      setCourses(response.data.courses || []);
      setVideoCourses(response.data.video_courses || []); // ✅ แก้ไขตรงนี้ให้แน่ใจว่าไม่เป็น undefined

    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดคอร์สเรียนได้');
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await axios.get(BANNERS_API_URL);
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

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

  const handleSearchSubmit = () => {
    navigation.navigate('Courses', { searchQuery });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Scrollable Content */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาคอร์สเรียน"
              value={searchQuery}
              onChangeText={setSearchQuery} // ✅ อัปเดตค่าค้นหา
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
        

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.title}> Welcome To </Text>        
          <Text style={styles.highlight1}> I  
            <Text style={styles.roar}> say </Text>
            <Text style={styles.roar1}> ROAR!</Text>
          </Text>

          <View style={styles.bannerContainer}>
          <FlatList
            ref={bannerListRef}
            data={banners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image_url }} style={styles.bannerImage} />
            )}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
        </View>

          <Text style={styles.description00}>I say ROAR!</Text>
          <Text style={styles.description0}>พัฒนาทักษะผ่านกิจกรรม</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.description}> เรียนรู้ผ่านการเล่น สร้างพื้นฐานการเรียนที่แข็งแกร่ง </Text>
            <Text style={styles.description}>พร้อมเสริมศักยภาพด้านภาษาอังกฤษ</Text>
            <Text style={styles.description}>สมัครเลยวันนี้! มาร่วมสนุกและพัฒนาทักษะไปพร้อมกันที่</Text>
            <Text style={styles.description}>ISR!</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.linkText}>คอร์สแนะนำ</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Courses Section */}
        <View style={styles.courseSection}>
  <Text style={styles.sectionTitleOnline}>คอร์สเรียนวิดีโอใหม่ล่าสุด</Text>
  <LinearGradient
    colors={['rgba(24, 170, 227, 0.6)', 'rgba(232, 141, 213, 0.5)', 'rgba(255, 125, 12, 0.4)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.divider}
  />

  {loading ? (
    <ActivityIndicator size="large" color="#FF7D0C" />
  ) : (
    <FlatList
      data={videoCourses}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image_url }} style={styles.cardImage} />
          <Text style={styles.cardText}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.instructor}</Text>
          <Text style={styles.cardPrice}>{item.price} บาท</Text>
          <TouchableOpacity
            style={styles.cardButton1}
            onPress={() => navigation.navigate('PurchaseVideoCourseScreen', { courseId: item.id })}
          >
            <Text style={styles.cardButtonText}>ซื้อคอร์ส</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.noDataText}>ไม่มีคอร์สวิดีโอ</Text>}
    />
  )}
</View>



        

    
        {/* Recommended Courses Section */}
        <View style={styles.courseSection}>
  <Text style={styles.sectionTitleOnsite}>คอร์สเรียนออนไซต์ใหม่ล่าสุด</Text>
  <LinearGradient
    colors={['rgba(24, 170, 227, 0.6)', 'rgba(232, 141, 213, 0.5)', 'rgba(255, 125, 12, 0.4)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.divider}
  />

  {loading ? (
    <ActivityIndicator size="large" color="#FF7D0C" />
  ) : (
    <FlatList
      data={courses}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image_url }} style={styles.cardImage} />
          <Text style={styles.cardText}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.instructor}</Text>
          <Text style={styles.cardPrice}>{item.price} บาท</Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => navigation.navigate('BookingScreen', { courseId: item.id })}
          >
            <Text style={styles.cardButtonText}>จองคอร์ส</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.noDataText}>ไม่มีคอร์สออนไซต์</Text>}
    />
  )}
</View>

      </ScrollView>
    </View>
  );
};

export default HomeScreen;
