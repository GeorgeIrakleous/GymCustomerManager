// CustomHeader2.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

function CustomHeader2({ title, onPressLeft, onPressEdit, onPressDelete }) {
  return (
    <View style={styles.header}>
      {/* Left: Big Back Arrow */}
      <TouchableOpacity style={styles.leftButton} onPress={onPressLeft}>
        <Ionicons name="arrow-back" size={32} color={Colors.white} />
      </TouchableOpacity>

      {/* Middle: Title */}
      <Text style={styles.headerText}>{title}</Text>

      {/* Right: Two Buttons for Edit and Delete */}
      <View style={styles.rightButtonsContainer}>
        <TouchableOpacity style={styles.rightButton} onPress={onPressEdit}>
          <Ionicons name="create-outline" size={24} color={Colors.lightBlue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightButton} onPress={onPressDelete}>
          <Ionicons name="trash-outline" size={24} color={Colors.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',         
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    height: 60,
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  leftButton: {
    paddingLeft: 10,
  },
  headerText: {
    color: Colors.white,
    fontSize: 20,
  },
  rightButtonsContainer: {
    flexDirection: 'row',
  },
  rightButton: {
    padding: 10,
    marginLeft: 10,
    // Remove the background so the icon itself is colored
  },
});

export default CustomHeader2;
