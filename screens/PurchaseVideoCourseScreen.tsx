import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { VIDEO_COURSE_DETAILS_API_URL, PURCHASE_VIDEO_COURSE_API_URL } from "../config/apiConfig";
import styles from '../styles/PurchaseCourseStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PurchaseVideoCourseScreen = ({ navigation }: any) => {
  const route = useRoute();
  const { courseId } = route.params as { courseId: number };

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentSlip, setPaymentSlip] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
        navigation.navigate("Login");
        return;
      }

      const response = await axios.get(`${PURCHASE_VIDEO_COURSE_API_URL(courseId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 API Response:", response.data);

      setCourse(response.data);
    } catch (error) {
      console.error("❌ Error fetching course details:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลคอร์สได้");
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        maxWidth: 800,
        maxHeight: 800,
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log("⛔ ผู้ใช้ยกเลิกการเลือกรูปภาพ");
        } else if (response.errorMessage) {
          Alert.alert("เกิดข้อผิดพลาด", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setPaymentSlip(response.assets[0]);
        }
      }
    );
  };

  const handlePurchase = async () => {
    if (!paymentSlip) {
      Alert.alert("⚠ กรุณาอัปโหลดสลิปการโอนเงิน");
      return;
    }

    try {
      setLoading(true);
      setModalVisible(true);

      const token = await AsyncStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("payment_slip", {
        uri: paymentSlip.uri,
        type: paymentSlip.type || "image/jpeg",
        name: "payment_slip.jpg",
      });

      const response = await axios.post(`${PURCHASE_VIDEO_COURSE_API_URL(courseId)}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Purchase Response:", response.data);

      setTimeout(() => {
        setModalVisible(false); // ปิด Modal
        navigation.goBack(); // กลับไปหน้าก่อนหน้า
      }, 3000);

    } catch (error) {
      setModalVisible(false);
      console.error("❌ Error purchasing course:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถทำรายการได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF7D0C" />
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        
          {/* 🔙 ปุ่มย้อนกลับ */}
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* ✅ แสดงข้อมูลคอร์ส */}
          {course && (
            <View style={styles.courseInfo}>
              <Image source={{ uri: course.image_url }} style={styles.courseImage} />
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseDescription}>{course.description}</Text>
              <Text style={styles.coursePrice}>💰 ราคา: {course.price} บาท</Text>
            </View>
          )}

          {/* ✅ แสดง QR Code การชำระเงิน */}
          {course?.qr_code_url ? (
            <View style={styles.paymentSection}>
              <Text style={styles.paymentTitle}>📌 สแกนคิวอาร์โค้ดเพื่อชำระเงิน</Text>
              <Image source={{ uri: course.qr_code_url }} style={styles.qrCode} />
            </View>
          ) : (
            <Text style={styles.noQrText}>⚠ ไม่มี QR Code สำหรับชำระเงิน</Text>
          )}

          {/* ✅ อัปโหลดสลิปการโอนเงิน */}
          <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
            <Text style={styles.uploadButtonText}>
              {paymentSlip ? "📸 อัปโหลดใหม่" : "📤 เลือกไฟล์สลิป"}
            </Text>
          </TouchableOpacity>

          {paymentSlip && (
            <Image source={{ uri: paymentSlip.uri }} style={styles.uploadedImage} />
          )}

          {/* ✅ ปุ่มยืนยันการซื้อ */}
          <TouchableOpacity style={styles.submitButton} onPress={handlePurchase}>
            <Text style={styles.submitButtonText}>✅ ยืนยันการซื้อ</Text>
          </TouchableOpacity>

        </ScrollView>
      )}

      {/* ✅ Modal Popup แจ้งเตือน */}
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image 
            source={require("../assets/cc.png")} // ใส่รูปที่ต้องการแสดง
            style={styles.modalImage}
          />
          <Text style={styles.modalText}>กรุณารอการตรวจสอบจากแอดมิน</Text>
        </View>
      </View>
    </Modal>

    </View>
  );
};

export default PurchaseVideoCourseScreen;
