import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import styles from '../styles/RegisterStyles';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig'; // เพิ่ม Base URL ของ API Django

const RegisterScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!isTermsAccepted) {
      Alert.alert('ข้อผิดพลาด', 'โปรดยอมรับเงื่อนไขก่อนลงทะเบียน');
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert('ข้อผิดพลาด', 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('ข้อผิดพลาด', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      // เรียก API ของ Django
      const response = await axios.post(`${API_BASE_URL}/api/register/`, {
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
      });

      console.log('Registration response:', response.data);
      Alert.alert('สำเร็จ', 'สมัครสมาชิกสำเร็จแล้ว');
      navigation.navigate('RegistrationSuccessScreen');
    } catch (error: any) {
      console.error('Register Error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      Alert.alert('ข้อผิดพลาด', errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.backButtonText}>{'<'} กลับ</Text>
      </TouchableOpacity>

      <Text style={styles.header}>ลงทะเบียน</Text>

      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TextInput
        style={styles.input}
        placeholder="ชื่อผู้ใช้"
        onChangeText={(text) => handleChange('username', text)}
        value={formData.username}
      />

      <TextInput
        style={styles.input}
        placeholder="ชื่อ"
        onChangeText={(text) => handleChange('firstName', text)}
        value={formData.firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="นามสกุล"
        onChangeText={(text) => handleChange('lastName', text)}
        value={formData.lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}
        value={formData.email}
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        secureTextEntry
        onChangeText={(text) => handleChange('password', text)}
        value={formData.password}
      />
      <TextInput
        style={styles.input}
        placeholder="ยืนยันรหัสผ่าน"
        secureTextEntry
        onChangeText={(text) => handleChange('confirmPassword', text)}
        value={formData.confirmPassword}
      />

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          onPress={() => setIsTermsAccepted(!isTermsAccepted)}
          style={styles.checkbox}
        >
          {isTermsAccepted && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          ฉันยอมรับ{' '}
          <Text style={styles.linkText}>เงื่อนไขการให้บริการ</Text> และ{' '}
          <Text style={styles.linkText}>นโยบายความเป็นส่วนตัว</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>ลงทะเบียน</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;
