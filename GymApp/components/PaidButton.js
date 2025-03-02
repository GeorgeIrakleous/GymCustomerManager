// components/PaidButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

const PaidButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.paidButton} onPress={onPress}>
      <Text style={styles.paidButtonText}>Mark as Paid</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  paidButton: {
    width: '60%', // More horizontal space
    alignSelf: 'center', // Center the button within its container
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: Colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  paidButtonText: {
    color: Colors.background, // using the app's background color (typically white)
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaidButton;
