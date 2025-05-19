import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { VIDEO_COURSE_ORDERS_API_URL } from "../config/apiConfig";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const VideoCourseOrdersScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { courseId } = route.params as { courseId: number };

  const [course, setCourse] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const response = await axios.get(`${VIDEO_COURSE_ORDERS_API_URL(courseId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 API Response:", response.data); // Debugging

      setCourse(response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF7D0C" />
      ) : (
        <>
          {/* 🔙 ปุ่มย้อนกลับ */}
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          {course && (
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.course_title}</Text>
              <Text style={styles.courseDescription}>
                รวมคำสั่งซื้อ: {course.total_orders} รายการ
              </Text>
            </View>
          )}

          {orders.length > 0 ? (
            orders.map((order) => (
              <View key={order.order_id} style={styles.orderCard}>
                <Text style={styles.orderText}>👤 {order.buyer_name}</Text>
                <Text style={styles.orderText}>📧 {order.email}</Text>
                <Text style={styles.orderText}>📅 {order.payment_date}</Text>
                <Text style={styles.orderText}>
                  💰 สถานะการชำระเงิน:{" "}
                  <Text style={order.payment_status === "confirmed" ? styles.paid : styles.pending}>
                    {order.payment_status}
                  </Text>
                </Text>

                {order.payment_slip && (
                  <Image source={{ uri: order.payment_slip }} style={styles.paymentSlip} />
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noOrdersText}>ไม่มีคำสั่งซื้อสำหรับคอร์สนี้</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

// ✅ **เพิ่มสไตล์ให้สวยงาม**
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF7F2",
    alignItems: "center",
  },
  headerContainer: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    marginTop:5, // ทำให้แน่ใจว่าปุ่มอยู่ด้านหน้า
  },
  backButton: {
    backgroundColor: "#FF7D0C",
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  courseInfo: {
    alignItems: "center",
    marginBottom: 20,
    marginTop:20,
  },
  courseImage: {
    width: 200,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  courseDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  orderCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  paymentSlip: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginTop: 10,
  },
  noOrdersText: {
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
  paid: {
    color: "green",
    fontWeight: "bold",
  },
  pending: {
    color: "orange",
    fontWeight: "bold",
  },
});

export default VideoCourseOrdersScreen;
