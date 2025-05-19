import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, Image, 
  StyleSheet, Alert, ActivityIndicator
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ADD_BANNER_API_URL } from "../config/apiConfig";
import InstructorsHeader from "../components/InstructorsHeader";

const AddBannerScreen = ({ navigation, route }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const options = {
      mediaType: "photo",
      maxWidth: 1200,
      maxHeight: 400,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("❌ User cancelled image picker");
      } else if (response.errorMessage) {
        console.error("⚠️ Image Picker Error:", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  const uploadBanner = async () => {
    if (!selectedImage) {
      Alert.alert("⚠ กรุณาเลือกภาพก่อนอัปโหลด!");
      return;
    }

    setUploading(true);
    const token = await AsyncStorage.getItem("authToken");

    let formData = new FormData();
    formData.append("banner_image", {
      uri: selectedImage,
      name: "banner.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(ADD_BANNER_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("✅ เพิ่มเบนเนอร์สำเร็จ!", response.data.message);

      // ✅ ส่งข้อมูลกลับไปอัปเดตหน้า Banners
      if (route.params?.refreshBanners) {
        route.params.refreshBanners();
      }

      navigation.goBack(); 
    } catch (error) {
      console.error("❌ Error uploading banner:", error);
      Alert.alert("⚠ ไม่สามารถอัปโหลดแบนเนอร์ได้");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <InstructorsHeader />
      <Text style={styles.header}>เพิ่มสไลด์เบนเนอร์</Text>
      <Text style={styles.subHeader}>เลือกและอัปโหลดภาพสไลด์โชว์</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        ) : (
          <Text style={styles.uploadText}>📷 แตะเพื่อเลือกภาพ</Text>
        )}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.uploadButton, uploading && styles.disabledButton]} 
          onPress={uploadBanner}
          disabled={uploading}
        >
          {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>✅ อัปโหลด</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>❌ ยกเลิก</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7F2",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF5733",
    textAlign: "center",
    marginTop:100,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  imagePicker: {
    width: "98%",
    height: 120,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft:5,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  uploadText: {
    fontSize: 16,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  uploadButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddBannerScreen;
