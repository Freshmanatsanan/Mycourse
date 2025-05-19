import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/WelcomeStyles'; // นำเข้า styles ที่แยกไว้

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome To 
      </Text>        
      <Text style={styles.highlight}> I  
        <Text style={styles.roar}> say </Text>
        <Text style={styles.roar1}> ROAR!</Text>
      </Text>
      <Text style={styles.subtitle}>คอร์สเรียนพัฒนาทักษะภาษา ผ่านกิจกรรม</Text>
      <Image
        source={require('../assets/logo.png')} // เปลี่ยนตามตำแหน่งโลโก้
        style={styles.logo}
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>
      <Text style={styles.registerText}>
        คุณยังไม่มีบัญชีใช่หรือไม่?{' '}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          ลงทะเบียน
        </Text>
      </Text>
    </View>
  );
};

export default WelcomeScreen;
