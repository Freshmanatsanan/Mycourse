import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { BOOKING_MY_COURSES_API_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BookingDetailsScreen = ({ route, navigation }: any) => {
  const { courseId } = route.params;
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('⚠️ Token is missing!');
        return;
      }

      const response = await axios.get(BOOKING_MY_COURSES_API_URL(courseId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('📌 Booking Details API Response:', response.data);
      setBookingData(response.data);
    } catch (error) {
      console.error('❌ Error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7D0C" />
      </View>
    );
  }

  if (!bookingData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noBookingText}>❌ ไม่มีข้อมูลการจอง</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 ปุ่มกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* ✅ ส่วนข้อมูลคอร์ส */}
      <View style={styles.courseContainer}>
        <Image source={{ uri: bookingData.course.image_url }} style={styles.courseImage} />
        <Text style={styles.courseTitle}>{bookingData.course.title}</Text>
        <Text style={styles.courseDescription}>{bookingData.course.description}</Text>
        <Text style={styles.coursePrice}>{bookingData.course.price} บาท</Text>
      </View>

      {/* ✅ ส่วนข้อมูลผู้จอง */}
      {bookingData.bookings.map((booking: any) => (
        <View key={booking.id} style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.headerText}>ผู้จอง: {booking.student_name} ({booking.nickname_th})</Text>
            <Text style={styles.infoText}>อีเมล: {booking.user_email}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.leftSection}>
              <Text style={styles.sectionTitle}>📚 ข้อมูลนักเรียน</Text>
              <Text style={styles.infoText}>ชื่อ-นามสกุล: {booking.student_name}</Text>
              <Text style={styles.infoText}>ชื่อ (EN): {booking.student_name_en}</Text>
              <Text style={styles.infoText}>ชื่อเล่น: {booking.nickname_th}</Text>
              <Text style={styles.infoText}>ชื่อเล่น (EN): {booking.nickname_en}</Text>
              <Text style={styles.infoText}>ระดับชั้น: {booking.grade}</Text>
              <Text style={styles.infoText}>อายุ: {booking.age} ปี</Text>

              <Text style={styles.sectionTitle}>👨‍👩‍👧‍👦 ข้อมูลผู้ปกครอง</Text>
              <Text style={styles.infoText}>ชื่อเล่น: {booking.parent_nickname}</Text>
              <Text style={styles.infoText}>โทรศัพท์: {booking.phone}</Text>
              <Text style={styles.infoText}>Line ID: {booking.line_id || '-'}</Text>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.sectionTitle}>💳 การชำระเงิน</Text>
              <Text style={[styles.infoText, styles.paymentStatus]}>
                สถานะ: {booking.booking_status === 'pending' ? 'รอตรวจสอบ' : 'ยืนยันแล้ว'}
              </Text>

              {booking.payment_slip ? (
                <View style={styles.paymentSlipContainer}>
                  <Text style={styles.sectionTitle}>📷 สลิปการโอน</Text>
                  <Image source={{ uri: booking.payment_slip }} style={styles.paymentSlip} />
                </View>
              ) : (
                <Text style={styles.noSlipText}>❌ ยังไม่มีการอัปโหลดสลิป</Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default BookingDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F2',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#FF7D0C',
    padding: 10,
    borderRadius: 30,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  noBookingText: {
    fontSize: 18,
    color: '#FF7D0C',
    textAlign: 'center',
    marginTop: 20,
  },
  courseContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF7D0C',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E63946',
    marginTop: 5,
  },
  bookingCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bookingHeader: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  leftSection: {
    flex: 1,
    marginRight: 10,
  },
  rightSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  paymentStatus: {
    fontWeight: 'bold',
    color: '#E63946',
  },
  paymentSlipContainer: {
    marginTop: 10,
  },
  paymentSlip: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 5,
  },
  noSlipText: {
    fontSize: 14,
    color: '#E63946',
    marginTop: 10,
  },
});
