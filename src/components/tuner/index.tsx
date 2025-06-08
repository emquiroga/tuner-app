import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Tuner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.note}>A</Text>
      <Text style={styles.frequency}>440 Hz</Text>
      <View style={styles.tuningBarContainer}>
        <View style={styles.tuningBarFill} />
      </View>
      <Text style={styles.status}>Perfecto</Text>
    </View>
  );
};


export default Tuner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  note: {
    fontSize: 96,
    color: '#fff',
    fontWeight: 'bold',
  },
  frequency: {
    fontSize: 32,
    color: '#ccc',
    marginBottom: 40,
  },
  tuningBarContainer: {
    width: '80%',
    height: 20,
    backgroundColor: 'pink',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  tuningBarFill: {
    width: '50%', // ajusta dinámicamente según precisión
    height: '100%',
    backgroundColor: '#00ff00',
  },
  status: {
    fontSize: 24,
    color: '#00ff00',
  },
});