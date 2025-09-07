import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeProfessorScreen from '../telas/HomeProfessorScreen';
import DetalhesScreen from '../telas/professor/DetalhesScreen';
import ProfessorAlunosScreen from "../telas/professor/ProfessorAlunosScreen";
import CalendarioScreen from "../telas/professor/CalendarioScreen";
import FrequenciaDiaria from "../telas/professor/FrequenciaDiariaScreen";
import EditarFrequencia from "../telas/professor/EditarFrequenciaScreen";
import AdicionarRegistrosScreen from "../telas/professor/ListarRegistrosScreen";
import AddRegistroScreen from "../telas/professor/AddRegistroScreen";
import EditRegistroScreen from "../telas/professor/EditarRegistroScreen";
import RelatoriosScreen from "../telas/professor/RelatoriosScreen";
import RelatorioAdd from "../telas/professor/RelatorioAddScreen";
import RelatorioUp from "../telas/professor/EditarRelatorioScreen";

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
      <Stack.Screen name="AdicionarRegistro" component={AdicionarRegistrosScreen} />
      <Stack.Screen name="AddRegistroScreen" component={AddRegistroScreen} />
      <Stack.Screen name="EditarRegistro" component={EditRegistroScreen} />
      <Stack.Screen name="RelatoriosScreen" component={RelatoriosScreen} />
      <Stack.Screen name="RelatorioAdd" component={RelatorioAdd} />
      <Stack.Screen name="RelatorioUP" component={RelatorioUp} />     
      {/* Outras telas específicas do técnico podem ser adicionadas aqui */}
    </Stack.Navigator>
  );
}
