import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import HeaderAdmin from '../components/HeaderAdmin';
import styles from '../styles/AdminStyles';
import { 
  ADMIN_DASHBOARD_API_URL, 
  COURSE_REVENUE_API_URL, 
  MONTHLY_INCOME_API_URL 
} from '../config/apiConfig';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


const AdminScreen: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('ข้อผิดพลาด', 'Token ไม่ถูกต้อง');
        return;
      }

      const response = await axios.get(ADMIN_DASHBOARD_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลได้');
    }
  };

  return (
    <View style={styles.container}>
      <HeaderAdmin />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <Text style={styles.header}>สรุปข้อมูล Dashboard</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF5733" style={styles.loadingText} />
        ) : (
          <>
            {/* ✅ รายได้รวม */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryBox1}>
              <MaterialIcons name="attach-money" style={styles.summaryIcon} color="#FFC107" />
                <Text style={styles.summaryTitle1}>รายได้รวมทั้งหมด</Text>
                <Text style={styles.summaryValue}>{dashboardData.total_income} ฿</Text>
              </View>
              <View style={styles.summaryBox2}>
              <MaterialIcons name="book" style={styles.summaryIcon} color="#FFC107" />
                <Text style={styles.summaryTitle2}>รายได้จากคอร์สจอง</Text>
                <Text style={styles.summaryValue}>{dashboardData.booking_income} ฿</Text>
              </View>
              <View style={styles.summaryBox3}>
              <MaterialIcons name="video-library" style={styles.summaryIcon} color="#FFC107" />
                <Text style={styles.summaryTitle3}>รายได้จากคอร์สวิดีโอ</Text>
                <Text style={styles.summaryValue}>{dashboardData.video_income} ฿</Text>
              </View>
            </View>

            

            {/* ✅ ตารางรายได้แยกตามคอร์ส */}
            <View style={styles.tableContainer}>
              <Text style={styles.tableHeader}>รายได้จากคอร์ส</Text>
              <View style={styles.tableRow}>
                <Text style={styles.tableColumn}>ชื่อคอร์ส</Text>
                <Text style={styles.tableColumn}>ประเภท</Text>
                <Text style={styles.tableColumn}>ผู้สมัคร</Text>
                <Text style={styles.tableColumn}>รายได้</Text>
              </View>
              {dashboardData.course_revenues.map((course: any, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableColumn}>{course.title}</Text>
                  <Text style={styles.tableColumn}>{course.type}</Text>
                  <Text style={styles.tableColumn}>{course.total_students}</Text>
                  <Text style={styles.tableColumn}>{course.revenue} ฿</Text>
                </View>
              ))}
            </View>

            {/* ✅ กราฟรายได้รวม */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>รายได้รวมแต่ละเดือน</Text>
              <BarChart
                data={{
                  labels: dashboardData.monthly_income.map((item: any) => item.month), // แสดงชื่อเดือนย่อ
                  datasets: [{ data: dashboardData.monthly_income.map((item: any) => item.total_income) }]
                }}
                width={350}
                height={220}
                yAxisLabel="฿"
                chartConfig={{
                  backgroundGradientFrom: "#FFF",
                  backgroundGradientTo: "#FFF",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
                  barPercentage: 0.7, // ปรับความกว้างแท่งกราฟ
                  propsForBackgroundLines: {
                    strokeDasharray: "5,5", // เส้นกริดแบบขีด ๆ
                  },
                  propsForLabels: {
                    fontSize: 12,
                    rotation: -45, // หมุนชื่อเดือน
                  },
                }}
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AdminScreen;
