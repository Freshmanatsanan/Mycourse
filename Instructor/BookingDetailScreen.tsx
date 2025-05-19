import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../styles/BookingDetailScreen";
import { INSTRUCTOR_BOOKING_DETAIL_API_URL } from "../config/apiConfig";

const BookingDetailScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
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
  
  const { courseId } = route.params; // ดึง `courseId` จาก params

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

      const response = await axios.get(INSTRUCTOR_BOOKING_DETAIL_API_URL(courseId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ API Response:", response.data); // ✅ Debug API Response

      if (response.status === 200) {
        setBookings(response.data.bookings || []);
        setCourseTitle(response.data.course.title || "ไม่พบข้อมูลคอร์ส");
        setPagination(response.data.pagination || {});
      }
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching booking details:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 รายละเอียดการจอง - <Text style={{ color: "#ff6b6b" }}>{courseTitle}</Text></Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF7D0C" style={styles.loadingText} />
      ) : (
        <ScrollView style={styles.scrollView}>
          {bookings.length > 0 ? (
            bookings.map((booking: any, index) => (
              <View key={index} style={styles.bookingCard}>
                <Text style={styles.detailText}>👤 ชื่อนักเรียน (TH): {booking.student_name_th}</Text>
                <Text style={styles.detailText}>👤 ชื่อนักเรียน (EN): {booking.student_name_en}</Text>
                <Text style={styles.detailText}>🏫 ระดับชั้น: {booking.grade}</Text>
                <Text style={styles.detailText}>📞 เบอร์โทร: {booking.phone}</Text>
                <Text style={styles.detailText}>📧 อีเมลผู้จอง: {booking.email}</Text>
                <Text style={styles.detailText}>📆 วันที่จอง: {booking.booking_date}</Text>
                <Text style={styles.detailText}>📌 คอร์สที่เลือก: {booking.selected_course}</Text>
                
                {booking.payment_slip ? (
                  <Image source={{ uri: booking.payment_slip }} style={styles.slipImage} />
                ) : (
                  <Text style={styles.noSlipText}>❌ ไม่มีสลิป</Text>
                )}

<Text style={[styles.statusText, { color: statusColor(booking.booking_status) }]}>
  📌 สถานะ: {booking.booking_status}
</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>❌ ไม่มีข้อมูลการจอง</Text>
          )}
        </ScrollView>
      )}

      {/* ✅ ปุ่มย้อนกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>ย้อนกลับ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookingDetailScreen;
