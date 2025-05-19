import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity, 
  FlatList
} from 'react-native';
import axios from 'axios';
import styles from '../styles/CourseDetailsStyles';
import { COURSE_DETAILS_API_URL } from '../config/apiConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CourseDetailsScreen = ({ route, navigation }: any) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(COURSE_DETAILS_API_URL(courseId));
      console.log("Course Data:", response.data);
      setCourse(response.data);
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลคอร์สได้");
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7D0C" />
        <Text style={styles.loadingText}>กำลังโหลด...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ปุ่มย้อนกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerText}>รายละเอียดเพิ่มเติม</Text>
      </View>

      {/* หัวข้อ */}
      <Text style={styles.courseTitle}>{course.course_details?.name || "ไม่พบชื่อคอร์ส"}</Text>

      {/* ภาพหลัก */}
      <View style={styles.imageContainer}>
        {course.course_details.image ? (
          <Image source={{ uri: course.course_details.image }} style={styles.mainImage} />
        ) : (
          <Text style={styles.loadingText}>ไม่มีรูปภาพ</Text>
        )}
      </View>

      {/* รายละเอียดคอร์ส */}
      <View style={styles.detailsContainer}>
  <Text style={styles.courseDescription}>
    {course.course_details?.description || "ไม่มีคำอธิบาย"}
  </Text>
  <Text style={styles.courseAdditional}>
    {course.course_details?.additional_description || ""}
  </Text>
</View>

      {/* รูปภาพเพิ่มเติม (Carousel) */}
      <FlatList
        data={[
          course.course_details.additional_image,
          course.course_details.extra_image_1,
          course.course_details.extra_image_2
        ].filter(Boolean)} // ✅ กรองเฉพาะรูปที่มีค่า ไม่ให้ส่งค่า null
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.extraImage} />
        )}
      />
    </ScrollView>
  );
};

export default CourseDetailsScreen;
