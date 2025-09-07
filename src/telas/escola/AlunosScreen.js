import React, { useState, useContext, useCallback } from 'react';
import { SafeAreaView, View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Text, Card, useTheme, IconButton, Button, Appbar } from 'react-native-paper';
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
          const response = await api.get(`salas/alunos_api/alunos/${salaId}/`, {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          });
          if (isActive) {
            setAlunos(Array.isArray(response.data) ? response.data : []);
          }
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

  const renderAluno = ({ item, index }) => (
    <View style={styles.tabelaLinha}>
      <Text style={styles.celulaNumero}>{index + 1}</Text>
      <Text style={styles.celulaNome1}>{item.nome}</Text>
      <View style={styles.celulaInfo}>
        <Text style={styles.celulaInfo1}>{item.data_nascimento || '-'}</Text>
        <Text style={styles.celulaInfo1}>
          {item.sexo === 'F' ? 'Feminino' : item.sexo === 'M' ? 'Masculino' : '-'}
        </Text>
      </View>
      <IconButton
        icon={() => <Ionicons name="create-outline" size={20} color={theme.colors.primary} />}
        size={20}
        onPress={() =>
          navigation.navigate('EditarExcluirAlunoScreen', { alunoId: item.id, salaId })
        }
        style={styles.celulaEditar}
      />
    </View>
  );

  const TableHeader = () => (
    <View style={[styles.tabelaLinha, styles.tabelaCabecalho]}>
      <Text style={styles.celulaNumero}>#</Text>
      <Text style={styles.celulaNome}>Nome</Text>
      <Text style={styles.celulaInfo}>Nasc / Sexo</Text>
      <Text style={styles.celulaEditar}></Text>
    </View>
  );

  const EmptyComponent = () => (
    <View style={{ padding: 16 }}>
      <Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>
        Nenhum aluno cadastrado nesta sala.
      </Text>
    </View>
  );

  const FooterButton = () => (
    <View style={{ padding: 16 }}>
      <Button
        mode="contained"
        icon={() => <Ionicons name="add-outline" size={20} color="#fff" />}
        contentStyle={{ height: 44 }}
        style={{ borderRadius: 8 }}
        onPress={() => navigation.navigate('CadastrarAlunosScreen', { salaId })}
      >
        Novo Aluno
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: '#0D6EFD' }}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title={salaDescricao} titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <View style={styles.container}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={{ paddingHorizontal: 0, paddingVertical: 0 }}>
            <FlatList
              data={alunos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderAluno}
              ListHeaderComponent={TableHeader}
              ListEmptyComponent={EmptyComponent}
              ListFooterComponent={FooterButton}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            />
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flex: 1, borderRadius: 12, elevation: 4 },

  tabelaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  tabelaCabecalho: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#007AFF',
    marginBottom: 4,
  },

  celulaNumero: {
    width: 30,
    fontWeight: '700',
    textAlign: 'center',
    color: '#007aff',
  },
  celulaNome: {
    flex: 2,
    fontWeight: '700',
    paddingLeft: 6,
    color: '#007Aff',
  },
  celulaNome1: {
    flex: 2,
    fontWeight: '500',
    paddingLeft: 6,
  },
  celulaInfo: {
    flex: 1.2,
    fontSize: 14,
    fontWeight: '700',
    color: '#007Aff',
    flexDirection: 'column',
  },
  celulaInfo1: {
    paddingLeft: 5,
    fontSize: 13,
  },
  celulaEditar: {
    width: 40,
  },

  emptyText: { textAlign: 'center', marginTop: 12, fontSize: 16 },
});
