import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import HomeEscolaScreen from '../telas/HomeEscolaScreen';
import EditarEscolaScreen from '../telas/escola/EditarEscolaScreen';
import EditarEnderecoScreen from '../telas/escola/EditarEnderecoScreen';
import EditarSalaScreen from '../telas/escola/EditarSalaScreen';
import AlunosScreen from '../telas/escola/AlunosScreen';
import EditarExcluirAlunoScreen from '../telas/escola/EditarExcluirAlunoScreen';
import CadastrarAlunoScreen from '../telas/escola/CadastrarAlunoScreen';
import EditExcProfessorScreen from '../telas/escola/EditExcProfessorScreen';

const Stack = createNativeStackNavigator();

export default function EscolaStack() {
  const theme = useTheme(); // Tema do Paper

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen 
        name="HomeEscola" 
        component={HomeEscolaScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EditarEscola" 
        component={EditarEscolaScreen} 
        options={{ title: 'Editar Escola' }} 
      />
      <Stack.Screen 
        name="EditarEndereco" 
        component={EditarEnderecoScreen} 
        options={{ title: 'Editar Endereço' }} 
      />
      <Stack.Screen 
        name="EditarSala" 
        component={EditarSalaScreen} 
        options={{ title: 'Atualizar Sala' }} 
      />
      <Stack.Screen 
        name="AlunosScreen" 
        component={AlunosScreen} 
        options={{ title: 'Alunos' }} 
      />
      <Stack.Screen 
        name="CadastrarAlunosScreen" 
        component={CadastrarAlunoScreen} 
        options={{ title: 'Cadastrar Aluno' }} 
      />  
      <Stack.Screen 
        name="EditarExcluirAlunoScreen" 
        component={EditarExcluirAlunoScreen} 
        options={{ title: 'Atualizar Aluno' }} 
      />
      <Stack.Screen 
        name="EditExcProfessorScreen" 
        component={EditExcProfessorScreen} 
        options={{ title: 'Atualizar Professor' }} 
      />                    
    </Stack.Navigator>
  );
}
