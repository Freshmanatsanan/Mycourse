  import React, { useState, useEffect } from "react"; 
  import { 
    View, Text, ScrollView, TouchableOpacity, ActivityIndicator, 
    Image, Alert 
  } from "react-native";
  import axios from "axios";
  import styles from "../styles/Video_courses"; 
  import InstructorsHeader from "../components/InstructorsHeader";
  import { VIDEO_COURSES_API_URL, DELETE_VIDEO_COURSE_API_URL } from "../config/apiConfig";
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const VideoCourses = ({ navigation }) => {
    const [courses, setCourses] = useState([]); // ✅ เก็บข้อมูลคอร์ส
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchCourses(); // ✅ ดึงข้อมูลคอร์สวิดีโอ
    }, []);

    const fetchCourses = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.error("❌ Token not found.");
          return;
        }

        const response = await axios.get(VIDEO_COURSES_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📌 API Response:", response.data); // ✅ Debugging

        if (response.data.courses) {
          setCourses(response.data.courses);
        } else {
          console.warn("⚠ ไม่มีข้อมูลคอร์สเรียนที่ดึงมาได้");
        }
      } catch (error) {
        console.error("❌ Error fetching courses:", error);
        Alert.alert("⚠ ไม่สามารถโหลดข้อมูลคอร์สได้");
      } finally {
        setLoading(false);
      }
    };

    // ✅ ฟังก์ชันลบคอร์ส
    const handleDeleteCourse = async (courseId) => {
      Alert.alert(
        "ยืนยันการลบ",
        "คุณต้องการลบคอร์สนี้ใช่หรือไม่?",
        [
          { text: "ยกเลิก", style: "cancel" },
          {
            text: "ลบ",
            style: "destructive",
            onPress: async () => {
              try {
                const token = await AsyncStorage.getItem("authToken");
                if (!token) {
                  console.error("Token not found, please login again.");
                  return;
                }

                const response = await axios.delete(DELETE_VIDEO_COURSE_API_URL(courseId), {
                  headers: { Authorization: `Bearer ${token}` },
                });
                

                if (response.status === 200 || response.status === 204) {
                  setCourses((prev) => prev.filter((course) => course.id !== courseId));
                  Alert.alert("✅ ลบคอร์สสำเร็จ");
                } else {
                  Alert.alert("⚠️ ไม่สามารถลบคอร์สได้", response.data?.error || "เกิดข้อผิดพลาด");
                }
              } catch (error) {
                console.error("Error deleting course:", error);
                Alert.alert("⚠️ ไม่สามารถลบคอร์สได้", "กรุณาลองใหม่อีกครั้ง");
              }
            },
          },
        ]
      );
    };

    return (
      <View style={styles.a1}>
        <InstructorsHeader />
        <View style={styles.a2}>
          <Text style={styles.headerTitle}>🎥 คอร์สเรียนแบบวิดีโอ</Text>

          <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* ✅ ปุ่มเพิ่มคอร์ส */}
            <TouchableOpacity
              style={styles.addCourseButton}
              onPress={() => navigation.navigate("AddVideoCourseScreen")}
            >
              <Text style={styles.addCourseButtonText}>➕ เพิ่มคอร์สเรียน</Text>
            </TouchableOpacity>

            {/* ✅ แสดงคอร์ส */}
            {loading ? (
              <ActivityIndicator size="large" color="#FF5733" style={styles.loadingText} />
            ) : courses.length > 0 ? (
              courses.map((course:any) => (
                <View key={course.id} style={styles.courseCard}>
                  <Image source={{ uri: course.image_url }} style={styles.courseImage} />
                  <View style={styles.courseDetails}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.coursePrice}>💰 ราคา: {course.price} บาท</Text>
                    <Text style={styles.courseInstructor}>👨‍🏫 ผู้สอน: {course.instructor}</Text>
                    <Text style={styles.courseCreated}>📅 วันที่สร้าง: {course.created_at}</Text>

                    {/* ✅ แสดงข้อความการแก้ไข ถ้ามี */}
                    {course.revision_message && (
                      <Text style={styles.revisionMessage}>⚠ หมายเหตุ: {course.revision_message}</Text>
                    )}

                    {/* ✅ ปุ่มแก้ไขและลบ */}
                    <View style={{ flexDirection: "row", marginTop: 4 }}>
                      <TouchableOpacity
                        style={{ backgroundColor: "#3498db", padding: 10, borderRadius: 5, marginRight: 10 }}
                        onPress={() => navigation.navigate("EditVideoCourseScreen", { courseId: course.id })}
                      >
                        <Text style={{ color: "#fff" }}>✏️ แก้ไข</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{ backgroundColor: "#e74c3c", padding: 10, borderRadius: 5 }}
                        onPress={() => handleDeleteCourse(course.id)}
                      >
                        <Text style={{ color: "#fff" }}>🗑️ ลบ</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>❌ ไม่มีคอร์สเรียน</Text>
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

  export default VideoCourses;
