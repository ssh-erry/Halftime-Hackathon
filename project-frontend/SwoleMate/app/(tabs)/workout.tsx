import { Text, View, StyleSheet } from 'react-native';

export default function Workout() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>workout screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});