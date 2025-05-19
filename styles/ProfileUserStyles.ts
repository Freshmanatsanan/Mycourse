import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F2',
    alignItems: 'center',
    paddingTop: 50,
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
  profileCard: {
    width: '90%',
    backgroundColor: '#FAFAFA',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    marginTop: 50,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  changeImageText: {
    marginTop: 10,
    color: '#7B7B7B',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  user: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#613E74',
  },
  userName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#18A9E4',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: '#EFA1C3',
  },
  historyButton: {
    backgroundColor: '#6ECFF6',
  },
  logoutButton: {
    backgroundColor: '#FFB870',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileImageContainer: {
    width: 120, // ขนาดกล่อง
    height: 120,
    borderRadius: 60, // ทำให้เป็นวงกลม
    borderWidth: 3,
    borderColor: '#FFA500', // ขอบสีส้ม
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // ป้องกันภาพเกินขอบ
    marginBottom: 10,
  },
});

export default styles;
