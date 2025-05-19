import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,  Image,
} from 'react-native';
import axios from 'axios';
import { RESET_PASSWORD_API_URL } from '../config/apiConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';  // ✅ ใช้ Feather Icons
import styles from '../styles/ResetPasswordStyles';
import LinearGradient from 'react-native-linear-gradient';

type ResetPasswordScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ResetPasswordScreen'>;
};

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('⚠️ ข้อผิดพลาด', 'กรุณากรอกรหัสผ่านให้ครบถ้วน');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('⚠️ ข้อผิดพลาด', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('⚠️ ข้อผิดพลาด', 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัว');
      return;
    }

    try {
      const response = await axios.post(RESET_PASSWORD_API_URL, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response.data.message === 'เปลี่ยนรหัสผ่านสำเร็จ') {
        Alert.alert('✅ สำเร็จ', 'รหัสผ่านของคุณถูกเปลี่ยนแล้ว', [
          { text: 'ตกลง', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('⚠️ ข้อผิดพลาด', 'ไม่สามารถเปลี่ยนรหัสผ่านได้');
      }
    } catch (error) {
      Alert.alert('⚠️ ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>

        


      <View style={styles.card}>
        <Text style={styles.title}> ตั้งค่ารหัสผ่านใหม่</Text>
        <Image source={require('../assets/BG.png')} style={styles.icon} />
        <Text style={styles.description}>กรุณากรอกรหัสผ่านใหม่ที่ต้องการ</Text>

        {/* ✅ ช่องกรอกรหัสผ่านใหม่ */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>รหัสผ่านใหม่</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="********"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={24} color="#7c7c7c" />
            </TouchableOpacity>
          </View>
          <Text style={styles.passwordHint}>
            🔹 รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวพิมพ์ใหญ่และตัวเลข
          </Text>
        </View>

        {/* ✅ ช่องยืนยันรหัสผ่านใหม่ */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ยืนยันรหัสผ่านใหม่อีกครั้ง</Text>

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="********"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={24} color="#7c7c7c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ ปุ่มยืนยัน */}
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>ยืนยัน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;
