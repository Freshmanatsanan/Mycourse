import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',  // Clean background
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 30,
        textAlign: 'center',  // Center the header text
    },
    headerContainer: {
        position: "absolute",
        left: 20,
        zIndex: 10,
        marginTop:5, // ทำให้แน่ใจว่าปุ่มอยู่ด้านหน้า
      },
      backButton: {
        backgroundColor: "#FF7D0C",
        borderRadius: 30,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      },
    input: {
        width: '100%',
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#D1D1D1',  // Light grey for a subtle border
        borderRadius: 10,
        backgroundColor: '#F7F7F7',  // Subtle background for input fields
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 8,
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imagePickerText: {
        color: '#007BFF',
        textAlign: 'center',
        marginVertical: 15,
        fontSize: 16,
        fontWeight: 'bold',
    },
    imagePreview: {
        width: 120,
        height: 120,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CCCCCC',  // Light border to highlight the image
        alignSelf: 'center',
    },
    inputWrapper: {
        marginBottom: 20,  // Add spacing between input fields
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    cancelButton: {
        backgroundColor: '#FF4C4C',  // Red color for cancel
        padding: 10,
        borderRadius: 8,
        width: '48%',
    },
    cancelButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#007BFF',  // Blue color for the submit button
        padding: 15,
        borderRadius: 10,
        width: '48%',
    },
    submitButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
