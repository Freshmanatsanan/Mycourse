import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // ให้พื้นหลังเทาโปร่งแสง
  },
  card: {
    backgroundColor: '#FF7D0C',  // เปลี่ยนเป็นสีส้มเข้มตามที่ต้องการ
    padding: 30,
    width: 350,
    height: 420,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,  // Android shadow
    shadowColor: '#000',  // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: -55,  // ปรับให้มองเห็นได้ชัดเจนยิ่งขึ้น
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FF7D0C',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 5, // เพิ่มกรอบ
    borderColor: '#fff', // กำหนดสีของกรอบ
    padding: 10, // เพิ่มระยะห่างภายในกรอบ
  },
  checkmark: {
    fontSize: 45,
    color: '#fff',
  },
  successText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#FF7D0C',
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#5F3B80',
    marginBottom: 10, // ลดระยะห่างระหว่างข้อความ
  },
  welcome: {
    width: 170,
    height: 150,
    marginBottom: 5,
    borderWidth: 3,  // เพิ่มกรอบ
    borderColor: '#613E74',  // กำหนดสีของกรอบ
    padding: 10,  // เพิ่มระยะห่างภายในกรอบ
    borderRadius: 150,  // มุมโค้งของกรอบ
    backgroundColor: '#FFF7F2',
    justifyContent: 'space-between',  // จัดตำแหน่งแนวตั้งให้มีระยะห่างระหว่างข้อความและ pushpin
    alignItems: 'center',  // จัดตำแหน่งแนวนอนให้ตรงกลาง
    textAlign: 'center',  // จัดข้อความให้อยู่กลาง
  },
  pushpin: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,  // กำหนดระยะห่างระหว่าง pushpin และกรอบด้านล่าง
  },
  highlight: {
    fontSize: 20,
    color: '#FF7D0C',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 26,
  },
  success: {
    width: 349,
    height: 239,
    borderWidth: 3,  // เพิ่มกรอบ
    borderColor: '#613E74',  // กำหนดสีของกรอบ
    padding: 0,  // เพิ่มระยะห่างภายในกรอบ
    borderRadius: 40,  // มุมโค้งของกรอบ
    backgroundColor: '#FFF7F2',
    justifyContent: 'space-between',  // จัดตำแหน่งแนวตั้งให้มีระยะห่างระหว่างข้อความและ pushpin
    alignItems: 'center',  // จัดตำแหน่งแนวนอนให้ตรงกลาง
    textAlign: 'center',  // จัดข้อความให้อยู่กลาง
    marginBottom: -25,  // ลดระยะห่างจากส่วนด้านล่าง
  },

});

export default styles;
