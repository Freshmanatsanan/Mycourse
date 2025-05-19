import { StyleSheet } from 'react-native';



const styles = StyleSheet.create({
    container1: {
      flex: 1,
      backgroundColor: "#FFF7F2",
      padding: 0,
  
    },
    container2: {
        flex: 1,
        backgroundColor: "#FFF7F2",
        padding: 20,
        marginTop: 70,
      },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 10,
    },
    salesSummary: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    summaryBox: {
      backgroundColor: "#FFFFFF",
      padding: 20,
      borderRadius: 10,
      width: "48%",
      alignItems: "center",
      textAlign: "center",
    },
    activeSummaryBox: {
      backgroundColor: "#FFC0CB", // สีชมพูเมื่อเลือก
    },
    summaryText: {
      color: "#000000",
      fontSize: 14,
      marginTop: 10,
    },
    orderCard: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      elevation: 3,
    },
    orderImage: {
      width: 80,
      height: 80,
      objectFit: 'cover',
      borderRadius: 8,
      marginTop:10,
    },
    orderDetails: {
      marginLeft: 10,
      flex: 1,
    },
    orderTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    orderCount: {
      fontSize: 14,
      color: "#555",
    },
    orderPrice: {
      fontSize: 14,
      color: "#FF7D0C",
    },
    viewButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FF7D0C",
      padding: 8,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      marginLeft: 5,
    },
    noDataText: {
      fontSize: 16,
      color: "#888",
      textAlign: "center",
      marginTop: 20,
    },
    scrollView: {
      marginBottom: 20,
    },
    loadingText: {
      textAlign: "center",
      fontSize: 16,
      color: "#888",
      marginTop: 20,
    },





      // ✅ แก้ไข Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10, // ✅ ลด Padding ซ้าย
    paddingRight: 15,
    paddingVertical: 15,
    width: '100%', // ✅ ให้เต็มจอ
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f7a383',
    zIndex: 1,
  },

  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  // ✅ ปรับ Title ไปทางซ้ายมากขึ้น
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left', // ✅ ขยับให้ Align ซ้าย
    marginLeft: 20, // ✅ แก้ไขจาก `marginLeft: ,` เป็น `marginLeft: 20`
    flex: 1, // ✅ ใช้ flex เพื่อให้ขยายตามพื้นที่
  },

  highlight: {
    color: '#ffde59', // สีเหลือง
  },

  // ✅ ปรับปุ่มเมนูให้ชิดขอบซ้ายขึ้น
  menuButton: {
    position: 'absolute',
    left: 10,
  },

  // ✅ ปรับปุ่มโปรไฟล์ให้เลื่อนมาใกล้ขึ้น
  profileButton: {
    position: 'absolute',
    right: 20,
  },
  profileImage: {
    width: 40, // ✅ ปรับขนาดโปรไฟล์ให้เหมาะสม
    height: 40,
    borderRadius: 20,
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  });
export default styles;
