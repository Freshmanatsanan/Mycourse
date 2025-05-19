import { StyleSheet } from 'react-native';

const AddCourseStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF7F2',
  },
  backButton: {
    position: 'absolute', 
    top: 10, 
    left: 20, 
    backgroundColor: '#FF7D0C', 
    padding: 10, 
    borderRadius: 30, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 3, 
    marginTop:10,
  },

  logoContainer: {
    width: '100%',
    alignItems: 'center',  // ✅ ทำให้โลโก้อยู่กึ่งกลาง
    marginBottom: 20,
  },
  logo: {
    width: 100,  // ✅ ปรับขนาดโลโก้
    height: 120,
    resizeMode: 'contain', // ✅ ทำให้ภาพไม่ถูกบีบ
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0056b3',
    marginTop:20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  imagePicker: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  imagePickerText: {
    
    
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginLeft:100,

  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddCourseStyles;
