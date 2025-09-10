import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../telas/LoginScreen';
import Inicio from '../telas/Inicio';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Inicio" component={Inicio} />
    <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}