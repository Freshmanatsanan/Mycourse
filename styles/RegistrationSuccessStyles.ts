import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // ให้พื้นหลังเทาโปร่งแสง
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    backgroundColor: '#30C3FF',
    padding: 30,
    width: 350,
    height: 420,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,  // Android shadow
    shadowColor: '#000',  // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: -55   ,
  },
  checkmarkContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#FF7D0C',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderWidth: 5, // เพิ่มกรอบ
    borderColor: '#fff', // กำหนดสีของกรอบ
    padding: 10, // เพิ่มระยะห่างภายในกรอบ
  },
  checkmark: {
    fontSize: 40,
    color: '#fff',
  },
  successText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#FF7D0C',
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#5F3B80',
    marginBottom: -20,
    

  },
  welcome: {
    width: 170,
    height: 150,
    marginBottom: 5,
    borderWidth: 3, // เพิ่มกรอบ
    borderColor: '#613E74', // กำหนดสีของกรอบ
    padding: 10, // เพิ่มระยะห่างภายในกรอบ
    borderRadius: 150, // มุมโค้งของกรอบ
    backgroundColor: '#FFF7F2',
    justifyContent: 'space-between', // จัดตำแหน่งแนวตั้งให้มีระยะห่างระหว่างข้อความและ pushpin
    alignItems: 'center', // จัดตำแหน่งแนวนอนให้ตรงกลาง
    textAlign: 'center', // จัดข้อความให้อยู่กลาง

  },
  pushpin: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 0, // กำหนดระยะห่างระหว่าง pushpin และกรอบด้านล่าง
    paddingRight: 0,
  },
  
  highlight: {
    fontSize: 20,
    color: '#FF7D0C',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 26,
  },
  success:{
    width: 349,
    height: 239,
    borderWidth: 3, // เพิ่มกรอบ
    borderColor: '#613E74', // กำหนดสีของกรอบ
    padding: 0, // เพิ่มระยะห่างภายในกรอบ
    borderRadius: 40, // มุมโค้งของกรอบ
    backgroundColor: '#FFF7F2',
    justifyContent: 'space-between', // จัดตำแหน่งแนวตั้งให้มีระยะห่างระหว่างข้อความและ pushpin
    alignItems: 'center', // จัดตำแหน่งแนวนอนให้ตรงกลาง
    textAlign: 'center', // จัดข้อความให้อยู่กลาง
    marginBottom: -25   ,

  },


});

export default styles;
