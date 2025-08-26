import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTecnicoScreen from '../telas/HomeTecnicoScreen';

const Stack = createNativeStackNavigator();

export default function TecnicoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTecnico" component={HomeTecnicoScreen} />
      {/* Outras telas específicas do técnico podem ser adicionadas aqui */}
    </Stack.Navigator>
  );
}
