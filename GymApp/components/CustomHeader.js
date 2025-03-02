// CustomHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';

function CustomHeader({ title, rightButtonTitle, onPressLeft, onPressRight }) {
  return (
    <View style={styles.header}>
      {/* Left: Back Button */}
      <TouchableOpacity style={styles.leftButton} onPress={onPressLeft}>
        <Text style={styles.leftButtonText}>x</Text>
      </TouchableOpacity>

      {/* Middle: Title */}
      <Text style={styles.headerText}>{title}</Text>

      {/* Right: Action Button */}
      <TouchableOpacity style={styles.rightButton} onPress={onPressRight}>
        <Text style={styles.rightButtonText}>{rightButtonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',         // Lay out items horizontally
    justifyContent: 'space-between',// Space items out evenly
    alignItems: 'center',         // Vertically center items
    backgroundColor: Colors.background,
    height: 60,
    paddingTop: 15,               // Account for status bar if needed
    paddingHorizontal: 10,        // Horizontal padding for spacing
  },
  leftButton: {
    paddingLeft: 10,
  },
  leftButtonText: {
    color: Colors.white,
    fontSize: 30,
  },
  headerText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'regular',
  },
  rightButton: {
    padding: 10,
    paddingHorizontal:30,
    marginRight:10,
    borderWidth: 0,
    borderColor: Colors.white,
    borderRadius: 25,
    backgroundColor: Colors.lightBlue
  },
  rightButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight:'bold'
  },
});

export default CustomHeader;
