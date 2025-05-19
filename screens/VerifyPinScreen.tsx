import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import styles from '../styles/VerifyPinStyles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import axios from 'axios';
import { VERIFY_RESET_PASSWORD_API_URL } from '../config/apiConfig';

type VerifyPinScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VerifyPin'>;
};

const VerifyPinScreen: React.FC<VerifyPinScreenProps> = ({ navigation }) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handlePinChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerifyPin = async () => {
    const pinCode = pin.join('');
    if (pinCode.length !== 6) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกรหัส PIN ให้ครบ 6 หลัก');
      return;
    }

    try {
      const response = await axios.post(VERIFY_RESET_PASSWORD_API_URL, {
        pin: pinCode,
      });

      if (response.data.message === 'รหัส PIN ถูกต้อง') {
        navigation.navigate('ResetPasswordScreen');
      } else {
        Alert.alert('ข้อผิดพลาด', 'รหัส PIN ไม่ถูกต้อง');
      }
    } catch (error) {
      console.log("❌ VERIFY PIN ERROR:", error.response?.data || error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถตรวจสอบรหัส PIN ได้');
    }
    
    
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>ตรวจสอบอีเมลของคุณ</Text>
        <Image source={require('../assets/bb.png')} style={styles.icon} />
        <Text style={styles.description}>กรอกรหัส PIN 6 หลักที่ส่งไปยังอีเมลของคุณ</Text>

        <View style={styles.pinContainer}>
          {pin.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.pinInput}
              keyboardType="numeric"
              maxLength={1}
              value={value}
              onChangeText={(text) => handlePinChange(text, index)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerifyPin}>
          <Text style={styles.buttonText}>ยืนยัน</Text>
        </TouchableOpacity>

        <Text style={styles.resendText}>
          คุณไม่ได้รับรหัสใช่ไหม?{' '}
          <TouchableOpacity disabled={timeLeft > 0}>
            <Text style={[styles.resendLink, timeLeft > 0 && styles.disabledText]}>
              ส่งอีกครั้ง
            </Text>
          </TouchableOpacity>
        </Text>
        <Text style={styles.timerText}>ขอรหัสใหม่ในอีก {timeLeft} วินาที</Text>
      </View>
    </View>
  );
};

export default VerifyPinScreen;
