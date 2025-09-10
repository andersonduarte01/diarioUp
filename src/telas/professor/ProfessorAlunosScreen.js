import React, { useState, useContext, useCallback } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator, Alert, Platform, PermissionsAndroid } from 'react-native';
import { Text, Card, Appbar, useTheme, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../services/Api';
import { AuthContext } from '../../contexto/AuthContext';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

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

          while (url) {
            const response = await api.get(url, {
              headers: { Authorization: `Bearer ${authTokens.access}` },
            });
            results = [...results, ...response.data];
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
      return () => {
        isActive = false;
      };
    }, [authTokens, salaId])
  );

  const salvarRelatorioAlunoPDF = async (aluno) => {
    if (!authTokens) return;

    try {
      // pedir permissão no Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissão para salvar arquivos',
            message: 'O app precisa de permissão para salvar o PDF na pasta Downloads',
            buttonPositive: 'Permitir',
            buttonNegative: 'Cancelar',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permissão negada', 'Não foi possível salvar o PDF.');
          return;
        }
      }

      // chamada API
      const response = await api.get(`aluno/api/relatorio/${aluno.id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
        responseType: 'arraybuffer',
      });

      // converter em base64
      const base64Data = Buffer.from(response.data, 'binary').toString('base64');

      // gerar nome do arquivo
      const safeNome = aluno.nome.replace(/[^a-z0-9]/gi, '_'); // evita caracteres inválidos
      const fileName = `${safeNome}_${aluno.id}_relatorio.pdf`;

      // caminho final
      const filePath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // salvar no dispositivo
      await RNFS.writeFile(filePath, base64Data, 'base64');

      Alert.alert('Sucesso', `Relatório salvo em:\n${filePath}`);
      console.log('PDF salvo em:', filePath);
    } catch (error) {
      console.log('Erro ao salvar PDF:', error);
      Alert.alert('Erro', 'Não foi possível salvar o relatório.');
    }
  };

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
              <Text style={styles.celulaRelatorio}>Relatório</Text>
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
                  <View style={styles.celulaRelatorio}>
                    <IconButton
                      icon={() => <Ionicons name="document-text-outline" size={22} color="#0D6EFD" />}
                      onPress={() => salvarRelatorioAlunoPDF(aluno)}
                    />
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
  celulaInfo: { flex: 1.2, flexDirection: 'column' },
  celulaInfo1: { paddingLeft: 5, fontSize: 13 },

  celulaRelatorio: { width: 70, alignItems: 'center', justifyContent: 'center' },

  emptyText: { textAlign: 'center', marginTop: 12, fontSize: 16 },
});
