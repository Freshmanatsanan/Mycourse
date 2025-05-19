import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/NavbarStyles';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import OurTeachersScreen from '../screens/OurTeachersScreen';
import ContactScreen from '../screens/ContactScreen';
import ProfileUserScreen from '../screens/ProfileUserScreen'; 

const Tab = createBottomTabNavigator();

const Navbar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarBackground: () => (
          <LinearGradient
          colors={['#90CAF9', '#F8BBD0', '#FFD699']}


            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
             style={{ flex: 1, shadowColor: 'transparent' }} // ✅ ลบเงา
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
            Home: 'home',
            Courses: 'menu-book',
            OurTeachers: 'groups',
            Contact: 'contact-mail',
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
            {route.name === 'Home'
              ? 'หน้าหลัก'
              : route.name === 'Courses'
              ? 'คอร์สเรียน'
              : route.name === 'OurTeachers'
              ? 'ครูของเรา'
              : 'ติดต่อเรา'}
          </Text>
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="OurTeachers" component={OurTeachersScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
    </Tab.Navigator>
  );
};

export default Navbar;
