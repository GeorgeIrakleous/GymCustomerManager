// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing custom components
import MainScreen from '../screens/MainScreen';
import AddCustomerScreen from '../screens/AddCustomerScreen';
import ViewCustomerScreen from '../screens/ViewCustomerScreen';
import EditCustomerScreen from '../screens/EditCustomerScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
        />
        <Stack.Screen 
          name="AddCustomer" 
          component={AddCustomerScreen} 
        />
        <Stack.Screen
          name="ViewCustomer"
          component={ViewCustomerScreen} 
        />
        <Stack.Screen
          name="EditCustomer"
          component={EditCustomerScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
