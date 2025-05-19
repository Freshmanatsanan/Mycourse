import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, ActivityIndicator, TouchableOpacity, 
  Image, Modal,TouchableWithoutFeedback ,Alert
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../styles/BookingDetailScreen"; // ✅ ใช้ Styles สำหรับ Admin
import { ADMIN_BOOKING_DETAIL_API_URL, UPDATE_BOOKING_STATUS_API_URL } from "../config/apiConfig"; // ✅ ใช้ API Admin

const BookingDetailScreenAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  
  const { courseId } = route.params; // ✅ รับ `courseId` จาก params
  
  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            console.error("❌ Token not found, please login again.");
            setLoading(false);
            return;
        }

        const response = await axios.get(ADMIN_BOOKING_DETAIL_API_URL(courseId), {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ API Response:", response.data);

        if (response.status === 200) {
            setBookings(response.data.bookings || []);
            setCourseTitle(response.data.course.title || "ไม่พบข้อมูลคอร์ส");
        }
        setLoading(false);
    } catch (error) {
        console.error("❌ Error fetching booking details:", error);
        setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    if (!bookingId) {
        console.error("❌ bookingId ไม่ถูกต้อง:", bookingId);
        Alert.alert("⚠️ bookingId ไม่ถูกต้อง", "ไม่สามารถอัปเดตได้");
        return;
    }

    console.log("🔹 ส่ง bookingId:", bookingId, "อัปเดตเป็น", status);

    try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            Alert.alert("⚠️ Token ไม่ถูกต้อง");
            return;
        }

        const response = await axios.post(UPDATE_BOOKING_STATUS_API_URL(bookingId), 
            { status }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        Alert.alert("✅ อัปเดตสถานะสำเร็จ!", `สถานะการจองเปลี่ยนเป็น ${status}`);
        fetchBookingDetails(); // โหลดข้อมูลใหม่
    } catch (error) {
        console.error("❌ Error updating booking status:", error.response?.data || error.message);
        Alert.alert("⚠️ ไม่สามารถอัปเดตสถานะได้");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "จองสำเร็จ":
        return "green";
      case "รอการยืนยัน":
        return "orange";
      case "ยกเลิก":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        📚 รายละเอียดการจอง - <Text style={{ color: "#ff6b6b" }}>{courseTitle}</Text>
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF7D0C"  />
      ) : (
        <ScrollView style={styles.scrollView}>
          {bookings.length > 0 ? (
            bookings.map((booking:any, index) => (
              <View key={index} style={styles.bookingCard}>
                <Text style={styles.detailText}>👤 ชื่อนักเรียน (TH): {booking.student_name_th}</Text>
                <Text style={styles.detailText}>👤 ชื่อนักเรียน (EN): {booking.student_name_en}</Text>
                <Text style={styles.detailText}>🏫 ระดับชั้น: {booking.grade}</Text>
                <Text style={styles.detailText}>📞 เบอร์โทร: {booking.phone}</Text>
                <Text style={styles.detailText}>📧 อีเมลผู้จอง: {booking.email}</Text>
                <Text style={styles.detailText}>📆 วันที่จอง: {booking.booking_date}</Text>
                <Text style={styles.detailText}>📌 คอร์สที่เลือก: {booking.selected_course}</Text>

                {booking.payment_slip ? (
                  <TouchableOpacity onPress={() => {
                    setSelectedSlip(booking.payment_slip);
                    setModalVisible(true);
                  }}>
                    <Image source={{ uri: booking.payment_slip }} style={styles.slipImage} />
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.noSlipText}>❌ ไม่มีสลิป</Text>
                )}

                <Text style={[styles.statusText, { color: statusColor(booking.booking_status) }]}>
                  📌 สถานะ: {booking.booking_status}
                </Text>

                {/* ✅ ปุ่มอัปเดตสถานะ */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => updateBookingStatus(booking.id, "confirmed")}
                  >
                    <Text style={styles.buttonText}>✅ จองสำเร็จ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => updateBookingStatus(booking.id, "rejected")}
                  >
                    <Text style={styles.buttonText}>❌ จองไม่สำเร็จ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>❌ ไม่มีข้อมูลการจอง</Text>
          )}
        </ScrollView>
      )}

{/* ✅ Modal แสดงรูปสลิปขนาดใหญ่ */}
<Modal 
  visible={modalVisible} 
  transparent={true} 
  animationType="fade"
  onRequestClose={() => setModalVisible(false)} // ✅ ปิดโมดัลเมื่อกดปุ่ม Back
>
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {/* ✅ ปุ่มปิดที่สามารถคลิกได้แน่นอน */}
        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.closeButtonText}>❌ ปิด</Text>
        </TouchableOpacity>
        
        {selectedSlip && (
          <Image source={{ uri: selectedSlip }} style={styles.fullSlipImage} />
        )}
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>


      {/* ✅ ปุ่มย้อนกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>ย้อนกลับ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookingDetailScreenAdmin;
