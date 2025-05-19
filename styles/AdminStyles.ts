import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7F2",
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    marginTop:70,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  summaryBox1: {
    width: width * 0.3,
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginRight:6,
  },
  summaryBox2: {
    width: width * 0.3,
    backgroundColor: "#18A9E4",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginRight:6,
  },
  summaryBox3: {
    width: width * 0.3,
    backgroundColor: "#17AF06",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle1: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 18 ,
    textAlign: 'center',
    color:"#FFFFFF",
    marginTop:5,
  },
  summaryTitle2: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color:"#FFFFFF"
  },
  summaryTitle3: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color:"#FFFFFF"
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#FFF96A",
  },
  tableContainer: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tableColumn: {
    fontSize: 14,
    width: "25%",
    textAlign: "center",
  },
 // ✅ กล่องกราฟ
 chartContainer: {
  marginHorizontal: 20,
  marginVertical: 15,
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 15,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 5,
  elevation: 3,
},
chartTitle: {
  fontSize: 18,
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 10,
  color: "#4A148C",
},
  summaryIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
});

export default styles;
