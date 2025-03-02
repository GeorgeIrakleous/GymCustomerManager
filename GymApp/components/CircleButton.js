// CircleButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Importing custom components
import Colors from '../constants/colors';

export default function CircleButton({ onPress, title = '+' }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.darkBlue,
    width: 60,
    height: 60,
    borderRadius: 30, // Makes it a circle
    position: 'absolute',
    bottom: 30,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.lightBlue,
    fontSize: 30,
    fontWeight: 'regular',
  },
});
