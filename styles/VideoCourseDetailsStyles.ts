import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 10,
    zIndex: 10,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 15,
    marginTop:55,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  mainImage: {
    width: 180,
    height: 180,
    borderRadius: 15,
  },
  sideImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  additionalDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 15,
  },
  videoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  video: {
    width: '95%',  // ปรับให้เต็มจอ
    height: 250,
    borderRadius: 10,
    backgroundColor: '#000', // ป้องกันปัญหาวิดีโอโปร่งใส
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
