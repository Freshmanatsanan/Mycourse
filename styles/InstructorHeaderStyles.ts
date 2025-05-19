import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F2',
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
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FF7D0C",
  },
});

export default styles;
