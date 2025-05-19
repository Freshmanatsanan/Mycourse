import { Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF7F2',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#613E74',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#613E74',
  },
  


  logo: {
    width: 140, // กำหนดความกว้าง
    height: 140, // กำหนดความสูง
    resizeMode: 'contain', // ปรับรูปให้ไม่ผิดเพี้ยน
    marginBottom: 20, // ระยะห่างด้านล่าง
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#8E44AD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkmark: {
    fontSize: 13,
    color: '#8E44AD',
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 11,
    color: '#5D5D5D',
  },
  linkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#613E74',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 20,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default styles;
