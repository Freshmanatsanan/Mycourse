import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/NavbarStyles';
import AdsScreen from '../Admin/AdsScreen';
// Import Screens สำหรับแอดมิน
import AdminScreen from '../Admin/AdminScreen';
import ReservationCoursesScreen from '../Admin/@Reservation_courses';
import VideoCoursesScreen from '../Admin/@Video_courses';
import SalesScreen from '../Admin/SalesScreen';
import UserListScreen from '../Admin/UserListScreen';

const Tab = createBottomTabNavigator();

const AdminNavbar: React.FC = () => {
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
            AdminScreen: 'space-dashboard',
             ReservationCourses: 'event-note',
             VideoCourses: 'play-circle-outline',
             Sales: 'point-of-sale',
             UserList: 'supervised-user-circle',
             Ads: 'campaign',
           };

          const iconName = icons[route.name];

          return (
            <View style={focused ? styles.tabIconContainer : null}>
              <Icon
                name={iconName}
                size={focused ? 30 : 25}
                color={focused ? '#FFFFFF' : '#FFA500'}
              />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text style={focused ? styles.tabLabel : styles.tabLabelInactive}>
            {route.name === 'AdminScreen'
              ? 'Dashboard'
              : route.name === 'ReservationCourses'
              ? 'คอร์สเรียนแบบจอง'
              : route.name === 'VideoCourses'
              ? 'คอร์สเรียนแบบวิดีโอ'
              : route.name === 'Sales'
              ? 'การขาย'
              : route.name === 'UserList'
              ? 'รายชื่อ'
              : 'โฆษณา'}
          </Text>
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen name="AdminScreen" component={AdminScreen} />
      <Tab.Screen name="ReservationCourses" component={ReservationCoursesScreen} />
      <Tab.Screen name="VideoCourses" component={VideoCoursesScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="UserList" component={UserListScreen} />
      <Tab.Screen name="Ads" component={AdsScreen} />
    </Tab.Navigator>
  );
};

export default AdminNavbar;
