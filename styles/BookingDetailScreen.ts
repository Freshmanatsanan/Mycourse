import { StyleSheet ,Dimensions} from "react-native";
const { width, height } = Dimensions.get("window");
export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF7F2",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  scrollView: {
    marginTop: 10,
  },
  bookingCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  slipImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    borderRadius: 5,
    marginTop: 10,
  },
  noSlipText: {
    fontSize: 14,
    color: "red",
    fontStyle: "italic",
    marginTop: 5,
  },
  backButton: {
    backgroundColor: "#FF7D0C",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "48%",
  },
  rejectButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "48%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // ✅ ทำให้พื้นหลังจางลง
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  
  modalContent: {
    width: width * 0.9, 
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    position: "relative", // ✅ กำหนดให้ปุ่มปิดอยู่ภายใน Modal
  },
  
  fullSlipImage: {
    width: "100%", 
    height: height * 0.6, 
    resizeMode: "contain",
    borderRadius: 10,
  },
  
  closeButton: {
    position: "absolute",
    top: -10, // ✅ ปรับให้อยู่สูงขึ้นไม่ให้บังรูป
    right: -10,
    backgroundColor: "#E74C3C",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 10, // ✅ ทำให้ปุ่มอยู่ด้านบนสุด
  },
  
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
});
