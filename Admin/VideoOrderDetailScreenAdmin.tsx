import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, ActivityIndicator, TouchableOpacity, 
  Image, Modal, Alert, TouchableWithoutFeedback 
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { 
  VIDEO_ORDER_DETAIL_API_URL, 
  CONFIRM_VIDEO_ORDER_API_URL,
  REJECT_VIDEO_ORDER_API_URL 
} from "../config/apiConfig"; 

const VideoOrderDetailScreenAdmin = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { courseId } = route.params;  

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("⚠️ กรุณาเข้าสู่ระบบก่อน");
        return;
      }

      const url = VIDEO_ORDER_DETAIL_API_URL(courseId);  // ✅ ใช้ฟังก์ชันให้ถูกต้อง
      console.log("🔍 Fetching API URL:", url);  // ✅ Log URL เพื่อตรวจสอบ
      console.log("🔑 Auth Token:", token);  // ✅ Log Token

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ API Response:", response.data); // ✅ Log Response Data

      if (response.status === 200) {
        setOrderDetails(response.data);
      } else {
        throw new Error("❌ ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      console.error("❌ Error fetching order details:", error);
      Alert.alert("⚠️ ไม่สามารถดึงข้อมูลการจองได้");
    } finally {
      setLoading(false);
    }
};


const handleConfirmOrder = async (orderId) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            Alert.alert("⚠️ กรุณาเข้าสู่ระบบก่อน");
            return;
        }

        const apiUrl = `${CONFIRM_VIDEO_ORDER_API_URL(orderId)}`;
        console.log("🔍 API URL:", apiUrl);  // ✅ ตรวจสอบ URL
        console.log("🔑 Token:", token);  // ✅ ตรวจสอบ Token

        const response = await axios.post(apiUrl, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("✅ Confirm Response:", response.data);
        Alert.alert(response.data.message);
        fetchOrderDetails();  // ✅ โหลดข้อมูลใหม่
    } catch (error) {
        console.error("❌ Error confirming order:", error);
        Alert.alert("⚠️ ไม่สามารถยืนยันการชำระเงินได้");
    }
};

const handleRejectOrder = async (orderId) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            Alert.alert("⚠️ กรุณาเข้าสู่ระบบก่อน");
            return;
        }

        const apiUrl = REJECT_VIDEO_ORDER_API_URL(orderId);
        console.log("🔍 API URL:", apiUrl);  // ✅ ตรวจสอบ URL
        console.log("🔑 Token:", token);  // ✅ ตรวจสอบ Token

        const response = await axios.post(apiUrl, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("✅ Reject Response:", response.data);
        Alert.alert(response.data.message);
        fetchOrderDetails();  // ✅ โหลดข้อมูลใหม่
    } catch (error) {
        console.error("❌ Error rejecting order:", error);
        Alert.alert("⚠️ ไม่สามารถปฏิเสธการชำระเงินได้");
    }
};

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF7F2" }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", color: "#E74C3C", textAlign: "center", marginVertical: 20 }}>
        📹 รายละเอียดการจองคอร์สเรียนแบบวิดีโอ
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF5733" />
      ) : (
        <ScrollView style={{ padding: 10 }}>
          <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 20 }}>
            <Image source={{ uri: orderDetails?.course_image }} style={{ width: "100%", height: 200, borderRadius: 10 }} />
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>{orderDetails?.course_title}</Text>

            {orderDetails?.orders.map((order, index) => (
              <View key={index} style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 16 }}>👤 ชื่อผู้ซื้อ: {order.user}</Text>
                <Text style={{ fontSize: 14 }}>📧 อีเมล: {order.email}</Text>
                <Text style={{ fontSize: 14 }}>💰 สถานะการชำระเงิน: {order.payment_status}</Text>
                <Text style={{ fontSize: 14 }}>📅 วันที่ชำระ: {order.payment_date}</Text>
                <Text style={{ fontSize: 14 }}>💸 ราคา: {order.price} ฿</Text>

                {/* ✅ แสดงสลิปการโอนเงิน ถ้ามี */}
                {order.payment_slip ? (
                  <TouchableOpacity onPress={() => {
                    setSelectedSlip(order.payment_slip);
                    setModalVisible(true);
                  }}>
                    <Image source={{ uri: order.payment_slip }} style={{ width: 150, height: 150, borderRadius: 10, marginTop: 10 }} />
                  </TouchableOpacity>
                ) : (
                  <Text style={{ fontSize: 14, color: "red", marginTop: 10 }}>❌ ไม่มีสลิปการโอน</Text>
                )}

                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity
                    style={{ backgroundColor: "#28a745", padding: 12, borderRadius: 8, marginBottom: 10 }}
                    onPress={() => handleConfirmOrder(order.order_id)}
                  >
                    <Text style={{ color: "#fff", textAlign: "center" }}>✅ ยืนยันการชำระเงิน</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ backgroundColor: "#e74c3c", padding: 12, borderRadius: 8 }}
                    onPress={() => handleRejectOrder(order.order_id)}
                  >
                    <Text style={{ color: "#fff", textAlign: "center" }}>❌ ปฏิเสธการชำระเงิน</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Modal สำหรับแสดงสลิปการชำระเงิน */}
      <Modal 
        visible={modalVisible} 
        transparent={true} 
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: "absolute", top: 10, right: 10 }}>
                <Text style={{ fontSize: 18, color: "#e74c3c" }}>❌ ปิด</Text>
              </TouchableOpacity>
              {selectedSlip && (
                <Image source={{ uri: selectedSlip }} style={{ width: 300, height: 300, resizeMode: "contain" }} />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ปุ่มย้อนกลับ */}
      <TouchableOpacity 
        style={{ position: "absolute", top: 40, left: 20, flexDirection: "row", alignItems: "center" }}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 16 }}>ย้อนกลับ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoOrderDetailScreenAdmin;
