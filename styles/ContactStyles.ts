import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#5A2D82',
    marginVertical: 10,
  },
  image: {
    width: '90%',
    height: 180,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  infoSection: {
    marginHorizontal: 20,
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7D0C',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
  },
  contactSection: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 10,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#FFEBE2',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#FF7D0C',
  },
  footerItemActive: {
    alignItems: 'center',
    backgroundColor: '#FF7D0C',
    borderRadius: 10,
    padding: 5,
  },
  footerTextActive: {
    fontSize: 10,
    color: '#FFFFFF',
  },

  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 18,
  },
  profileButton: {
    marginLeft: 10,
  },
  profileIcon: {
    fontSize: 24,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FF7D0C",
  },
});

export default styles;
