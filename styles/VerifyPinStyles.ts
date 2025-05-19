import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const VerifyPinStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#FF7D0C',
    borderRadius: 30, // ✅ ทำให้เป็นวงกลม
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // ✅ เพิ่มเงาให้ดูเด่นขึ้น
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  backArrow: {
    fontSize: 20,
    color: '#FFFFFF',


  },
  card: {
    backgroundColor: '#FFF',
    width: width * 0.85,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 10,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  pinInput: {
    width: 40,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFE8D6',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  button: {
    backgroundColor: '#FF8000',
    borderRadius: 10,
    paddingVertical: 12,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    color: '#FF8000',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#ccc',
  },
  timerText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default VerifyPinStyles;
