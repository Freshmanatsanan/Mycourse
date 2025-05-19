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
    videoButton: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
    },
    videoButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    documentButton: {
        backgroundColor: '#28A745',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
    },
    documentButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    filePreview: {
        marginBottom: 20,
        marginTop: 10,
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
