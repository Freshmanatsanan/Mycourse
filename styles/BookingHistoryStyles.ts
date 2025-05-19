import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF7D0C",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E63946",
    marginTop: 5,
  },
  paymentSlip: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  noBookingText: {
    fontSize: 16,
    color: "#E63946",
    textAlign: "center",
    marginTop: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF7D0C",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "bold",
  },
  noSlipText: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginVertical: 8, 
    borderRadius: 5, 
    backgroundColor: '#FAFAFA' 

  }
});

export default styles;
