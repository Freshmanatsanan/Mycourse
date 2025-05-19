import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7F2',
  },


  backgroundImage: {
    position: 'absolute', // วาง BG ด้านหลังทั้งหมด
    width: 250, // ปรับขนาดภาพ (เล็กลง)
    height: 250,
    top: '40%', // กำหนดตำแหน่งให้อยู่ตรงกลางด้านบน
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    
  },
  backArrow: {
    fontSize: 24,
    color: '#1E90FF',
  },
  card: {
    width: '90%',
    height: '65%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 0,
    borderWidth: 1, // ความหนาของเส้นกรอบ
    borderColor: '#613E74', // สีของเส้นกรอบ (เช่น สีฟ้า)
    overflow: 'hidden', // ป้องกันลูกเล่นที่ล้นออกมา
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#18A9E4',
    marginBottom: 20,
  },
  logo: {
    width: 125,
    height: 125,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    fontSize: 20,
    marginLeft: 5,
    color: '#888',
  },
  loginButton: {
    backgroundColor: '#18A9E4',
    borderRadius: 20,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 30,
    elevation: 5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  registerText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 10,
    fontSize: 14,
    color: '#1E90FF',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginLeft: 240,
  },
  
  forgotPasswordText: {
    fontSize: 14,
    color: '#613E74',
    textDecorationLine: 'underline',
  },
  

});

export default styles;
