import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../styles/InstructorScreen";
import HeaderAdmin from "../components/HeaderAdmin";
import { SALES_API_URL } from "../config/apiConfig";

const SalesScreen = () => {
  const [bookedCourses, setBookedCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [totalBooked, setTotalBooked] = useState(0);
  const [totalPurchased, setTotalPurchased] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("booking");
  const navigation = useNavigation();

  useEffect(() => {
    if (activeTab) {
      fetchSalesData();
    }
  }, [activeTab]);

  const fetchSalesData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Token not found, please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(SALES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);

      if (response.status === 200) {
        setBookedCourses(response.data.booked_courses || []);
        setPurchasedCourses(response.data.purchased_courses || []);
        setTotalBooked(response.data.booked_courses.length || 0);
        setTotalPurchased(response.data.purchased_courses.length || 0);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLoading(false);
    }
  };

  // ✅ ฟังก์ชันสำหรับแสดงข้อมูลคอร์ส
  const renderCourseItem = (course, type) => (
    <View style={styles.orderCard} key={course.course_id}>
      {course.course_image ? (
        <Image source={{ uri: decodeURI(course.course_image) }} style={styles.orderImage} />
      ) : (
        <Text style={styles.noImageText}>ไม่มีภาพ</Text>
      )}

      <View style={styles.orderDetails}>
        <Text style={styles.orderTitle}>{course.course_name || "ไม่มีชื่อคอร์ส"}</Text>
        <Text style={styles.orderCount}>จำนวน: {course.booking_count || course.purchase_count || 0}</Text>
        
        {/* ✅ เปลี่ยน `onPress` ตามประเภทของคอร์ส */}
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate(
              type === "booking" ? "BookingDetailScreenAdmin" : "VideoOrderDetailScreenAdmin",
              { courseId: course.course_id }
            )
          }
        >
          <MaterialIcons name="visibility" size={20} color="#fff" />
          <Text style={styles.buttonText}>ดูรายละเอียด</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container1}>
      <HeaderAdmin />
      <View style={styles.container2}>
        {/* ✅ ปุ่มเลือกประเภทคอร์ส */}
        <View style={styles.salesSummary}>
          <TouchableOpacity
            style={[styles.summaryBox, activeTab === "booking" && styles.activeSummaryBox]}
            onPress={() => setActiveTab("booking")}
          >
            <MaterialIcons name="event" size={24} color="#fff" />
            <Text style={styles.summaryCount}>{totalBooked || 0}</Text>
            <Text style={styles.summaryText}>คอร์สเรียนที่มีการจอง</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.summaryBox, activeTab === "video" && styles.activeSummaryBox]}
            onPress={() => setActiveTab("video")}
          >
            <MaterialIcons name="video-library" size={24} color="#fff" />
            <Text style={styles.summaryCount}>{totalPurchased || 0}</Text>
            <Text style={styles.summaryText}>คอร์สวิดีโอที่มีการซื้อ</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ รายการคอร์สเรียนที่มีการจอง */}
        {activeTab === "booking" && (
          <>
            <Text style={styles.headerText}>📚 รายการคอร์สเรียนที่มีการจอง</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FF7D0C" style={styles.loadingText} />
            ) : bookedCourses.length > 0 ? (
              <ScrollView contentContainerStyle={styles.scrollView}>
                {bookedCourses.map((course) => renderCourseItem(course, "booking"))}
              </ScrollView>
            ) : (
              <Text style={styles.noDataText}>ไม่มีข้อมูลคอร์สเรียนที่มีการจอง</Text>
            )}
          </>
        )}

        {/* ✅ รายการคอร์สวิดีโอที่มีการซื้อ */}
        {activeTab === "video" && (
          <>
            <Text style={styles.headerText}>🎥 รายการคอร์สวิดีโอที่มีการซื้อ</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FF7D0C" style={styles.loadingText} />
            ) : purchasedCourses.length > 0 ? (
              <ScrollView contentContainerStyle={styles.scrollView}>
                {purchasedCourses.map((course) => renderCourseItem(course, "video"))}
              </ScrollView>
            ) : (
              <Text style={styles.noDataText}>ไม่มีข้อมูลคอร์สวิดีโอที่มีการซื้อ</Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default SalesScreen;
