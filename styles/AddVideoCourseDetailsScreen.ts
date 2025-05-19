import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
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
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    fileButton: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
    },
    fileButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginBottom: 10,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: 'center',
    },
    submitButton: {
        backgroundColor: '#FF7D0C',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#FF4C4C',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        width: '100%',
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
