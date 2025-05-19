import React, { useState, useEffect, useCallback } from "react"; 
import { 
  View, Text, ScrollView, TouchableOpacity, Image, 
  ActivityIndicator, StyleSheet, Alert, TextInput 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import InstructorsHeader from "../components/InstructorsHeader";
import { useNavigation } from "@react-navigation/native";
import { 
  ADMIN_PENDING_BANNERS_API_URL, 
  ADMIN_APPROVE_BANNER_API_URL, 
  ADMIN_REJECT_BANNER_API_URL 
} from "../config/apiConfig"; 

const AdsScreen = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState(""); 
  const navigation = useNavigation();

  useEffect(() => {
    fetchPendingBanners();
  }, []);

  const fetchPendingBanners = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken"); 
      if (!token) return;

      const response = await axios.get(ADMIN_PENDING_BANNERS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSlides(response.data);
    } catch (error) {
      console.error("⚠️ Error fetching pending banners:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApproveBanner = async (bannerId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      await axios.post(ADMIN_APPROVE_BANNER_API_URL(bannerId), {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSlides((prevSlides) => prevSlides.filter(slide => slide.id !== bannerId));
      Alert.alert("✅ อนุมัติโฆษณาสำเร็จ!");
    } catch (error) {
      Alert.alert("⚠️ ไม่สามารถอนุมัติโฆษณาได้");
    }
  };

  const handleRejectBanner = async (bannerId) => {
    if (!rejectReason.trim()) {
      Alert.alert("⚠️ โปรดระบุเหตุผลที่ปฏิเสธ");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      await axios.post(ADMIN_REJECT_BANNER_API_URL(bannerId), 
        { rejection_message: rejectReason }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      setSlides((prevSlides) => prevSlides.filter(slide => slide.id !== bannerId));
      setRejectReason(""); 
      Alert.alert("⛔ ปฏิเสธโฆษณาสำเร็จ!");
    } catch (error) {
      Alert.alert("⚠️ ไม่สามารถปฏิเสธโฆษณาได้");
    }
  };

  return (
    <View style={styles.container1}>
      <InstructorsHeader />
      <View style={styles.container2}>
        <Text style={styles.headerTitle}>📢 ตรวจสอบโฆษณาที่รออนุมัติ</Text>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#FF5733" style={styles.loadingText} />
          ) : slides.length > 0 ? (
            slides.map((slide) => (
              <View key={slide.id} style={styles.slideCard}>
                <Image 
                  source={{ uri: slide.image_url }} 
                  style={styles.slideImage} 
                  onError={() => console.error("❌ โหลดรูปไม่ได้: ", slide.image_url)}
                />
                <View style={styles.slideDetails}>
                  <Text style={styles.slideDate}>📅 {slide.created_at}</Text>

                  {/* ✅ ปุ่มอนุมัติ */}
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleApproveBanner(slide.id)}
                  >
                    <Text style={styles.approveButtonText}>✅ อนุมัติ</Text>
                  </TouchableOpacity>

                  {/* ✅ ปุ่มปฏิเสธ + ฟิลด์กรอกเหตุผล */}
                  <TextInput
                    style={styles.input}
                    placeholder="เหตุผลปฏิเสธ"
                    value={rejectReason}
                    onChangeText={setRejectReason}
                  />
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleRejectBanner(slide.id)}
                  >
                    <Text style={styles.rejectButtonText}>⛔ ปฏิเสธ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>❌ ไม่มีโฆษณาที่รออนุมัติ</Text>
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
    padding: 10,
    marginTop: 95,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF5733",
    textAlign: "center",
    marginVertical: 10,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  slideCard: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  slideImage: {
    width: "100%",
    height: 80,
    borderRadius: 5,
    marginBottom: 8,
  },
  slideDetails: {
    marginTop: 5,
  },
  slideDate: {
    fontSize: 12,
    color: "#888",
  },
  approveButton: {
    backgroundColor: "green",
    padding: 6,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  rejectButton: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 6,
    fontSize: 12,
    marginTop: 5,
    borderRadius: 5,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    marginTop: 10,
  },
  noDataText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});

export default AdsScreen;
