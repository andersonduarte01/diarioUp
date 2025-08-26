import React, { useState, useContext, useCallback } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/Api';
import { AuthContext } from '../../contexto/AuthContext';
import SalaCard from '../../componentes/SalaCard';

export default function SalasScreen({ navigation }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega salas sempre que a tela estiver em foco
  useFocusEffect(
    useCallback(() => {
      const fetchSalas = async () => {
        setLoading(true); // mostra loading toda vez que voltar
        try {
          const response = await api.get('salas/api/salas/ano-corrente/', {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          });
          setSalas(response.data);
        } catch (error) {
          console.log('Erro ao buscar salas:', error);
        }
        setLoading(false);
      };
      fetchSalas();
    }, [authTokens])
  );

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      {salas.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.onBackground }}>
          Nenhuma sala encontrada.
        </Text>
      ) : (
        salas.map((sala) => (
          <SalaCard key={sala.id} sala={sala} navigation={navigation} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
