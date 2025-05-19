import { StyleSheet } from 'react-native';

const EditCourseDetailsStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF7F2',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#18A9E4',
  },
  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: '#18A9E4',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginTop: 3,
    borderWidth: 2,
    borderColor: '#18A9E4',
    marginBottom:20,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#f39c12',
    padding: 10,
    borderRadius: 10,
  },
});

export default EditCourseDetailsStyles;
