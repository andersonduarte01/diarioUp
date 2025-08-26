import React, { useState, useContext, useCallback } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Text, Card, useTheme, Appbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/Api';
import { AuthContext } from '../../contexto/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AlunosScreen({ route, navigation }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);
  const { salaId, salaDescricao } = route.params;

  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchAlunos = async () => {
        setLoading(true);
        try {
          const response = await api.get(`salas/alunos_api/alunos/${salaId}/`, {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          });
          if (isActive)
            setAlunos(Array.isArray(response.data.results) ? response.data.results : []);
        } catch (error) {
          console.log('Erro ao buscar alunos:', error);
          if (isActive) setAlunos([]);
        }
        if (isActive) setLoading(false);
      };
      fetchAlunos();
      return () => { isActive = false; };
    }, [authTokens, salaId])
  );

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      {/* Header azul com texto branco e botão de voltar */}
      <Appbar.Header style={{ backgroundColor: "#1E88E5" }} elevated>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title={salaDescricao} titleStyle={{ color: "#fff" }} />
      </Appbar.Header>

      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Lista de Alunos */}
        {alunos.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>
            Nenhum aluno cadastrado nesta sala.
          </Text>
        ) : (
          alunos.map((aluno, index) => (
            <AlunoCard
              key={aluno.id}
              aluno={aluno}
              theme={theme}
              navigation={navigation}
              numero={index + 1}
              salaId={salaId}
            />
          ))
        )}
      </ScrollView>
    </>
  );
}

function AlunoCard({ aluno, theme, numero }) {
  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.alunoHeader}>
          {/* Número do aluno */}
          <View style={styles.numeroContainer}>
            <Text style={styles.numeroTexto}>{numero}</Text>
          </View>

          {/* Nome do aluno */}
          <Text style={[styles.nome, { color: theme.colors.onBackground }]}>
            {aluno.nome}
          </Text>
        </View>

        {/* Informações do aluno */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Data de Nascimento: </Text>
          <Text style={styles.value}>{aluno.data_nascimento || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Sexo: </Text>
          <Text style={styles.value}>
            {aluno.sexo === 'F' ? 'Feminino' : aluno.sexo === 'M' ? 'Masculino' : '-'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  salaCard: { borderRadius: 12, elevation: 4, marginBottom: 16, padding: 8 },
  salaTitulo: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  card: { borderRadius: 12, elevation: 4, marginBottom: 2, padding: 8, marginTop: 5 },
  alunoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  numeroContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3C90EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  numeroTexto: {
    color: '#fff',
    fontWeight: '700',
  },
  nome: { fontWeight: '700', fontSize: 18, flex: 1 },
  infoRow: { flexDirection: 'row', marginLeft: 35, marginBottom: 4 },
  label: { fontWeight: '700', color: '#555' },
  value: { fontWeight: '500', color: '#000' },
});
