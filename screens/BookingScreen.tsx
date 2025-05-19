import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import styles from '../styles/BookingStyles';
import { COURSE_DETAILS_API_URL, BOOK_COURSE_API_URL } from '../config/apiConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const BookingScreen = ({ route, navigation }: any) => {

  const { courseId } = route.params;
  

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const gradeOptions = [
    'อนุบาล 2',
    'อนุบาล 3',
    'ประถมศึกษาปีที่ 1',
    'ประถมศึกษาปีที่ 2',
    'ประถมศึกษาปีที่ 3',
    'ประถมศึกษาปีที่ 4',
    'ประถมศึกษาปีที่ 5',
    'ประถมศึกษาปีที่ 6',
    'อื่นๆ'
  ];
  const courseTimeOptions = [
    { value: 'K1', label: 'K1 = 9:00 - 10:00' },
    { value: 'K2-3', label: 'K2-3 = 10:30 - 11:30' },
    { value: 'P1-3', label: 'P1-3 = 10:30 - 11:30' },
    { value: 'P4-6', label: 'P4-6 = 10:30 - 11:30' },
  ];
  
  
  const [formData, setFormData] = useState({
    student_name: '',
    student_name_en: '',
    nickname_th: '',
    nickname_en: '',
    age: '',
    grade: 'อนุบาล 2',
    parent_nickname: '',
    phone: '',
    line_id: '',
    selected_course: 'K1',
  });

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  // ✅ ดึงข้อมูลคอร์สจาก API
  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(COURSE_DETAILS_API_URL(courseId));
      setCourse(response.data.course_details);
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลคอร์สได้');
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // ✅ ส่งข้อมูลจองคอร์สไปยัง API
  const submitBooking = async () => {
    setLoading(true);
    try {
      // ใช้ AsyncStorage แทน getAuthToken
      const token = await AsyncStorage.getItem('authToken');

      console.log("🔑 Token ที่ใช้:", token);
      console.log("📤 Request URL:", BOOK_COURSE_API_URL(courseId));
      console.log("📤 Request Payload:", JSON.stringify(formData, null, 2));

      if (!token) {
        Alert.alert('กรุณาเข้าสู่ระบบก่อนทำการจองคอร์ส');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        BOOK_COURSE_API_URL(courseId),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("✅ API Response:", response.data);

      if (response.status === 201) {
        Alert.alert('สำเร็จ', 'จองคอร์สเรียบร้อยแล้ว!');
        navigation.navigate('Payment', { bookingId: response.data.booking_id });
      }
    } catch (error) {
      console.error('❌ Error booking course:', error.response?.data || error);
      Alert.alert('เกิดข้อผิดพลาด', `ไม่สามารถจองคอร์สได้: ${error.response?.data?.error || 'เกิดข้อผิดพลาด'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* ปุ่มย้อนกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* หัวข้อ */}
      <Text style={styles.title}>จองคอร์สเรียน</Text>

      {/* แสดงรายละเอียดคอร์ส */}
      <View style={styles.coursePreview}>
        {course && (
          <>
            <Image source={{ uri: course.image }} style={styles.courseImage} />
            <Text style={styles.courseName}>{course.name}</Text>
          </>
        )}
      </View>

      {/* ฟอร์มกรอกข้อมูล */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="ชื่อ-นามสกุล (ไทย)"
          value={formData.student_name}
          onChangeText={(text) => handleInputChange('student_name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="ชื่อ-นามสกุล (อังกฤษ)"
          value={formData.student_name_en}
          onChangeText={(text) => handleInputChange('student_name_en', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="ชื่อเล่น (ไทย)"
          value={formData.nickname_th}
          onChangeText={(text) => handleInputChange('nickname_th', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="ชื่อเล่น (อังกฤษ)"
          value={formData.nickname_en}
          onChangeText={(text) => handleInputChange('nickname_en', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="อายุ"
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(text) => handleInputChange('age', text)}
        />
        {/* ✅ Picker สำหรับเลือกระดับชั้น */}
        <Picker
  selectedValue={formData.grade}
  onValueChange={(value) => handleInputChange('grade', value)}
  style={styles.picker}
>
  {gradeOptions.map((grade, index) => (
    <Picker.Item key={index} label={grade} value={grade} />
  ))}
</Picker>


        <TextInput
          style={styles.input}
          placeholder="ชื่อเล่นผู้ปกครอง"
          value={formData.parent_nickname}
          onChangeText={(text) => handleInputChange('parent_nickname', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="เบอร์โทรศัพท์"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="ไอดีไลน์ (ถ้ามี)"
          value={formData.line_id}
          onChangeText={(text) => handleInputChange('line_id', text)}
        />
        {/* ✅ Picker สำหรับเลือกช่วงเวลาที่เรียน */}
        <Picker
  selectedValue={formData.selected_course}
  onValueChange={(value) => handleInputChange('selected_course', value)}
  style={styles.picker}
>
  {courseTimeOptions.map((time, index) => (
    <Picker.Item key={index} label={time.label} value={time.value} />
  ))}
</Picker>
      </View>

      {/* ปุ่มจองคอร์ส */}
      <TouchableOpacity style={styles.submitButton} onPress={submitBooking}>
        <Text style={styles.submitButtonText}>ชำระเงิน</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookingScreen;
