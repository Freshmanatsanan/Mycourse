import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RegistrationSuccessScreen from './screens/RegistrationSuccessScreen';
import LoginSuccessPopup from './screens/LoginSuccessPopup';
import ForgotPasswordScreen from './screens/ForgotPassword';
import OurTeachersScreen from './screens/OurTeachersScreen';
import Navbar from './components/Navbar';
import InstructorScreen from './Instructor/InstructorScreen';
import ProfileUserScreen from './screens/ProfileUserScreen';
import AdminNavbar from './components/AdminNavbar';
import InstructorNavbar from './components/InstructorNavbar'; 
import UserListScreen from './Admin/UserListScreen';  // ตรวจสอบเส้นทางที่ถูกต้อง
import EditProfileScreen from './screens/EditProfileScreen';
import CoursesScreen from './screens/CoursesScreen';
import CourseDetailsScreen from './screens/CourseDetailsScreen';
import BookingScreen from './screens/BookingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PaymentSuccessPopup from './screens/PaymentSuccessPopup';
import BookingDetailsScreen from './screens/BookingDetailsScreen';
import BookingHistoryScreen from './screens/BookingHistoryScreen';
import VerifyPasswordScreen from './screens/VerifyPasswordScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import ProfileInstructorScreen from './Instructor/ProfileInstructorScreen';
import InstructorsHeader from './components/InstructorsHeader';
import ProfileAdminScreen from './Admin/ProfileAdminScreen';
import BookingDetailScreen from './Instructor/BookingDetailScreen';
import AddBannerScreen from './Instructor/AddBannerScreen';
import AddCourseScreen from './Instructor/AddCourseScreen';
import AddCourseDetailsScreen from './Instructor/AddCourseDetailsScreen'; 
import ReservationCourses from './Instructor/Reservation_courses';
import EditCourseScreen from './Instructor/EditCourseScreen';
import EditCourseDetailsScreen from './Instructor/EditCourseDetailsScreen';
import AdsScreen from './Admin/AdsScreen';
import BookingDetailScreenAdmin from './Admin/BookingDetailScreenAdmin';
import RegisterInstructorScreen from './Admin/RegisterInstructorScreen';
import VerifyPinScreen from './screens/VerifyPinScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
 // ปรับเส้นทางตามที่ต้องการ
 import VideoCourseDetailsScreen from './screens/VideoCourseDetailsScreen';// ✅ นำเข้า
 import VideoLessonScreen from './screens/VideoLessonScreen';
 import PurchaseVideoCourseScreen from './screens/PurchaseVideoCourseScreen';
 import VideoCourseOrdersScreen from './Instructor/VideoCourseOrdersScreen';
 import AddVideoCourseScreen from './Instructor/AddVideoCourseScreen';
 import AddVideoCourseDetailsScreen from './Instructor/AddVideoCourseDetailsScreen';
 import AddVideoLessonScreen from './Instructor/AddVideoLessonScreen';
 import VideoOrderDetailScreenAdmin from './Admin/VideoOrderDetailScreenAdmin';
import VideoCourses from './Instructor/Video_courses';
import EditVideoCourseDetailsScreen from './Instructor/EditVideoCourseDetailsScreen';
import EditVideoCourseScreen from './Instructor/EditVideoCourseScreen';
import EditVideoLessonScreen from './Instructor/EditVideoLessonScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false, // ปิด Header สำหรับทุก Screens
        }}
      >
        {/* Screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccessScreen} />
        <Stack.Screen name="LoginSuccessPopup" component={LoginSuccessPopup} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Instructors" component={InstructorScreen} />
        <Stack.Screen name="OurTeachers" component={OurTeachersScreen} /> 
        <Stack.Screen name="Profile" component={ProfileUserScreen} />
        <Stack.Screen name="RegistrationSuccessScreen" component={RegistrationSuccessScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="PaymentSuccessPopup" component={PaymentSuccessPopup} />
        <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} /> 
        <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} /> 
        <Stack.Screen name="VerifyPassword" component={VerifyPasswordScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="ProfileInstructorScreen" component={ProfileInstructorScreen} />
        <Stack.Screen name="ProfileAdminScreen" component={ProfileAdminScreen} />
        <Stack.Screen name="InstructorScreen" component={InstructorScreen}  />
        <Stack.Screen name="BookingDetailScreen" component={BookingDetailScreen}  />
        <Stack.Screen name="AddBannerScreen" component={AddBannerScreen} />
        <Stack.Screen name="AddCourseDetails" component={AddCourseDetailsScreen} />
        <Stack.Screen name="ReservationCourses" component={ReservationCourses} />
        <Stack.Screen name="EditCourseScreen" component={EditCourseScreen} />
        <Stack.Screen name="EditCourseDetailsScreen" component={EditCourseDetailsScreen} />
        <Stack.Screen name="AdsScreen" component={AdsScreen} />
        <Stack.Screen name="BookingDetailScreenAdmin" component={BookingDetailScreenAdmin} />
        <Stack.Screen name="RegisterInstructorScreen" component={RegisterInstructorScreen} />
        <Stack.Screen name="UserListScreen" component={UserListScreen} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
        <Stack.Screen name="VerifyPin" component={VerifyPinScreen} />
        <Stack.Screen name="VideoCourseDetailsScreen" component={VideoCourseDetailsScreen} />
        <Stack.Screen name="VideoLessonScreen" component={VideoLessonScreen} />
        <Stack.Screen name="PurchaseVideoCourseScreen" component={PurchaseVideoCourseScreen} />
        <Stack.Screen name="VideoCourseOrdersScreen" component={VideoCourseOrdersScreen} />
        <Stack.Screen name="AddVideoCourseScreen" component={AddVideoCourseScreen} />
        <Stack.Screen name="AddVideoCourseDetailsScreen" component={AddVideoCourseDetailsScreen} />
        <Stack.Screen name="AddVideoLessonScreen" component={AddVideoLessonScreen} />
        <Stack.Screen name="VideoOrderDetailScreenAdmin" component={VideoOrderDetailScreenAdmin} />
        <Stack.Screen name="VideoCourses" component={VideoCourses} />
        <Stack.Screen name="EditVideoCourseScreen" component={EditVideoCourseScreen} />
        <Stack.Screen name="EditVideoCourseDetailsScreen" component={EditVideoCourseDetailsScreen} />
        <Stack.Screen name="EditVideoLessonScreen" component={EditVideoLessonScreen} />













        <Stack.Screen name="InstructorsHeader" component={InstructorsHeader} />

        <Stack.Screen name="AddCourse" component={AddCourseScreen} />

        {/* Main Navbar */}
        <Stack.Screen name="Main" component={Navbar} />

        <Stack.Screen name="InstructorMain" component={InstructorNavbar} />

        <Stack.Screen name="AdminMain" component={AdminNavbar} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;