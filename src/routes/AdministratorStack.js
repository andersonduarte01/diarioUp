import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeAdministradorScreen from '../telas/HomeAdministradorScreen';

const Stack = createNativeStackNavigator();

export default function AdministratorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeAdministrator" component={HomeAdministradorScreen} />
      {/* Outras telas específicas do técnico podem ser adicionadas aqui */}
    </Stack.Navigator>
  );
}
