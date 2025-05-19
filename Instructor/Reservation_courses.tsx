import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, 
  Image, Alert 
} from "react-native";
import axios from "axios";
import styles from "../styles/Reservation_courses"; 
import InstructorsHeader from "../components/InstructorsHeader";
import { LIST_RESERVATION_COURSES_API_URL, DELETE_COURSE_API_URL ,  CLOSE_COURSE_API_URL, 
  REOPEN_COURSE_API_URL } from "../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationCourses = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const checkToken = async () => {
    const token = await AsyncStorage.getItem("authToken");
    console.log("📌 Token:", token);  // ✅ ตรวจสอบค่า Token
  };
  useEffect(() => {
    fetchCourses();
    checkToken();

  }, []);

  // ✅ ฟังก์ชันดึงข้อมูลคอร์ส
  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken"); // ✅ ดึง Token จาก AsyncStorage
      if (!token) {
        console.error("❌ No auth token found.");
        return;
      }
  
      const response = await axios.get(LIST_RESERVATION_COURSES_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ แนบ Token ไปด้วย
        },
      });
  
      setCourses(response.data);
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
  
              const response = await axios.delete(DELETE_COURSE_API_URL(courseId), {
                headers: { Authorization: `Bearer ${token}` },
              });
  
              if (response.status === 200 || response.status === 204) {
                setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
                Alert.alert("✅ ลบคอร์สสำเร็จ!");
              } else {
                Alert.alert("⚠️ ไม่สามารถลบคอร์สได้", response.data?.error || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
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
  

  // ✅ ฟังก์ชันปิดรับสมัครคอร์ส
  const handleCloseCourse = async (courseId) => {
    Alert.alert(
      "ปิดรับสมัคร",
      "คุณต้องการปิดการรับสมัครของคอร์สนี้หรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ปิด",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              if (!token) {
                console.error("Token not found.");
                return;
              }

              await axios.post(CLOSE_COURSE_API_URL(courseId), {}, {
                headers: { Authorization: `Bearer ${token}` },
              });
              

              fetchCourses();
              Alert.alert("✅ ปิดรับสมัครสำเร็จ!");
            } catch (error) {
              console.error("Error closing course:", error);
              Alert.alert("⚠️ ไม่สามารถปิดรับสมัครได้");
            }
          },
        },
      ]
    );
  };

  // ✅ ฟังก์ชันเปิดรับสมัครคอร์สอีกครั้ง
  const handleReopenCourse = async (courseId) => {
    Alert.alert(
      "เปิดรับสมัครอีกครั้ง",
      "คุณต้องการเปิดรับสมัครของคอร์สนี้อีกครั้งหรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "เปิดรับสมัคร",
          style: "default",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              if (!token) {
                console.error("Token not found.");
                return;
              }

              await axios.post(REOPEN_COURSE_API_URL(courseId), {}, {
                headers: { Authorization: `Bearer ${token}` },
              });
              

              fetchCourses();
              Alert.alert("✅ เปิดรับสมัครสำเร็จ!");
            } catch (error) {
              console.error("Error reopening course:", error);
              Alert.alert("⚠️ ไม่สามารถเปิดรับสมัครได้");
            }
          },
        },
      ]
    );
  };


  // ✅ ฟังก์ชันกำหนดสีของสถานะคอร์ส
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { color: "orange", text: "รอการอนุมัติ" };
      case "approved":
        return { color: "green", text: "อนุมัติแล้ว" };
      case "revision":
        return { color: "red", text: "ส่งกลับมาแก้ไข" };
      case "revised":
        return { color: "blue", text: "แก้ไขแล้วรอการตรวจสอบ" };
      default:
        return { color: "gray", text: "สถานะไม่ทราบ" };
    }
  };

  return (
    <View style={styles.a1}>
      <InstructorsHeader />
      <View style={styles.a2}>
        <Text style={styles.headerTitle}>📚 คอร์สเรียนแบบจอง</Text>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* ✅ ปุ่มเพิ่มคอร์ส */}
          <TouchableOpacity
            style={styles.addCourseButton}
            onPress={() => navigation.navigate("AddCourse")}
          >
            <Text style={styles.addCourseButtonText}>➕ เพิ่มคอร์สเรียน</Text>
          </TouchableOpacity>

          {/* ✅ แสดงคอร์ส */}
          {loading ? (
            <ActivityIndicator size="large" color="#FF5733" style={styles.loadingText} />
          ) : courses.length > 0 ? (
            courses.map((course:any) => {
              const status = getStatusStyle(course.status);
              return (
                <View key={course.id} style={styles.courseCard}>
                  <Image source={{ uri: course.image_url }} style={styles.courseImage} />
                  <View style={styles.courseDetails}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.coursePrice}>💰 ราคา: {course.price} บาท</Text>
                    <Text style={styles.courseInstructor}>👨‍🏫 ผู้สอน: {course.instructor}</Text>
                    <Text style={[styles.courseStatus, { color: status.color }]}>📌 {status.text}</Text>
                    {course.status === "revision" && course.revision_message && (
                      <Text style={styles.revisionMessage}>⚠️ หมายเหตุ: {course.revision_message}</Text>
                    )}
                                    {/* ✅ ปุ่มแก้ไขและลบ */}
                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  <TouchableOpacity
                    style={{ backgroundColor: "#3498db", padding: 10, borderRadius: 5, marginRight: 30 }}
                    onPress={() => navigation.navigate("EditCourseScreen", { courseId: course.id })}
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
                {course.is_closed ? (
                        <TouchableOpacity
                          style={{ backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, marginLeft: 0 ,marginTop:6}}
                          onPress={() => handleReopenCourse(course.id)}
                        >
                          <Text style={{ color: "#fff" }}>🔓 เปิดรับสมัคร</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{ backgroundColor: "#FF5733", padding: 10, borderRadius: 5, marginLeft: 0 ,marginTop:6}}
                          onPress={() => handleCloseCourse(course.id)}
                        >
                          <Text style={{ color: "#fff" }}>🔒 ปิดรับสมัคร</Text>
                        </TouchableOpacity>
                      )}

                
                
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noDataText}>❌ ไม่มีคอร์สเรียน</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ReservationCourses;
