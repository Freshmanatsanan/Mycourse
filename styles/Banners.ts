import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7D0C',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7F2',
    padding: 10,
  },
  addSlideButton: {
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  addSlideButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  slideCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  slideImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  slideDetails: {
    marginLeft: 10,
    flex: 1,
  },
  slideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  slideDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  slideCreatedBy: {
    fontSize: 14,
    marginBottom: 5,
  },
  slideDate: {
    fontSize: 14,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 8,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
});

export default styles;
