import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/NavbarStyles';

// Import Screens สำหรับผู้สอน
import InstructorScreen from '../Instructor/InstructorScreen';
import ReservationCoursesScreen from '../Instructor/Reservation_courses';
import VideoCoursesScreen from '../Instructor/Video_courses';
import BannersScreen from '../Instructor/Banners';

const Tab = createBottomTabNavigator();

const InstructorNavbar: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarBackground: () => (
          <LinearGradient
          colors={['#90CAF9', '#F8BBD0', '#FFD699']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        ),
        tabBarStyle: {
          height: 80,
          paddingBottom: 5,
          paddingTop: 13,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
        },
        tabBarIcon: ({ focused }) => {
          const icons: Record<string, string> = {
            InstructorHome: 'dashboard',
            ReservationCourses: 'event-note',
            VideoCourses: 'play-circle-outline',
            Banners: 'photo-library',
          };

          const iconName = icons[route.name];

          return (
            <View style={focused ? styles.tabIconContainer : null}>
              <Icon
                name={iconName}
                size={focused ? 30 : 25}
                color={focused ? '#FFFFFF' : '#FF7D0C'}
              />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text style={focused ? styles.tabLabel : styles.tabLabelInactive}>
            {route.name === 'InstructorHome'
              ? 'หน้าหลัก'
              : route.name === 'ReservationCourses'
              ? 'การจอง'
              : route.name === 'VideoCourses'
              ? 'วิดีโอคอร์ส'
              : 'โฆษณา'}
          </Text>
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen name="InstructorHome" component={InstructorScreen} />
      <Tab.Screen name="ReservationCourses" component={ReservationCoursesScreen} />
      <Tab.Screen name="VideoCourses" component={VideoCoursesScreen} />
      <Tab.Screen name="Banners" component={BannersScreen} />
    </Tab.Navigator>
  );
};

export default InstructorNavbar;
