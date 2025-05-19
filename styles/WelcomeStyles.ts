import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#5A2D82',
  },
  highlight: {
    color: '#18A9E4',
    fontSize: 28,
  },
  roar:{
    color: '#FF7D0C',
    fontSize: 28,
  },
  roar1:{
    color: '#BF81B2',
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A2D82',
    marginTop: 10,
    textAlign: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 30,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 15,
    fontSize: 14,
    color: '#5A2D82',
  },
  registerLink: {
    
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default styles;
