import React, {  useState,useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/ContactStyles';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { PROFILE_API_URL } from '../config/apiConfig';



const ContactScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const openMap = () => {
    const url = 'https://www.google.com/maps?q=16.125,103.956'; // ลิงก์ไปยังพิกัดของสถานที่
    Linking.openURL(url);
  };

  useEffect(() => {
    fetchProfilePicture(); 
  
  }, []);

  const fetchProfilePicture = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
      const response = await axios.get(PROFILE_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.profile_picture) {
        setProfilePicture(response.data.profile_picture);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <View style={styles.searchContainer}>
            <TextInput style={styles.searchInput} placeholder="ค้นหา" />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileIcon}>👤</Text>
            )}
          </TouchableOpacity>
        </View>
      

      {/* Title */}
      <Text style={styles.title}>ติดต่อเรา</Text>

      {/* Image */}
      <Image source={require('../assets/Contact.jpg')} style={styles.image} />

      {/* Location Section */}
      <View style={styles.infoSection}>
        <Text style={styles.subtitle}>สถานที่ตั้ง</Text>
        <TouchableOpacity onPress={openMap}>
          <Text style={[styles.infoText, { color: 'blue', textDecorationLine: 'underline' }]}>
            อำเภอสุวรรณภูมิ จังหวัดร้อยเอ็ด ตึกคูหาติดกับร้าน แอทเน็ท เวดดิ้งสตูดิโอ
            ทางไปโรงเรียนอนุบาลเมืองใหม่สุวรรณภูมิ (กดเพื่อเปิดแผนที่)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hours Section */}
      <View style={styles.infoSection}>
        <Text style={styles.subtitle}>ช่วงเวลาทำการ</Text>
        <Text style={styles.infoText}>วันจันทร์ - ศุกร์ เวลา 16:30 - 18:30</Text>
        <Text style={styles.infoText}>เสาร์ - อาทิตย์ เวลา 08:30 - 16:00</Text>
      </View>

      {/* Contact Section */}
      <View style={styles.contactSection}>
        <View style={styles.contactItem}>
          <Icon name="call" size={20} color="#34C759" />
          <Text style={styles.contactText}>T.BENTEN 063-343-2534</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="person" size={20} color="#FF9500" />
          <Text style={styles.contactText}>ID BENSABA</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="facebook" size={20} color="#1877F2" />
          <Text style={styles.contactText}>I say ROAR พัฒนาทักษะภาษา</Text>
        </View>
      </View>
    </View>
  );
};

export default ContactScreen;
