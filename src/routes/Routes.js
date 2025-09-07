import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useTheme as usePaperTheme } from 'react-native-paper';

import { AuthContext } from '../contexto/AuthContext';

import AuthStack from './AuthStack';
import AdministratorStack from './AdministratorStack';
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
  const navTheme = DefaultTheme;
  console.log('USER NO ROUTES:', user);
  return (
    <NavigationContainer theme={navTheme}>
      {!user ? (
        <AuthStack />
      ) : user.is_administrator ? (
        <AdministratorStack />
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
