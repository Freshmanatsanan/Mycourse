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
import { CHANGE_PASSWORD_API_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/AuthStyles';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient'; 

const ChangePasswordScreen = ({ navigation }: any) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('❌ รหัสผ่านไม่ตรงกัน', 'กรุณากรอกให้ตรงกัน');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('⚠️ กรุณาเข้าสู่ระบบ');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.post(
        CHANGE_PASSWORD_API_URL,
        {
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('✅ เปลี่ยนรหัสผ่านสำเร็จ', 'กรุณาเข้าสู่ระบบใหม่');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('❌ เกิดข้อผิดพลาด', 'ไม่สามารถเปลี่ยนรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FF9AEA', '#FFA85D']}
      
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      {/* ✅ ปุ่มย้อนกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>🔄 เปลี่ยนรหัสผ่าน</Text>

        {/* ✅ ช่องกรอกรหัสผ่านใหม่ */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="รหัสผ่านใหม่"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#7c7c7c" />
          </TouchableOpacity>
        </View>

        {/* ✅ ช่องยืนยันรหัสผ่านใหม่ */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="ยืนยันรหัสผ่านใหม่"
            secureTextEntry={!showConfirmPassword}
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#7c7c7c" />
          </TouchableOpacity>
        </View>

        {/* ✅ ปุ่มบันทึกรหัสผ่าน */}
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Feather name="save" size={20} color="#fff" />
              <Text style={styles.buttonText}>บันทึก</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ChangePasswordScreen;
