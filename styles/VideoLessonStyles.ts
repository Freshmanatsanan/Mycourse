import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7F2",
  },
  backButton: {
    position: "absolute",
    top: 50, // ✅ ให้พอดีกับ notch
    left: 20,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    padding: 8,
    zIndex: 100,
    elevation: 10,
    
  },
  courseHeader: {
    alignItems: "center",
    padding: 20,
    paddingTop: 80, // ✅ ขยับลงเพื่อไม่ให้โดนปุ่มย้อนกลับทับ
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  courseImage: {
    width: 200,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
  },
  courseDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  lessonList: {
    padding: 20,
    paddingTop: 10,
  },
  lessonCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  videoContainer: {
    height: 200,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000", // ✅ กันพื้นหลังขาวตอนโหลด
    marginBottom: 10,
  },
  videoPlayer: {
    flex: 1, // ✅ ให้เต็ม container ที่กำหนดไว้
  },
  noVideoText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 10,
  },
  documentButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  documentButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  noLessonText: {
    color: "#999",
    textAlign: "center",
    fontSize: 16,
    marginTop: 30,
  },
});
