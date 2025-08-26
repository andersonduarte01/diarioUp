import React, { useContext, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ActivityIndicator, View, Alert } from 'react-native';
import { useTheme as usePaperTheme } from 'react-native-paper';

import { AuthContext } from '../contexto/AuthContext';

import AuthStack from './AuthStack';
import AdministratorStack from './AdministratorStack';
import TecnicoStack from './TecnicoStack';
import SolicitanteStack from './SolicitanteStack';
import ProfessorStack from './ProfessorStack';
import FuncionarioStack from './FuncionarioStack';
import AlunoStack from './AlunoStack';
import EscolaStack from './EscolaStack';

export default function Routes() {
  const { user, loading } = useContext(AuthContext);
  const paperTheme = usePaperTheme(); // Tema do Paper

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
      </View>
    );
  }

  // Usar apenas tema claro do NavigationContainer
  const navTheme = DefaultTheme;
  console.log('USER NO ROUTES:', user);
  return (
    <NavigationContainer theme={navTheme}>
      {!user ? (
        <AuthStack />
      ) : user.is_administrator ? (
        <AdministratorStack />
      ) : user.is_tecnico ? (
        <TecnicoStack />
      ) : user.is_solicitante ? (
        <SolicitanteStack />
      ) : user.is_professor ? (
        <ProfessorStack />
      ) : user.is_funcionario ? (
        <FuncionarioStack />
      ) : user.is_aluno ? (
        <AlunoStack />
      ) : (
        <EscolaStack />
      )}
    </NavigationContainer>
  );
}
