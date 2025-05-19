import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Video from 'react-native-video'; // ✅ เพิ่ม import
import styles from '../styles/VideoCourseDetailsStyles';
import { VIDEO_COURSE_DETAILS_API_URL } from '../config/apiConfig';
import Icon from 'react-native-vector-icons/Ionicons';
const VideoCourseDetailsScreen = ({ route, navigation }: any) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(VIDEO_COURSE_DETAILS_API_URL(courseId)); // ✅ ใช้ฟังก์ชัน API ที่ถูกต้อง
      console.log('📌 API Response:', response.data);
      setCourse(response.data);
    } catch (error) {
      console.error('❌ Error fetching video course details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
              {/* ✅ ปุ่มย้อนกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
        
      {loading ? (
        <ActivityIndicator size="large" color="#FF7D0C" />
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>{course?.title}</Text>

          {/* ✅ รูปภาพคอร์ส */}
          <View style={styles.imageContainer}>
            {course?.image_left_url && (
              <Image source={{ uri: course.image_left_url }} style={styles.sideImage} />
            )}
            {course?.image_url && (
              <Image source={{ uri: course.image_url }} style={styles.mainImage} />
            )}
            {course?.image_right_url && (
              <Image source={{ uri: course.image_right_url }} style={styles.sideImage} />
            )}
          </View>

          {/* ✅ รายละเอียดคอร์ส */}
          <Text style={styles.description}>{course?.description}</Text>
          <Text style={styles.additionalDescription}>{course?.additional_description}</Text>

          {/* ✅ วิดีโอตัวอย่าง */}
          {course?.preview_video_url && (
            <View style={styles.videoContainer}>
              <Text style={styles.videoTitle}>วิดีโอตัวอย่าง</Text>
              <Video
                source={{ uri: course.preview_video_url }}
                style={styles.video}
                controls
                resizeMode="contain"
              />
            </View>
          )}


        </ScrollView>
      )}
    </View>
  );
};

export default VideoCourseDetailsScreen;
