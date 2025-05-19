import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import styles from "../styles/RegisterInstructorStyles";
import { REGISTER_INSTRUCTOR_API_URL } from "../config/apiConfig";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const RegisterInstructorScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const pickImage = async (setFieldValue) => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setFieldValue("profile_picture", response.assets[0]);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ ปุ่มกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#663399" />
      </TouchableOpacity>

      <Text style={styles.title}>ลงทะเบียนผู้สอน</Text>

      <Formik
        initialValues={{
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          age: "",
          subject: "",
          password: "",
          password2: "",
          profile_picture: null,
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("กรุณากรอกชื่อผู้ใช้"),
          first_name: Yup.string().required("กรุณากรอกชื่อ"),
          last_name: Yup.string().required("กรุณากรอกนามสกุล"),
          email: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
          phone: Yup.string().required("กรุณากรอกเบอร์โทร"),
          age: Yup.number().required("กรุณากรอกอายุ"),
          subject: Yup.string().required("กรุณากรอกวิชาที่สอน"),
          password: Yup.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร").required("กรุณากรอกรหัสผ่าน"),
          password2: Yup.string().oneOf([Yup.ref("password"), null], "รหัสผ่านไม่ตรงกัน").required("กรุณายืนยันรหัสผ่าน"),
        })}
        onSubmit={async (values) => {
          setLoading(true);
          console.log("📤 กำลังส่งข้อมูล:", values); // ✅ Debugging Log

          try {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
              if (key === "profile_picture" && values.profile_picture) {
                formData.append("profile_picture", {
                  uri: values.profile_picture.uri,
                  name: "profile.jpg",
                  type: "image/jpeg",
                });
              } else {
                formData.append(key, values[key]);
              }
            });

            const response = await axios.post(REGISTER_INSTRUCTOR_API_URL, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("✅ ลงทะเบียนสำเร็จ", response.data);
            Alert.alert("สำเร็จ", "ลงทะเบียนผู้สอนเรียบร้อยแล้ว!");
            navigation.navigate("UserListScreen");

          } catch (error) {
            console.error("❌ Error:", error.response ? error.response.data : error.message);

            if (error.response) {
              const errorMsg = error.response.data.error || "ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่";
              Alert.alert("เกิดข้อผิดพลาด", errorMsg);
            } else {
              Alert.alert("เกิดข้อผิดพลาด", "มีปัญหาการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ต");
            }
          }

          setLoading(false);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
          <View>
            {/* ✅ รูปโปรไฟล์ */}
            <TouchableOpacity onPress={() => pickImage(setFieldValue)} style={styles.profileContainer}>
              {values.profile_picture ? (
                <Image source={{ uri: values.profile_picture.uri }} style={styles.profileImage} />
              ) : (
                <Text style={styles.uploadText}>อัปโหลดรูปภาพ</Text>
              )}
            </TouchableOpacity>
            {errors.profile_picture && <Text style={styles.errorText}>{errors.profile_picture}</Text>}

            {/* ✅ ฟอร์มลงทะเบียน */}
            {["username", "first_name", "last_name", "email", "phone", "age", "subject"].map((field, index) => (
              <View key={index} style={styles.inputWrapper}>
                <Text style={styles.label}>{field}</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange(field)}
                  onBlur={handleBlur(field)}
                  value={values[field]}
                />
                {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
              </View>
            ))}

            {/* ✅ รหัสผ่าน */}
            {["password", "password2"].map((field, index) => (
              <View key={index} style={styles.inputWrapper}>
                <Text style={styles.label}>{field === "password" ? "รหัสผ่าน" : "ยืนยันรหัสผ่าน"}</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  onChangeText={handleChange(field)}
                  onBlur={handleBlur(field)}
                  value={values[field]}
                />
                {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
              </View>
            ))}

            {/* ✅ ปุ่มลงทะเบียน */}
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>ลงทะเบียน</Text>}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default RegisterInstructorScreen;
