import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F2',
    alignItems: 'center',
    paddingVertical: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },

  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FF7D0C',
    borderRadius: 20,
    padding: 8,
    elevation: 3,
  },

  profileImageContainer: {
    marginTop: 60,
    alignItems: 'center',
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF7D0C',
    backgroundColor: '#FFF',
  },

  changeImageText: {
    marginTop: 10,
    fontSize: 14,
    color: '#FF7D0C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  formContainer: {
    width: '90%',
    marginTop: 20,
  },

  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  button: {
    width: '90%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  passwordButton: {
    backgroundColor: '#FFA726',
  },

  saveButton: {
    backgroundColor: '#FF7D0C',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
