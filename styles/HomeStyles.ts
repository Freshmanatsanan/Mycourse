import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F2',
  },

  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FF7D0C',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF7F2',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 18,
  },
  profileButton: {
    marginLeft: 10,
  },
  profileIcon: {
    fontSize: 24,
  },
  welcomeSection: {
    alignItems: 'center',
    padding: 20,

  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#666',
  },
  highlight: {
    color: '#f08',
    fontWeight: 'bold',
  },
  bannerImage: {
    width: 385,
    height: 105,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  description: {
    fontSize: 11,
    textAlign: 'center', // จัดข้อความให้อยู่กึ่งกลาง // ระยะห่างด้านบนและล่าง
    marginVertical: 2,
    color: '#5A2D82', // เปลี่ยนสีข้อความ

  },
  description0: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 2,     // 🔽 ลดขอบบนเพื่อให้ใกล้กับแบนเนอร์มากขึ้น
    marginBottom: 2,  // 🔽 ลดจาก 5 เป็น 2 เพื่อลดช่องว่าง
    fontWeight: 'bold',
    color: '#5A2D82',
  },

  description00: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: -50,     // 🔽 ลดขอบบนเพื่อให้ใกล้กับแบนเนอร์มากขึ้น
    marginBottom: 2,  // 🔽 ลดจาก 5 เป็น 2 เพื่อลดช่องว่าง
    fontWeight: 'bold',
    color: '#5A2D82',
  },
  
  linkText: {
    color: '#f08',
    textDecorationLine: 'underline',
    marginBottom: -50,
  },
  courseSection: {
    padding: 20,
  },
  sectionTitleOnsite: {
    fontSize: 13,
    marginBottom: 5,
  },
  sectionTitleOnline: {
    fontSize: 13,
    marginBottom: 5,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80, // ความสูงของ Footer
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 10, // ทำให้ Footer อยู่ด้านบนสุด
  },
  
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80, // ความกว้างคงที่
    height: 70, // ความสูงคงที่
    borderRadius: 15, // ทำให้เป็นวงกลม (ขึ้นอยู่กับดีไซน์)
    backgroundColor: 'rgba(255, 255, 255, 0.0)', // โปร่งใส
    marginHorizontal: 5, // เพิ่มช่องว่างระหว่างปุ่ม
  },
  activeButton: {
    width: 80, // กำหนดให้ขนาดเท่ากับ footerButton
    height: 70  , // กำหนดให้ขนาดเท่ากับ footerButton
    borderRadius: 15, // ทำให้เป็นวงกลมเหมือนกัน
    backgroundColor: '#FF7D0C', // สีส้มสำหรับปุ่มที่เลือก
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // เงาสำหรับ Android
  },
  footerText: {
    fontSize: 12,
    color: '#FF7D0C',
    marginTop: 5,
    textAlign: 'center',
  },
  footerTextActive: {
    fontSize: 12,
    color: '#FFFFFF', // สีขาวสำหรับปุ่มที่เลือก
    marginTop: 5,
    textAlign: 'center',
  },
  roar:{
    color: '#FF7D0C',
    fontSize: 25,
  },
  roar1:{
    color: '#BF81B2',
    fontSize: 25,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#5A2D82',
  },
  highlight1: {
    color: '#18A9E4',
    fontSize: 27,
  },

  courseGridOnline: {
    flexDirection: 'row', // จัดเป็นแถว
    flexWrap: 'wrap', // ทำให้ไหลไปบรรทัดถัดไป
    justifyContent: 'space-between', // เว้นระยะระหว่าง Card
    marginVertical: -5, 
  },
  courseGridOnsite: {
    flexDirection: 'row', // จัดเป็นแถว
    flexWrap: 'wrap', // ทำให้ไหลไปบรรทัดถัดไป
    justifyContent: 'space-between', // เว้นระยะระหว่าง Card
    marginVertical: -5, 

  },
  card: {
    width: 170, // ความกว้าง 48% ของหน้าจอ
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 5, // เว้นระยะห่างแนวตั้ง
    padding: 10, // เพิ่มระยะห่างด้านใน Card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // เงาสำหรับ Android
    marginRight: 12,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    color: '#333',
  },
  cardDescription: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
    marginBottom: 2,
  },
  cardPrice: {
    fontSize: 10,
    color: '#FF7D0C',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: -8,
  },
  cardButton: {
    backgroundColor: '#FF7D0C',
    borderRadius: 15,
    paddingVertical: 5, // ลดขนาด padding แนวตั้ง
    alignItems: 'center',
    justifyContent: 'center', // ทำให้ปุ่มอยู่กลาง
    alignSelf: 'center', // จัดปุ่มให้อยู่ตรงกลางของ card
    width: '100%',
    height:'13%', // ใช้เปอร์เซ็นต์เพื่อให้ขนาดปรับตาม Card
    marginTop: 10, // เพิ่มระยะห่างด้านบน
},
cardButton1: {
  backgroundColor: '#18A9E4',
  borderRadius: 15,
  paddingVertical: 5, // ลดขนาด padding แนวตั้ง
  alignItems: 'center',
  justifyContent: 'center', // ทำให้ปุ่มอยู่กลาง
  alignSelf: 'center', // จัดปุ่มให้อยู่ตรงกลางของ card
  width: '100%',
  height:'13%', // ใช้เปอร์เซ็นต์เพื่อให้ขนาดปรับตาม Card
  marginTop: 10, // เพิ่มระยะห่างด้านบน
},
cardButtonText: {
    color: '#fff',
    fontSize: 12, // เพิ่มขนาดฟอนต์ให้ดูชัดเจนขึ้น
    fontWeight: 'bold',
    textAlign: 'center',
},

  divider: {
    width: '100%',
    height: 1,
    marginBottom: 2,
  },
  bannerContainer: {
    width: '100%',
    maxWidth: 375,
    height: 200,
    marginTop: 10,     // 🔽 ปรับขอบบนให้ลดลง
    marginBottom: 5,  // 🔽 ปรับขอบล่างให้ลดลง
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FF7D0C",
  },
  


});

export default styles;
