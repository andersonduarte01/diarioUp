import React, { useState, useContext, useCallback } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Appbar, useTheme, IconButton, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../services/Api';
import { AuthContext } from '../../contexto/AuthContext';

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
          let results = [];
          let url = `salas/alunos_api/alunos/${salaId}/`;

          // Loop para pegar todas as páginas
          while (url) {
            const response = await api.get(url, {
              headers: { Authorization: `Bearer ${authTokens.access}` },
            });
            results = [...results, ...response.data.results];
            url = response.data.next; // próxima página ou null
          }

          if (isActive) setAlunos(results);
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
      <Appbar.Header style={{ backgroundColor: '#0D6EFD' }}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title={salaDescricao} titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            {/* Cabeçalho da tabela */}
            <View style={[styles.tabelaLinha, styles.tabelaCabecalho]}>
              <Text style={styles.celulaNumero}>#</Text>
              <Text style={styles.celulaNome}>Nome</Text>
              <Text style={styles.celulaInfo}>Nasc / Sexo</Text>
            </View>

            {/* Lista de alunos */}
            {alunos.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>
                Nenhum aluno cadastrado nesta sala.
              </Text>
            ) : (
              alunos.map((aluno, index) => (
                <View key={aluno.id} style={styles.tabelaLinha}>
                  <Text style={styles.celulaNumero}>{index + 1}</Text>
                  <Text style={styles.celulaNome1}>{aluno.nome}</Text>
                  <View style={styles.celulaInfo}>
                    <Text style={styles.celulaInfo1}>{aluno.data_nascimento || '-'}</Text>
                    <Text style={styles.celulaInfo1}>
                      {aluno.sexo === 'F' ? 'Feminino' : aluno.sexo === 'M' ? 'Masculino' : '-'}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 12, elevation: 4, paddingVertical: 8 },

  tabelaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  tabelaCabecalho: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#007AFF',
    marginBottom: 4,
  },

  celulaNumero: { width: 30, fontWeight: '700', textAlign: 'center', color: '#007aff' },
  celulaNome: { flex: 2, fontWeight: '700', paddingLeft: 6, color: '#007Aff' },
  celulaNome1: { flex: 2, fontWeight: '500', paddingLeft: 6 },
  celulaInfo: { flex: 1.2, fontSize: 14, fontWeight: '700', color: '#007Aff', flexDirection: 'column' },
  celulaInfo1: { paddingLeft: 5, fontSize: 13 },

  emptyText: { textAlign: 'center', marginTop: 12, fontSize: 16 },
  cardActions: { marginTop: 8, paddingHorizontal: 16, paddingBottom: 12 },
});
