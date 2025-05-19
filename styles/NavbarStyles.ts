import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabIconContainer: {
    width: 75,
    height: 70,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 125, 12, 1)', // ✅ ใช้สีทึบแทนโปร่งใส
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, 
    marginBottom:5,
  },
  tabLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 7,
  },
  tabLabelInactive: {
    fontSize: 10,
    color: '#555',
  },
});

export default styles;
