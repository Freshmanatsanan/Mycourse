import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F2',
    paddingHorizontal: 16,
    paddingTop: 8, // ✅ ลด padding ด้านบนเพื่อให้เนื้อหาอยู่สูงขึ้น
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7B7B7B',
  },
  backButton: {
    position: 'absolute',
    top: 30, // ✅ ขยับขึ้น
    left: 20,
    backgroundColor: '#FF7D0C',
    borderRadius: 30,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#613E74',
    textAlign: 'center',
    marginTop: 20, // ✅ ลด margin ให้เนื้อหาขยับขึ้น
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10, // ✅ ลดลงให้ภาพขึ้นสูงขึ้น
  },
  mainImage: {
    width: '95%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  detailsContainer: {
    marginTop: 10, // ✅ ลดระยะห่างให้ข้อความอยู่สูงขึ้น
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  courseDescription: {
    fontSize: 14, // ✅ ลดขนาดตัวอักษร
    color: '#613E74', // ✅ เปลี่ยนเป็นสีน้ำตาลเข้มให้อ่านง่าย
    marginBottom: 8,
    lineHeight: 20, // ✅ ปรับระยะห่างระหว่างบรรทัด
    fontWeight: '400',
    textAlign: 'center', // ✅ จัดข้อความให้อยู่ตรงกลาง
  },
  
  courseAdditional: {
    fontSize: 13, // ✅ ขนาดเล็กลงกว่า courseDescription
    color: '#18A9E4', // ✅ ใช้สีเทาเข้มให้อ่านง่าย
    lineHeight: 18, // ✅ ปรับให้เหมาะสม
    fontStyle: 'italic', // ✅ เพิ่มสไตล์ให้ดูแตกต่าง
    textAlign: 'center', // ✅ จัดให้อยู่ตรงกลาง
  },
  
  additionalImagesContainer: {
    marginTop: 15, // ✅ ลดระยะห่างลง
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  extraImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
    resizeMode: 'cover',
  },

  header: {
    marginTop: 60,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#FF7D0C',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  
});

export default styles;
