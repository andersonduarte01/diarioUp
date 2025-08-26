import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeFuncionarioScreen from '../telas/HomeFuncionarioScreen ';

const Stack = createNativeStackNavigator();

export default function FuncionarioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeFuncionario" component={HomeFuncionarioScreen} />
      {/* Outras telas específicas do técnico podem ser adicionadas aqui */}
    </Stack.Navigator>
  );
}
