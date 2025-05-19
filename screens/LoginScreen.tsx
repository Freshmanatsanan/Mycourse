import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RootStackParamList } from '../types';
import styles from '../styles/LoginStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import API_BASE_URL from '../config/apiConfig';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับ loading

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setLoading(true); // เริ่มโหลด
    try {
      // 🔹 เรียก API Login
      const response = await axios.post(`${API_BASE_URL}/api/login/`, {
        email,
        password,
      });

      const { access, refresh, group } = response.data; // รับค่า group (บทบาท)

      if (access) {
        // 🔹 บันทึก Token และบทบาทผู้ใช้
        await AsyncStorage.setItem('authToken', access);
        await AsyncStorage.setItem('refreshToken', refresh);
        await AsyncStorage.setItem('userRole', group);

        // 🔹 นำทางไปหน้าตามบทบาทผู้ใช้
        switch (group) {
          case 'Admin':
            navigation.reset({ index: 0, routes: [{ name: 'AdminMain' }] });
            break;
          case 'Instructor':
            navigation.reset({ index: 0, routes: [{ name: 'InstructorMain' }] });
            break;
          case 'Member':
            navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
            break;
          default:
            Alert.alert('ข้อผิดพลาด', 'ไม่สามารถระบุบทบาทผู้ใช้ได้');
        }
      } else {
        Alert.alert('ข้อผิดพลาด', 'ไม่พบ Token กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error: any) {
      console.error('Login Error:', error.response?.data || error.message);
      Alert.alert('ข้อผิดพลาด', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false); // หยุดโหลด
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/BG00.png')} style={styles.backgroundImage} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>เข้าสู่ระบบ</Text>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        {/* อีเมล */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="อีเมล"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <MaterialIcons name="email" size={24} color="#888" style={{ marginRight: 3 }} />
        </View>

        {/* รหัสผ่าน */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="รหัสผ่าน"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={24} color="#888" />
          </TouchableOpacity>
        </View>
                {/* 🔹 ลืมรหัสผ่าน */}
                <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>ลืมรหัสผ่าน?</Text>
          </TouchableOpacity>
        </View>


        {/* ปุ่มเข้าสู่ระบบ */}
        <TouchableOpacity style={[styles.loginButton, { marginBottom: 20 }]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</Text>
        </TouchableOpacity>

        {/* ลิงก์ลงทะเบียน */}
        <Text>
          คุณยังไม่มีบัญชีใช่หรือไม่?{' '}
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            ลงทะเบียน
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
