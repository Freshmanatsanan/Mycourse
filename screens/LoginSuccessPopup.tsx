import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Image } from 'react-native';
import styles from '../styles/RegistrationSuccessStyles'; // ใช้สไตล์ร่วมกับ RegistrationSuccessStyles
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LoginSuccessPopup = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(true); // เริ่มต้นให้แสดง Modal

  useEffect(() => {
    // ตั้งเวลาปิดป๊อปอัพอัตโนมัติหลังจาก 3 วินาที
    const timer = setTimeout(() => {
      setModalVisible(false); // ปิด Modal หลังจาก 3 วินาที
      // รีเซ็ต stack ของ Navigator และไปที่หน้า Home
      navigation.reset({
        index: 0, // รีเซ็ต stack
        routes: [{ name: 'Home' }], // นำไปที่หน้า Home
      });
    }, 3000);

    // เคลียร์ timer เมื่อคอมโพเนนต์ถูกยกเลิก
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Modal
      animationType="fade" // ตั้งค่าการเคลื่อนไหวของ Modal
      transparent={true} // ทำให้ background เบลอ
      visible={modalVisible} // แสดงหรือซ่อน Modal
      onRequestClose={() => setModalVisible(false)} // ปิด Modal เมื่อกดปุ่มย้อนกลับบน Android
    >
      <View style={styles.modalContainer}>
        {/* การ์ดแสดงข้อความ */}
        <View style={styles.card}>
          <Image
            source={require('../assets/BG00.png')} // ใส่โลโก้
            style={styles.logo}
          />
          <View style={styles.checkmarkContainer}>
            <Text style={styles.checkmark}>✔</Text>
          </View>
          <View style={styles.success}>
            <Text style={styles.successText}>เข้าสู่ระบบสำเร็จ</Text>
            <View style={styles.welcome}>
              <MaterialIcons name="check-circle" size={30} color="green" />
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.highlight}>I say ROAR!</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LoginSuccessPopup;
