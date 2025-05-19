import React, { useState, useEffect, useCallback } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, Image, 
  ActivityIndicator, StyleSheet, Alert 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ ใช้สำหรับดึง Token
import InstructorsHeader from "../components/InstructorsHeader";
import { useNavigation } from "@react-navigation/native";
import { BANNERS_LIST_API_URL, DELETE_BANNER_API_URL } from "../config/apiConfig"; // ✅ ใช้ API ที่ถูกต้อง

const Banners = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken"); // ✅ ดึง Token ของผู้ใช้ที่ล็อกอินอยู่
      if (!token) {
        console.error("❌ No auth token found.");
        return;
      }

      const response = await axios.get(BANNERS_LIST_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSlides(response.data);
    } catch (error) {
      console.error("⚠️ Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteSlide = (slideId:any) => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณต้องการลบสไลด์นี้ใช่หรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ลบ",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              if (!token) {
                console.error("❌ No auth token found.");
                return;
              }

              await axios.delete(DELETE_BANNER_API_URL(slideId), {  // ✅ ใช้ API ลบที่ถูกต้อง
                headers: { Authorization: `Bearer ${token}` },
              });

              setSlides((prevSlides:any) => prevSlides.filter(slide => slide.id !== slideId));
              Alert.alert("✅ ลบสไลด์สำเร็จ!");
            } catch (error) {
              console.error("❌ Error deleting slide:", error);
              Alert.alert("⚠️ ไม่สามารถลบสไลด์ได้");
            }
          },
        },
      ]
    );
  };

  // ✅ ฟังก์ชันแสดงสีของสถานะ
  const getStatusStyle = (status:any) => {
    switch (status) {
      case "pending":
        return { color: "orange", text: "⏳ รออนุมัติ" };
      case "approved":
        return { color: "green", text: "✅ อนุมัติแล้ว" };
      case "rejected":
        return { color: "red", text: "❌ ถูกปฏิเสธ" };
      default:
        return { color: "gray", text: "❓ ไม่ทราบสถานะ" };
    }
  };

  return (
    <View style={styles.container1}>
      <InstructorsHeader />

      <View style={styles.container2}>
        <Text style={styles.headerTitle}>📢 จัดการสไลด์โชว์</Text>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* ✅ ปุ่มเพิ่มสไลด์โชว์ */}
          <TouchableOpacity
            style={styles.addSlideButton}
            onPress={() => navigation.navigate("AddBannerScreen")}
          >
            <Text style={styles.addSlideButtonText}>➕ เพิ่มสไลด์โชว์</Text>
          </TouchableOpacity>

          {/* ✅ โหลดข้อมูล */}
          {loading ? (
            <ActivityIndicator size="large" color="#FF5733" style={styles.loadingText} />
          ) : slides.length > 0 ? (
            slides.map((slide:any) => {
              const status = getStatusStyle(slide.status);
              return (
                <View key={slide.id} style={styles.slideCard}>
                  <Image 
  source={{ uri: slide.image_url }} 
  style={styles.slideImage} 
  onError={() => console.error("❌ โหลดรูปไม่ได้: ", slide.image_url)}
/>
                  <View style={styles.slideDetails}>
                    <Text style={styles.slideDate}>📅 วันที่: {slide.created_at}</Text>

                    {/* ✅ สถานะของแบนเนอร์ */}
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.text}
                    </Text>

                    {/* ✅ แสดงเหตุผลที่ถูกปฏิเสธ (ถ้ามี) */}
                    {slide.status === "rejected" && slide.rejection_message && (
                      <Text style={styles.rejectionMessage}>
                        ❗ เหตุผล: {slide.rejection_message}
                      </Text>
                    )}

                    {/* ✅ ปุ่มลบสไลด์ */}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteSlide(slide.id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑 ลบ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noDataText}>❌ ไม่มีสไลด์</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "#FFF7F2",
  },
  container2: {
    flex: 1,
    backgroundColor: "#FFF7F2",
    padding: 20,
    marginTop: 70,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF5733",
    textAlign: "center",
    marginVertical: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  addSlideButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  addSlideButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  slideCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  slideImage: {
    width: "100%",
    height: 98,
    borderRadius: 2,
    marginBottom: 15,
  },
  slideDetails: {
    marginTop: 10,
  },
  slideDate: {
    fontSize: 14,
    color: "#888",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  rejectionMessage: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Banners;
