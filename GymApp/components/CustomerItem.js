import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

// Define a dark color palette based on the base color "#220935"
const palette = {
  indigoSophiaSkye: "#117899",
  aiCe: "#1496BB",
  tealMist: "#5CA794",
  deepOcean: "#0F5B78",
  meadowGreen: "#A3B86C",
  sunlitGold: "#EBC944",
  honeyAmber: "#EDAA38",
  tangerineBurst: "#F26D21",
  crimsonFlame: "#D94E20",
  kellyDaisyAmberApril: "#F08C2D"
};


// Generate a palette color using a simple hash from the full name
const getPaletteColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const paletteArray = Object.values(palette);
  const index = Math.abs(hash) % paletteArray.length;
  return paletteArray[index];
};


export default function CustomerItem({ customer, index }) {
  // Combine firstName and lastName for color generation.
  const fullName = (customer.firstName || '') + (customer.lastName || '');
  const circleColor = getPaletteColor(fullName);
  const initial = customer.firstName ? customer.firstName.charAt(0).toUpperCase() : '';

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: circleColor }]}>
        <Text style={styles.circleText}>{initial}</Text>
      </View>
      <Text style={styles.name}>
        {index}{customer.firstName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    backgroundColor: Colors.background,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  circleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    // Light black border effect via text shadow
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  name: {
    fontSize: 20,
    color: Colors.white,
  },
});
