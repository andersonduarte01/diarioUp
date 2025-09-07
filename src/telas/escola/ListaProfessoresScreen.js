import React, { useState, useContext, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Divider } from 'react-native-paper';
import api from '../../services/Api';
import { AuthContext } from '../../contexto/AuthContext';

export default function ListaProfessoresScreen({ navigation }) {
  const { authTokens } = useContext(AuthContext);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const carregarProfessores = async () => {
    setLoading(true);
    try {
      const response = await api.get('professor/api/professores/', {
        headers: { Authorization: `Bearer ${authTokens.access}` }
      });

      const data = Array.isArray(response.data.results) ? response.data.results : [];
      setProfessores(data);

    } catch (error) {
      console.log('Erro ao carregar professores:', error.response || error);
      Alert.alert('Erro', 'Não foi possível carregar os professores.');
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      carregarProfessores();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarProfessores();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 16 }} />
      ) : (
        <Card style={styles.card}>
          {professores.map((prof, index) => (
            <View key={prof.id}>
              <View style={styles.professorRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person-circle-outline" size={50} color="#007AFF" />
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.info}>
                  <Text style={styles.profNome}>{prof.professor_nome}</Text>
                  <Text style={styles.profEmail}>{prof.email}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('EditExcProfessorScreen', { professor: prof })} 
                  style={styles.editButton}
                >
                  <Ionicons name="create-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>

              {index < professores.length - 1 && <Divider style={{ marginVertical: 8 }} />}
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  professorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#aaa',
    marginHorizontal: 12,
    alignSelf: 'stretch',
  },
  info: {
    flex: 1,
  },
  profNome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  profEmail: {
    fontSize: 12,
    color: '#666',
  },
  editButton: {
    padding: 8,
  },
});
