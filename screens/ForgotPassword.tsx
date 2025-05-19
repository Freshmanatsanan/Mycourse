import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import styles from '../styles/ForgotPasswordStyles'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import { RootStackParamList } from '../types'; 
import { REQUEST_RESET_PASSWORD_API_URL } from '../config/apiConfig'; // ✅ นำเข้า API URL

type ForgotPasswordProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกอีเมล');
      return;
    }
  
    console.log('📡 Requesting Reset Password:', REQUEST_RESET_PASSWORD_API_URL);
  
    setLoading(true);
    try {
      const response = await axios.post(REQUEST_RESET_PASSWORD_API_URL, { email });
      console.log('✅ API Response:', response.data);
  
      Alert.alert('สำเร็จ', response.data.message);
      navigation.navigate('VerifyPin', { email });
    } catch (error: any) {
      console.error('🚨 Forgot Password Error:', error.response?.data || error.message);
      Alert.alert('ข้อผิดพลาด', error.response?.data?.error || 'ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่าน');
    }
    setLoading(false);
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>กู้คืนรหัสผ่าน</Text>
        <Image source={require('../assets/bb.png')} style={styles.icon} />
        <Text style={styles.description}>
          โปรดกรอกอีเมลที่ลงทะเบียนไว้เพื่อกู้คืนรหัสผ่าน{'\n'}
          ระบบจะส่งรหัส PIN 6 หลักไปยังอีเมลของคุณ
        </Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกอีเมล"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>ยืนยัน</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword;
