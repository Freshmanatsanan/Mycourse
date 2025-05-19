import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import styles from "../styles/VideoLessonStyles";
import { GET_VIDEO_LESSON_API_URL } from "../config/apiConfig";
import Icon from 'react-native-vector-icons/Ionicons';

const VideoLessonScreen = ({ navigation }: any) => {
  const route = useRoute();
  const { courseId } = route.params as { courseId: number };

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideoLessons();
  }, []);

  const fetchVideoLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
        navigation.navigate("Login");
        return;
      }

      const apiUrl = GET_VIDEO_LESSON_API_URL(courseId);
      console.log(`🔗 Fetching video lessons from: ${apiUrl}`);

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 API Response:", response.data);

      setCourse(response.data.course || null);
      setLessons(response.data.lessons || []);
    } catch (err) {
      console.error("❌ Error fetching video lessons:", err);
      setError("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const renderLesson = ({ item }: { item: any }) => (
    <View style={styles.lessonCard}>
      <Text style={styles.lessonTitle}>{item.title}</Text>

      {/* ✅ ตรวจสอบ URL ของวิดีโอ */}
      {item.video_url ? (
        <View style={styles.videoContainer}>
<WebView
  source={{ uri: item.video_url }}
  style={styles.videoPlayer}
  javaScriptEnabled={true}
  allowsFullscreenVideo={true}
  allowsInlineMediaPlayback={true}
  mediaPlaybackRequiresUserAction={false}
  originWhitelist={['*']}
  domStorageEnabled={true}   // ✅ สำคัญ
  allowsProtectedMedia={true}  // ✅ สำคัญ
  mixedContentMode="always" // ✅ เพิ่มบรรทัดนี้
  onError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    Alert.alert("ไม่สามารถโหลดวิดีโอได้", nativeEvent.description || "เกิดข้อผิดพลาด");
  }}
/>



        </View>
      ) : ( 
        <Text style={styles.noVideoText}>❌ ไม่มีวิดีโอสำหรับบทเรียนนี้</Text>
      )}

      {/* ✅ ปุ่มดาวน์โหลดเอกสาร */}
      {item.document ? (
        <TouchableOpacity
          style={styles.documentButton}
          onPress={() => Linking.openURL(item.document)}
        >
          <Text style={styles.documentButtonText}>📄 ดาวน์โหลดเอกสาร</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.noDocumentText}>❌ ไม่มีเอกสารประกอบการเรียน</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
      
      {loading ? (
        <ActivityIndicator size="large" color="#FF7D0C" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          {/* ✅ แสดงข้อมูลคอร์ส */}
          {course && (
            <View style={styles.courseHeader}>
              {course.image && (
                <Image source={{ uri: course.image }} style={styles.courseImage} />
              )}
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseDescription}>{course.description}</Text>
            </View>
          )}

          {/* ✅ แสดงรายการวิดีโอ */}
          <FlatList
            data={lessons}
            renderItem={renderLesson}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.lessonList}
            nestedScrollEnabled={true}
            ListEmptyComponent={
              <Text style={styles.noLessonText}>❌ ไม่มีบทเรียนในคอร์สนี้</Text>
            }
          />
        </>
      )}
    </View>
  );
};

export default VideoLessonScreen;
