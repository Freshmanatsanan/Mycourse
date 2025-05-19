import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, Image, 
  StyleSheet, Modal, TextInput, ActivityIndicator, Alert 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderAdmin from "../components/HeaderAdmin";
import { 
  REVIEW_VIDEO_COURSES_API_URL, 
  APPROVE_VIDEO_COURSE_API_URL, 
  SEND_BACK_VIDEO_COURSE_API_URL,
  UPLOAD_VIDEO_COURSE_QR_API_URL
} from "../config/apiConfig";
import { launchImageLibrary } from "react-native-image-picker";


const AdminVideoCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [revisionMessage, setRevisionMessage] = useState("");
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedQrCode, setSelectedQrCode] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(REVIEW_VIDEO_COURSES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(response.data.courses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.error("ImagePicker Error: ", response.error);
      } else {
        setSelectedQrCode(response.assets[0].uri);
      }
    });
  };

  
  const handleApproveCourse = async () => {
    if (!selectedQrCode) {
      Alert.alert("⚠️ กรุณาอัปโหลด QR Code ก่อนอนุมัติ");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      await axios.post(APPROVE_VIDEO_COURSE_API_URL(selectedCourse.id), {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses((prev) => prev.filter((course) => course.id !== selectedCourse.id));
      setQrModalVisible(false);
      setSelectedQrCode(null);
      Alert.alert("✅ อนุมัติคอร์สสำเร็จ!");
    } catch (error) {
      console.error("❌ Error approving course:", error);
      Alert.alert("⚠️ ไม่สามารถอนุมัติคอร์สได้");
    }
  };

  const handleSendBackPress = (id) => {
    setCourseId(id);
    setModalVisible(true);
  };
  const handleApprovePress = (course) => {
    setSelectedCourse(course);
    setQrModalVisible(true);
  };

  const handleSendBackCourse = async () => {
    if (!revisionMessage.trim()) {
      Alert.alert("⚠️ กรุณากรอกเหตุผลในการส่งกลับไปแก้ไข");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      await axios.post(SEND_BACK_VIDEO_COURSE_API_URL(courseId), { revision_message: revisionMessage }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses((prev) => prev.filter((course) => course.id !== courseId));
      setModalVisible(false);
      setRevisionMessage("");
      Alert.alert("⛔ คอร์สถูกส่งกลับไปแก้ไขเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("❌ Error sending back course:", error);
      Alert.alert("⚠️ ไม่สามารถส่งกลับไปแก้ไขได้");
    }
  };

  const handleUploadQr = async () => {
    if (!selectedQrCode) {
      Alert.alert("⚠️ กรุณาอัปโหลด QR Code ก่อนอนุมัติ");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      let formData = new FormData();
      formData.append("payment_qr", {
        uri: selectedQrCode,
        name: "payment_qr.jpg",
        type: "image/jpeg",
      });

      await axios.post(UPLOAD_VIDEO_COURSE_QR_API_URL(selectedCourse.id), 
        formData, 
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          } 
        }
      );

      Alert.alert("✅ อัปโหลด QR Code สำเร็จ! กรุณากดยืนยันอนุมัติอีกครั้ง");

    } catch (error) {
      console.error("❌ Error uploading QR Code:", error);
      Alert.alert("⚠️ ไม่สามารถอัปโหลด QR Code ได้");
    }
  };


  return (
    <View style={styles.container}>
      <HeaderAdmin />
      <Text style={styles.title}>📹 ตรวจสอบคอร์สเรียนแบบวิดีโอ</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF5733" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {courses.length > 0 ? (
            courses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <Image source={{ uri: course.image_url }} style={styles.courseImage} />
                <View style={styles.courseDetails}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseText}>💰 <Text style={styles.priceText}>{course.price} ฿</Text></Text>
                  <Text style={styles.courseText}>👨‍🏫 {course.instructor}</Text>
                  <Text style={styles.courseText}>📅 {new Date(course.created_at).toLocaleString()}</Text>

                  <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.approveButton} onPress={() => handleApprovePress(course)}>
                    <Text style={styles.approveButtonText}>✅ อนุมัติ</Text>
                  </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton} onPress={() => handleSendBackPress(course.id)}>
                      <Text style={styles.buttonText}>⛔ ส่งกลับไปแก้ไข</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>ไม่มีคอร์สที่รอการตรวจสอบ</Text>
          )}
        </ScrollView>
      )}

            {/* Modal อัปโหลดสลิป */}
            <Modal transparent={true} visible={qrModalVisible} onRequestClose={() => setQrModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📤 เพิ่มสลิปการโอน</Text>
            
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>📂 เลือกไฟล์จากแกลเลอรี</Text>
            </TouchableOpacity>

            {selectedQrCode && (
              <Image source={{ uri: selectedQrCode }} style={styles.previewImage} />
            )}

            <TouchableOpacity style={styles.confirmButton} onPress={handleUploadQr}>
              <Text style={styles.buttonText}>📤 อัปโหลดสลิป</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={handleApproveCourse}>
              <Text style={styles.buttonText}>✅ ยืนยันอนุมัติ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setQrModalVisible(false)}>
              <Text style={styles.buttonText}>❌ ยกเลิก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      

      {/* Modal ส่งกลับไปแก้ไข */}
      <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.input} placeholder="เหตุผลการส่งกลับ" value={revisionMessage} onChangeText={setRevisionMessage} multiline />
            <TouchableOpacity style={styles.rejectModalButton} onPress={handleSendBackCourse}>
              <Text style={styles.buttonText}>⛔ ส่งกลับไปแก้ไข</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7F2" },
  title: { 
    fontSize: 26,
    fontWeight: "bold",
    color: "#E74C3C",
    textAlign: "center",
    marginVertical: 20,
    marginTop:100,
  },
  courseDetails: {
    flex: 1,
},
confirmButton: {
  backgroundColor: "#28a745", // สีเขียวสำหรับยืนยัน
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
  width: "100%",
  marginBottom: 10,
},
cancelButton: {
  backgroundColor: "#e74c3c", // สีแดงสำหรับยกเลิก
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
  width: "100%",
},
courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
},
courseText: {
  fontSize: 14,
  color: "#E74C3C",
  fontWeight: "bold",
  marginBottom: 5,
},
  scrollContainer: { padding: 10 },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 0,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop:10,
   },
  courseImage: { 
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#ddd",
   },
  qrImage: { width: 50, height: 50, marginVertical: 10 },
  statusText: { fontSize: 14, fontWeight: "bold" },
  buttonContainer: {
    flexDirection: "column", // ✅ แสดงปุ่มแบบแนวตั้ง
    alignItems: "center",
    marginTop: 15,
  },
  approveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // ✅ ทำให้ปุ่มมีขนาดเต็มความกว้าง
    marginBottom: 10, // ✅ เพิ่มระยะห่างระหว่างปุ่ม
  },
  approveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  rejectButton: {
    backgroundColor: "#ff9800",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // ✅ ทำให้ปุ่มมีขนาดเต็มความกว้าง
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // ✅ ทำให้พื้นหลังจางลง
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "column", // ✅ ทำให้ปุ่มแสดงแนวตั้ง
    width: "100%",
  },
  rejectModalButton: {
    backgroundColor: "#ff9800", // ✅ สีเหลืองเหมือนเว็บ
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%", // ✅ ทำให้ปุ่มเต็มความกว้าง
    marginBottom: 10,
  },
  cancelModalButton: {
    backgroundColor: "#e74c3c", // ✅ สีแดงสำหรับปุ่มยกเลิก
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadButton: { backgroundColor: "#3498db", padding: 10, borderRadius: 8, marginBottom: 10 },
  uploadButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 8,
    marginVertical: 10,
  },
});
export default AdminVideoCourses;
