// App.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, StatusBar } from 'react-native';

// Importing custom components
import AppNavigator from './navigation/AppNavigator';
import firebaseApp from './firebaseConfig';
import {OverlayProvider} from './components/OverlayProvider';

export default function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (firebaseApp) {
      setInitialized(true);
    }
  }, []);

  return (
    <>
      {/* Set StatusBar style */}
      <StatusBar barStyle="light-content" backgroundColor="#101010" />
      <OverlayProvider>
        <SafeAreaView style={styles.container}>
          {initialized ? (
            <AppNavigator />
          ) : (
            <Text style={styles.text}>Initializing Firebase...</Text>
          )}
        </SafeAreaView>
      </OverlayProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010', // Use your dark theme background
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});
