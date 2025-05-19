import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/RegistrationSuccessStyles';

const RegistrationSuccessScreen = ({ navigation }: any) => {
    const [modalVisible, setModalVisible] = useState(true); // เริ่มต้นให้แสดง Modal
  
    useEffect(() => {
      // ตั้งเวลาปิดป๊อปอัพอัตโนมัติหลังจาก 3 วินาที
      const timer = setTimeout(() => {
        setModalVisible(false); // ปิด Modal หลังจาก 3 วินาที
        // รีเซ็ต stack ของ Navigator และไปที่หน้า Login
        navigation.reset({
          index: 0, // รีเซ็ต stack
          routes: [{ name: 'Login' }], // นำไปที่หน้า Login
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
            source={require('../assets/BG00.png')} 
            style={styles.logo}
          />
          <View style={styles.checkmarkContainer}>
            <Text style={styles.checkmark}>✔</Text>
          </View>
          <View style={styles.success}>
            <Text style={styles.successText}>ลงทะเบียนสำเร็จ</Text>
            <View style={styles.welcome}>
                <Text style={styles.pushpin}>  📌 </Text>
                <Text style={styles.welcomeText}>Welcome To </Text>
                <Text style={styles.highlight}> I say ROAR!</Text>
                </View>
          </View>



        </View>
      </View>
    </Modal>
  );
};

export default RegistrationSuccessScreen;




/*import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, StyleSheet } from 'react-native';
import styles from '../styles/RegistrationSuccessStyles';

const RegistrationSuccessScreen = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(true); // เริ่มต้นให้แสดง Modal

  useEffect(() => {
    // ตั้งเวลาปิดป๊อปอัพอัตโนมัติหลังจาก 3 วินาที
    const timer = setTimeout(() => {
      setModalVisible(false); // ปิด Modal หลังจาก 3 วินาที
      // รีเซ็ต stack ของ Navigator และไปที่หน้า Login
      navigation.reset({
        index: 0, // รีเซ็ต stack
        routes: [{ name: 'Login' }], // นำไปที่หน้า Login
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

        <View style={styles.card}>
          <Image
            source={require('../assets/logo.png')} // ใส่โลโก้ Owl
            style={styles.logo}
          />
          <View style={styles.checkmarkContainer}>
            <Text style={styles.checkmark}>✔</Text>
          </View>
          <Text style={styles.successText}>ลงทะเบียนสำเร็จ</Text>
          <Text style={styles.welcomeText}>
            Welcome To <Text style={styles.highlight}>I say ROAR!</Text>
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default RegistrationSuccessScreen; */
