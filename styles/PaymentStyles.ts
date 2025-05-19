import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF7F2', 
    padding: 20, 
    alignItems: 'center'
  },

  backButton: { 
    position: 'absolute', 
    top: 40, 
    left: 20, 
    backgroundColor: '#FF7D0C', 
    padding: 10, 
    borderRadius: 30 
  },

  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 20, 
    color: '#673AB7' 
  },

  qrContainer: { 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 3 
  },

  qrImage: { 
    width: 200, 
    height: 200, 
    borderRadius: 10 
  },

  noQrText: { 
    fontSize: 16, 
    color: 'red', 
    textAlign: 'center' 
  },

  accountInfo: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 5 
  },

  accountNumber: { 
    fontWeight: 'bold', 
    color: '#333' 
  },

  price: { 
    fontWeight: 'bold', 
    color: '#0080ff', 
    fontSize: 18 
  },

  uploadButton: { 
    backgroundColor: '#3498db', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginVertical: 10, 
    width: '90%' 
  },

  uploadButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },

  previewImage: { 
    width: 150, 
    height: 150, 
    borderRadius: 10, 
    alignSelf: 'center', 
    marginVertical: 10 
  },

  submitButton: { 
    backgroundColor: '#FF7D0C', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 20, 
    width: '90%' 
  },

  submitButtonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFF7F2' 
  },

  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#673AB7' 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
  },
  slipContainer: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  slipImage: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
    marginTop: 10,
  },
});

export default styles;
