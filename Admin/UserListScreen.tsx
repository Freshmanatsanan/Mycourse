import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderAdmin from '../components/HeaderAdmin';
import { USER_LIST_API } from '../config/apiConfig';
import { useNavigation } from "@react-navigation/native";

const UserListScreen = () => {
  const [members, setMembers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [activeTab, setActiveTab] = useState('members');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log("📌 Token:", token);

        const response = await axios.get(USER_LIST_API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📌 API Response:", response.data);

        setMembers(response.data.members || []);
        setInstructors(response.data.instructors || []);
        response.data.instructors.forEach((inst) => console.log("📷 รูป:", inst.profile_picture));
        setLoading(false);
      } catch (error) {
        console.error('🚨 Error fetching users:', error.response?.data || error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <View style={styles.container1}>
      <HeaderAdmin />
      <View style={styles.container2}>
        <Text style={styles.title}>รายชื่อสมาชิกและผู้สอน</Text>

        {/* ปุ่มสลับแท็บ */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'members' && styles.activeTab]}
            onPress={() => setActiveTab('members')}
          >
            <Text style={styles.tabText}>รายชื่อสมาชิก</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'instructors' && styles.activeTab]}
            onPress={() => setActiveTab('instructors')}
          >
            <Text style={styles.tabText}>รายชื่อผู้สอน</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF5733" />
        ) : (
          <>
            {/* ✅ ตารางสมาชิก */}
            {activeTab === 'members' && (
              <ScrollView horizontal>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>ชื่อ</Text>
                    <Text style={styles.headerText}>นามสกุล</Text>
                    <Text style={styles.headerText}>อีเมล</Text>
                  </View>

                  {members.length > 0 ? (
                    members.map((member) => (
                      <View key={member.id} style={styles.tableRow}>
                        <Text style={styles.rowText}>{member.first_name}</Text>
                        <Text style={styles.rowText}>{member.last_name}</Text>
                        <Text style={styles.rowText}>{member.email}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noDataText}>ไม่มีข้อมูลสมาชิก</Text>
                  )}
                </View>
              </ScrollView>
            )}

            {/* ✅ รายชื่อผู้สอน */}
            {activeTab === 'instructors' && (
              <ScrollView contentContainerStyle={styles.listContainer}>
                <Text style={styles.sectionTitle}>👨‍🏫 รายชื่อผู้สอน</Text>

                {/* ✅ ปุ่มลงทะเบียนผู้สอน */}
                <TouchableOpacity 
                  style={styles.registerButton} 
                  onPress={() => navigation.navigate('RegisterInstructorScreen')}
                >
                  <Text style={styles.registerButtonText}>➕ ลงทะเบียนผู้สอน</Text>
                </TouchableOpacity>

                {instructors.length > 0 ? (
                  instructors.map((instructor:any) => (
                    <View key={instructor.id} style={styles.listItem}>
                      {/* ✅ แสดงรูปโปรไฟล์ผู้สอน */}
                      {instructor.profile_picture && instructor.profile_picture.startsWith("http") ? (
                        <Image 
                          source={{ uri: instructor.profile_picture }} 
                          style={styles.profileImage} 
                        />
                      ) : (
                        <Image 
                          source={require('../assets/BG.png')} 
                          style={styles.profileImage} 
                          onError={(e) => console.log("🚨 รูปโหลดไม่ได้:", instructor.profile_picture, e.nativeEvent)}
                        />
                      )}

                      <Text style={styles.listText}>👤 {instructor.first_name} {instructor.last_name}</Text>
                      <Text style={styles.listText}>✉️ {instructor.email}</Text>
                      <Text style={styles.listText}>📚 วิชาที่สอน: {instructor.subject}</Text>
                      <Text style={styles.listText}>📞 เบอร์โทร: {instructor.phone}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>ไม่มีข้อมูลผู้สอน</Text>
                )}
              </ScrollView>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: { flex: 1, backgroundColor: "#FFF7F2", padding: 0 },
  container2: { flex: 1, backgroundColor: "#FFF7F2", padding: 20, marginTop: 70 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#663399', textAlign: 'center', marginBottom: 20 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  tabButton: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, width: '45%', textAlign: 'center' },
  activeTab: { backgroundColor: '#ff5733', color: 'white' },
  tabText: { color: '#333', textAlign: 'center' },

  table: { width: '110%', alignItems: 'center' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#FF5733', padding: 10, borderRadius: 5, justifyContent: 'center' },
  headerText: { flex: 1, color: 'white', fontWeight: 'bold', textAlign: 'center' },
  tableRow: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, marginVertical: 5, borderRadius: 5, justifyContent: 'center' },
  rowText: { flex: 1, textAlign: 'center', fontSize: 14, color: '#333' },

  /* ✅ เพิ่มสไตล์รูปภาพผู้สอน */
  profileImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    marginBottom: 10 
  },

  registerButton: { backgroundColor: "#663399", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 15 },
  registerButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  noDataText: { fontSize: 16, color: '#666', textAlign: 'center', marginVertical: 10 },
  listContainer: { paddingBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#FF5733' },
  listItem: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 5, elevation: 3, alignItems: 'center' },
  listText: { fontSize: 14, color: '#333', textAlign: 'center' },
});

export default UserListScreen;
