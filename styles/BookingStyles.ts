import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF7F2', 
    padding: 20 
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
    shadowRadius: 3 
  },

  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 20, 
    color: '#673AB7' 
  },

  coursePreview: { 
    alignItems: 'center', 
    marginBottom: 20, 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 3 
  },

  courseImage: { 
    width: 200, 
    height: 150, 
    borderRadius: 10 
  },

  courseName: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginVertical: 10, 
    color: '#333' 
  },

  formContainer: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 3 
  },

  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginVertical: 8, 
    borderRadius: 5, 
    backgroundColor: '#FAFAFA' 
  },

  submitButton: { 
    backgroundColor: '#FF7D0C', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 3, 
    elevation: 5 
  },

  submitButtonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#555' 
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  }


});

export default styles;
