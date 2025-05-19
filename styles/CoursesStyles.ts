import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF7F2',
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

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  courseList: {
    padding: 10,
  },
  courseCard: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  courseDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
  },
  coursePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF7D0C',
  },
  button: {
    backgroundColor: '#18A9E4',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  button1: {
    backgroundColor: '#FF7D0C',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
  },
  
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80, // ความกว้างคงที่
    height: 70, // ความสูงคงที่
    borderRadius: 15, // ทำให้เป็นวงกลม (ขึ้นอยู่กับดีไซน์)
    backgroundColor: 'rgba(255, 255, 255, 0.0)', // โปร่งใส
    marginHorizontal: 5, // เพิ่มช่องว่างระหว่างปุ่ม
  },
  activeButton: {
    width: 80, // กำหนดให้ขนาดเท่ากับ footerButton
    height: 70  , // กำหนดให้ขนาดเท่ากับ footerButton
    borderRadius: 15, // ทำให้เป็นวงกลมเหมือนกัน
    backgroundColor: '#FF7D0C', // สีส้มสำหรับปุ่มที่เลือก
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // เงาสำหรับ Android
  },
  footerText: {
    fontSize: 12,
    color: '#FF7D0C',
    marginTop: 5,
    textAlign: 'center',
  },
  footerTextActive: {
    fontSize: 12,
    color: '#FFFFFF', // สีขาวสำหรับปุ่มที่เลือก
    marginTop: 5,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFF7F2',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#FF7D0C',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF7D0C',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FF7D0C",
  },

    noCourseText: {
      fontSize: 16,
      color: '#888', // ✅ สีเทาอ่อน
      textAlign: 'center',
      marginTop: 20,
      fontWeight: 'bold',
    },
    buttonPending: {
      backgroundColor: "gray", // ✅ ปุ่มสีเทา แสดงสถานะรอการตรวจสอบ
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 5,
    },
    
});

export default styles;
