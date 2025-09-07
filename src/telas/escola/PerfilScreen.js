import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme, Card, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { AuthContext } from '../../contexto/AuthContext';
import api from '../../services/Api';
import { useFocusEffect } from '@react-navigation/native';

export default function PerfilScreen({ navigation }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);
  const [escola, setEscola] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEscola = async () => {
    if (!authTokens) return setLoading(false);
    try {
      const response = await api.get('escola/api/minha-escola/', {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setEscola(response.data);
    } catch (error) {
      console.log('Erro ao buscar dados da escola:', error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchEscola();
    }, [authTokens])
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" animating color={theme.colors.primary} />
      </View>
    );
  }

  if (!escola) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text>Nenhuma informação da escola encontrada.</Text>
      </View>
    );
  }

  const infoEscola = [
    { label: 'Email', value: escola.email },
    { label: 'Telefone', value: escola.telefone },
    { label: 'INEP', value: escola.inep },
    { label: 'CNPJ', value: escola.cnpj },
  ];

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.primary,
              textAlign: 'center',
              marginBottom: 16,
              fontWeight: '700',
            }}
          >
            {escola.nome_escola || 'Nome da Escola'}
          </Text>
          <Divider style={{ marginVertical: 8 }} />    
          {infoEscola.map(({ label, value }, index) => (
            <View key={label}>
              <View style={styles.item}>
                <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  {label}:
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, paddingBottom: 1 }}>
                  {value || '-'}
                </Text>
              </View>
              {index < infoEscola.length - 1 && <Divider style={{ marginVertical: 8 }} />}
            </View>
          ))}
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.botoes}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('EditarEscola', { escola })}
              style={[styles.button, { backgroundColor: theme.colors.primary, borderRadius: 6 }]}
            >
              Editar Escola
            </Button>

            <Button
              mode="outlined"
              onPress={() => navigation.navigate('EditarEndereco', { endereco: escola.endereco })}
              style={[styles.button, { borderColor: theme.colors.primary, marginLeft: 8, borderRadius: 6 }]}
              textColor={theme.colors.primary}
            >
              Editar Endereço
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { margin: 16, padding: 16, borderRadius: 12 },
  item: { marginBottom: 4 },
  botoes: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  button: { flex: 1 },
});
