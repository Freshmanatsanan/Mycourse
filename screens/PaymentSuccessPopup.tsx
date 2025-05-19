import React, { useEffect, useState } from 'react';
import { View, Text, Image, Modal } from 'react-native';
import styles from '../styles/PaymentSuccessStyles';

const PaymentSuccessPopup = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    console.log("✅ ป๊อปอัปกำลังแสดง...");
    // ตั้งเวลาปิดป๊อปอัปอัตโนมัติหลังจาก 3 วินาที
    const timer = setTimeout(() => {
      setModalVisible(false);
      console.log("✅ กลับไปหน้า Home...");
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }], // ✅ กลับไปหน้า Home
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.card}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.successText}>✅ การชำระเงินสำเร็จ!</Text>
          <Text style={styles.messageText}>กำลังนำคุณกลับไปยังหน้า Home...</Text>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentSuccessPopup;
