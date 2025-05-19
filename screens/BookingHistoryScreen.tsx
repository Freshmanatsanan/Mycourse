import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import { USER_BOOKING_HISTORY_API_URL } from "../config/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/BookingHistoryStyles";
import { useNavigation } from "@react-navigation/native"; // ✅ ใช้ navigation
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // ✅ ใช้ไอคอน

const BookingHistoryScreen = () => {
  const navigation = useNavigation(); // ✅ ใช้ navigation
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserBookingHistory();
    };
    fetchData();
  }, []);

  const fetchUserBookingHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("⚠️ Token is missing! ผู้ใช้ยังไม่ได้ล็อกอิน");
        return;
      }

      const response = await axios.get(USER_BOOKING_HISTORY_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 ประวัติการจอง:", response.data);
      setBookingHistory(response.data);
    } catch (error) {
      console.error("❌ Error fetching booking history:", error);
      setBookingHistory([]); // ตั้งค่าเป็น array ว่างหากเกิดข้อผิดพลาด
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* ✅ ปุ่มย้อนกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}></Text>
      </TouchableOpacity>

      <Text style={styles.title}>📜 ประวัติการจองของฉัน</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF7D0C" />
      ) : bookingHistory.length > 0 ? (
        bookingHistory.map((booking:any) => (
          <View key={booking.id} style={styles.card}>
            <Text style={styles.courseTitle}>{booking.course_title}</Text>
            <Text style={styles.infoText}>📅 วันที่จอง: {booking.booking_date}</Text>
            <Text style={styles.infoText}>⏳ คอร์สที่เลือก: {booking.selected_course}</Text>
            <Text style={styles.status}>📌 สถานะการจอง: {booking.booking_status_display || "ไม่ระบุ"}</Text>
            <Text style={styles.status}>💳 การชำระเงิน: {booking.get_payment_status_display || "ไม่ระบุ"}</Text>

            {/* ตรวจสอบว่ามีสลิปหรือไม่ */}
            {booking.payment_slip_url ? (
              <Image source={{ uri: booking.payment_slip_url }} style={styles.paymentSlip} />
            ) : (
              <Text style={styles.noSlipText}>❌ ไม่มีสลิปการโอน</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noBookingText}>❌ ไม่มีประวัติการจอง</Text>
      )}

    </ScrollView>
  );
};

export default BookingHistoryScreen;
