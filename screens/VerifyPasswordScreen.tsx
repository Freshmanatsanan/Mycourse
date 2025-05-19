import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { VERIFY_PASSWORD_API_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';  // ✅ เปลี่ยนการนำเข้า
import styles from '../styles/AuthStyles';
import LinearGradient from 'react-native-linear-gradient'; 

const VerifyPasswordScreen = ({ navigation }: any) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleVerifyPassword = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('⚠️ กรุณาเข้าสู่ระบบ');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.post(
        VERIFY_PASSWORD_API_URL,
        { current_password: currentPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.can_change) {
        Alert.alert('✅ รหัสผ่านถูกต้อง', 'ไปยังหน้าเปลี่ยนรหัสผ่าน');
        navigation.navigate('ChangePassword');
      } else {
        Alert.alert('❌ รหัสผ่านไม่ถูกต้อง', 'กรุณาลองใหม่');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      Alert.alert('❌ เกิดข้อผิดพลาด', 'ไม่สามารถตรวจสอบรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
    colors={['#fbc2eb', '#a6c1ee']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
  >
          {/* ✅ ปุ่มย้อนกลับ */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>🔑 กรุณากรอกรหัสผ่านเดิม</Text>
        <Text style={styles.subtitle}>
          เพื่อยืนยันตัวตนของคุณก่อนทำการเปลี่ยนรหัสผ่านใหม่
        </Text>

        {/* ✅ ช่องกรอกรหัสผ่าน */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="รหัสผ่านเดิม"
            secureTextEntry={!showPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={24}
              color="#7c7c7c"
            />
          </TouchableOpacity>
        </View>

        {/* ✅ ปุ่มยืนยัน */}
        <TouchableOpacity style={styles.button} onPress={handleVerifyPassword}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Feather name="search" size={20} color="#fff" />
              <Text style={styles.buttonText}>ยืนยัน</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      </LinearGradient>
  );
};

export default VerifyPasswordScreen;
