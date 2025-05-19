import React, { useEffect, useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../styles/HeaderStyles';
import { PROFILE_API_URL, } from '../config';

const Header: React.FC = () => {
  const navigation = useNavigation();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log("No token found");
          return;
        }

        const response = await axios.get(PROFILE_API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Profile API Response:", response.data); // ✅ ตรวจสอบ API Response

        if (response.data && response.data.profile_picture) {
          setProfilePicture(response.data.profile_picture);
        } else {
          console.log("No profile picture found in response.");
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePicture();
  }, []);

  return (
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
          <Image source={require('../assets/BG.png')} style={styles.profileImage} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Header;
