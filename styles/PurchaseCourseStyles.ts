import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA", // สีพื้นหลังโทนอ่อน
        padding: 20,
        alignItems: "center",
      },
      headerContainer: {
        position: "absolute",
        left: 20,
        zIndex: 10, // ทำให้แน่ใจว่าปุ่มอยู่ด้านหน้า
      },
      backButton: {
        backgroundColor: "#FF7D0C",
        borderRadius: 30,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      },

      backButtonText: {
        fontSize: 16,
        color: "#007AFF",
        fontWeight: "600",
      },
      courseInfo: {
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        width: "100%",
      },
      courseImage: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginBottom: 10,
      },
      courseTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
      },
      courseDescription: {
        fontSize: 14,
        textAlign: "center",
        color: "#555",
        marginBottom: 10,
      },
      coursePrice: {
        fontSize: 18,
        color: "#FF7D0C",
        fontWeight: "bold",
      },
      paymentSection: {
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        width: "100%",
      },
      paymentTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
      },
      qrCode: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        marginTop: 10,
      },
      noQrText: {
        fontSize: 14,
        color: "red",
        fontWeight: "600",
      },
      uploadButton: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        width: "80%",
      },
      uploadButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
      },
      uploadedImage: {
        width: 150,
        height: 150,
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
      },
      submitButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        width: "80%",
      },
      submitButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
      },
      modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // ทำให้พื้นหลังโปร่งแสง
        justifyContent: "center",
        alignItems: "center",
      },
      modalContent: {
        width: 250,
        padding: 20,
        backgroundColor: "#FFF",
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // ให้เงาสำหรับ Android
      },
      modalText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FF7D0C",
        marginTop: 10,
        textAlign: "center",
      },
      modalImage: {
        width: 130,
        height: 130,
        marginBottom: 10   ,

      },
    });
    

export default styles;
