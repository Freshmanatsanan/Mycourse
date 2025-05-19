import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import styles from '../styles/PaymentStyles';
import { PAYMENT_DETAILS_API_URL, SUBMIT_PAYMENT_API_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PaymentScreen = ({ route, navigation }: any) => {
  const { bookingId } = route.params;
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    console.log("📌 Booking ID:", bookingId);
    fetchPaymentDetails();
  }, []);

  // ✅ ดึงข้อมูลการชำระเงิน
  const fetchPaymentDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Session หมดอายุ', 'กรุณาเข้าสู่ระบบใหม่');
        navigation.navigate('Login');
        return;
      }

      console.log("🔑 Token:", token);
      const response = await axios.get(PAYMENT_DETAILS_API_URL(bookingId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ API Response:", response.data);
      setPaymentData(response.data);
    } catch (error) {
      console.error('❌ Error fetching payment details:', error.response?.data || error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลการชำระเงินได้');
    } finally {
      setLoading(false);
    }
  };

  // ✅ เปิดเลือกไฟล์จากอุปกรณ์
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('❌ ผู้ใช้ยกเลิกการเลือกภาพ');
      } else if (response.errorCode) {
        console.error('❌ ImagePicker Error:', response.errorMessage);
      } else if (response?.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]?.uri);
        console.log('✅ ภาพที่เลือก:', response.assets[0]?.uri);
      }
    });
  };

  // ✅ อัปโหลดสลิปการชำระเงิน
  const submitPayment = async () => {
    if (!selectedImage) {
      Alert.alert('กรุณาเลือกไฟล์ก่อนทำการอัปโหลด');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Session หมดอายุ', 'กรุณาเข้าสู่ระบบใหม่');
        navigation.navigate('Login');
        return;
      }

      const formData = new FormData();
      formData.append('payment_slip', {
        uri: selectedImage,
        name: 'payment_slip.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post(SUBMIT_PAYMENT_API_URL(bookingId), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("✅ API Response:", response.data);
      if (response.status === 201) {
        console.log("📢 กำลังไปหน้า PaymentSuccessPopup...");
        navigation.navigate('PaymentSuccessPopup'); // ✅ ไปยังหน้าป๊อปอัป
      }
    } catch (error) {
      console.error('❌ Error submitting payment:', error.response?.data || error);
      Alert.alert('เกิดข้อผิดพลาด', `ไม่สามารถอัปโหลดสลิปได้: ${error.response?.data?.error || 'เกิดข้อผิดพลาด'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.title}>ชำระเงิน</Text>

      <View style={styles.qrContainer}>
        {paymentData?.qr_code_url ? (
          <Image source={{ uri: paymentData.qr_code_url }} style={styles.qrImage} />
        ) : (
          <Text style={styles.noQrText}>❌ ไม่พบ QR Code กรุณาติดต่อแอดมิน</Text>
        )}
      </View>

      {selectedImage && (
        <View style={styles.qrContainer}>
          <Text style={styles.accountInfo}>📌 สลิปที่เลือก</Text>
          <Image source={{ uri: selectedImage }} style={styles.qrImage} />
        </View>
      )}

      <Text style={styles.accountInfo}>เลขบัญชี: <Text style={styles.accountNumber}>133-3-65062-4</Text></Text>
      <Text style={styles.accountInfo}>ยอดชำระ: <Text style={styles.price}>{paymentData?.course_price || 'ไม่ระบุ'} บาท</Text></Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>เลือกไฟล์สลิป</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={submitPayment}>
        <Text style={styles.submitButtonText}>ยืนยันการชำระเงิน</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;
