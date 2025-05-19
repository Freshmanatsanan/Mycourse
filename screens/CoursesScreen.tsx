import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

import styles from '../styles/CoursesStyles';
import {
  COURSES_API_URL,
  PROFILE_API_URL,
  MY_COURSES_API_URL,
} from '../config/apiConfig';

const CoursesScreen = ({ navigation }: any) => {
  const route = useRoute();

  // ✅ State Management
  const [activeTab, setActiveTab] = useState('all');
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const searchQuery = route.params?.searchQuery || '';

  // ✅ useEffect Hooks
  useEffect(() => {
    fetchCourses();
    fetchProfilePicture();
  }, []);

  useEffect(() => {
    if (activeTab === 'my') {
      fetchMyCourses();
    }
  }, [activeTab]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, courses]);

  // ✅ Function: โหลดคอร์สทั้งหมด
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(COURSES_API_URL);
      console.log("📌 API Response:", response.data);

      const allCourses = [...response.data.courses, ...response.data.video_courses];
      setCourses(allCourses);
      setFilteredCourses(allCourses);
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function: โหลดโปรไฟล์ผู้ใช้
  const fetchProfilePicture = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get(PROFILE_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.profile_picture) {
        setProfilePicture(response.data.profile_picture);
      }
    } catch (error) {
      console.error('❌ Error fetching profile picture:', error);
    }
  };

  // ✅ Function: โหลดคอร์สของฉัน
  const fetchMyCourses = async () => {
    try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            Alert.alert("Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
            navigation.navigate("Login");
            return;
        }

        const response = await axios.get(MY_COURSES_API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📌 My Courses API Response:", response.data);

        const liveCourses = response.data
            .filter((item: any) => item.type === "live_course")
            .map((booking: any) => ({
                id: booking.id,
                title: booking.course?.title || "ไม่พบข้อมูล",
                instructor: booking.course?.instructor || "ไม่ระบุ",
                price: booking.course?.price || "0",
                image_url: booking.course?.image_url || null,
                status: booking.booking_status || "N/A",
                type: "live_course",
            }));

            const videoCourses = response.data
            .filter((item: any) => item.type === "video_course")
            .map((video: any) => {
              console.log("📌 Full Video Course Object:", JSON.stringify(video.video_course, null, 2));
        
                return {
                    id: video.id,
                    video_course_id: video.video_course?.course?.id, 
                    title: video.video_course?.course?.title || "ไม่พบข้อมูล",
                    instructor: video.video_course?.course?.instructor || "ไม่ระบุ",
                    price: video.video_course?.course?.price || "0",
                    image_url: video.video_course?.course?.image || null, // ✅ ใช้ course.image แทน
                    status: video.video_course?.payment_status || "pending", // ✅ แก้เป็น `video.video_course.payment_status`
                    type: "video_course",
                };
            });
        

        setMyCourses([...liveCourses, ...videoCourses]);

    } catch (error) {
        console.error("❌ Error fetching my courses:", error);
    } finally {
        setLoading(false);
    }
};

  

  // ✅ Function: ค้นหาคอร์ส
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredCourses(filtered);
  };

  return (
    <View style={styles.container}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาคอร์สเรียน"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton}>
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

      {/* ✅ Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            คอร์สเรียนทั้งหมด
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            คอร์สของฉัน
          </Text>
        </TouchableOpacity>
      </View>


      {/* ✅ Course List */}
      <ScrollView contentContainerStyle={styles.courseList}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF7D0C" />
        ) : activeTab === 'all' ? (
          filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <Image source={{ uri: course.image_url }} style={styles.courseImage} />
                <View style={styles.courseDetails}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseDescription}>ผู้สอน: {course.instructor}</Text>
                  <Text style={styles.coursePrice}>{course.price} บาท</Text>

                  {/* ✅ ตรวจสอบว่าคอร์สเป็นคอร์สจองหรือคอร์สวิดีโอ */}
      {/* ✅ ใช้ View แยกปุ่มให้เป็นแนวนอน */}

        {/* ✅ ปุ่มจองคอร์ส */}
        <TouchableOpacity
  style={styles.button}
  onPress={() => {
    if (course.type === "คอร์สจอง") {
      navigation.navigate("BookingScreen", { courseId: course.id });
    } else if (course.type === "คอร์สวิดีโอ") {
      navigation.navigate("PurchaseVideoCourseScreen", { courseId: course.id });
    }
  }}
>
  <Text style={styles.buttonText}>
    {course.type === "คอร์สวิดีโอ" ? "ซื้อคอร์สเรียน" : "จองคอร์ส"}
  </Text>
</TouchableOpacity>


        {/* ✅ ปุ่มดูรายละเอียด */}
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            if (course.type === "คอร์สจอง") {  
              navigation.navigate('CourseDetails', { courseId: course.id });
            } else if (course.type === "คอร์สวิดีโอ") {
              navigation.navigate('VideoCourseDetailsScreen', { courseId: course.id });
            }
          }}
        >
          <Text style={styles.buttonText}>ดูรายละเอียด</Text>
        </TouchableOpacity>
  
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noCourseText}>❌ ไม่พบคอร์สที่คุณค้นหา</Text>
          )
        ) : (
          myCourses.length > 0 ? (
            myCourses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <Image source={{ uri: course.image_url }} style={styles.courseImage} />
                <View style={styles.courseDetails}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseDescription}>ผู้สอน: {course.instructor}</Text>
                  <Text style={styles.coursePrice}>{course.price} บาท</Text>

                  {course.type === "live_course" ? (
    <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BookingDetails', { courseId: course.id })}
    >
        <Text style={styles.buttonText}>ข้อมูลการจองของฉัน</Text>
    </TouchableOpacity>
) : (
    <TouchableOpacity
        style={course.status === "confirmed" ? styles.button : styles.buttonPending}
        onPress={() => {
            if (course.status === "confirmed") {
              navigation.navigate('VideoLessonScreen', { courseId: course.video_course_id  });
            }
        }}
    >
        <Text style={styles.buttonText}>
            {course.status === "confirmed" ? "ดูวิดีโอ" : "รอการตรวจสอบ"}
        </Text>
    </TouchableOpacity>
)}


                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noCourseText}>❌ คุณยังไม่ได้จองคอร์สใดๆ</Text>
          )
        )}
      </ScrollView>
    </View>
  );
};

export default CoursesScreen;
