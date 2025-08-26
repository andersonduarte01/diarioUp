import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeAlunoScreen from '../telas/HomeAlunoScreen';

const Stack = createNativeStackNavigator();

export default function AlunoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeAluno" component={HomeAlunoScreen} />
      {/* Outras telas específicas do técnico podem ser adicionadas aqui */}
    </Stack.Navigator>
  );
}
