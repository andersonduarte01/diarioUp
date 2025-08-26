import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeProfessorScreen from '../telas/HomeProfessorScreen';
import DetalhesScreen from '../telas/professor/DetalhesScreen';
import ProfessorAlunosScreen from "../telas/professor/ProfessorAlunosScreen";
import CalendarioScreen from "../telas/professor/CalendarioScreen";
import FrequenciaDiaria from "../telas/professor/FrequenciaDiariaScreen";
import EditarFrequencia from "../telas/professor/EditarFrequenciaScreen";

const Stack = createNativeStackNavigator();

export default function ProfessorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeProfessor" component={HomeProfessorScreen} />
      <Stack.Screen name="Detalhes" component={DetalhesScreen} />
      <Stack.Screen name="AlunosScreen" component={ProfessorAlunosScreen} />
      <Stack.Screen name="Calendario" component={CalendarioScreen} />
      <Stack.Screen name="FrequenciaDiaria" component={FrequenciaDiaria} />
      <Stack.Screen name="EditarFrequencia" component={EditarFrequencia} />
      {/* Outras telas específicas do técnico podem ser adicionadas aqui */}
    </Stack.Navigator>
  );
}
