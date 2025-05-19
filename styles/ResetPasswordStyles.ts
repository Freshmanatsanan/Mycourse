import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ResetPasswordStyles = StyleSheet.create({
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
    backgroundColor: '#18A9E4',
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
  icon: {
    width: 100,
    height: 100,
    marginBottom: 10,
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
    color: '#18A9E4',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#613E74',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#613E74',
    marginBottom: 5,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1, // ✅ ขนาดเส้นขอบ
    borderColor: '#18A9E4', // ✅ สีขอบ

  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor:'#FFFFFF',
    
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: '#18A9E4',
    backgroundColor:'#FFFFFF',
    
  },
  passwordHint: {
    fontSize: 12,
    color: '#613E74',
    marginTop: 5,
    backgroundColor:'#FFFFFF',
  },
  button: {
    backgroundColor: '#18A9E4',
    borderRadius: 20,
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
});

export default ResetPasswordStyles;
