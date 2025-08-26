import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeSolicitanteScreen from '../telas/HomeSolicitanteScreen';

const Stack = createNativeStackNavigator();

export default function SolicitanteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeSolicitante" component={HomeSolicitanteScreen} />
      {/* Outras telas específicas do técnico podem ser adicionadas aqui */}
    </Stack.Navigator>
  );
}
