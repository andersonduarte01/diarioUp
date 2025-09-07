import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, StyleSheet, Alert, FlatList, ScrollView } from "react-native";
import { Appbar, Text, Card, Divider, IconButton, ActivityIndicator, useTheme } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../contexto/AuthContext";
import api from "../../services/Api";

export default function RelatoriosScreen({ route }) {
  const { sala } = route.params;
  const navigation = useNavigation();
  const { authTokens } = useContext(AuthContext);
  const theme = useTheme();

  const [periodos, setPeriodos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [relatorios, setRelatorios] = useState({});
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPeriodos = async () => {
    try {
      const periodosResp = await api.get("frequencia/api/periodos/", { 
        headers: { Authorization: `Bearer ${authTokens.access}` } 
      });
      const periodosData = periodosResp.data.results;
      setPeriodos(periodosData);
      const periodoInicial = periodosData.length > 0 ? periodosData[0].id : null;
      setSelectedPeriodo(periodoInicial);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os períodos.");
    }
  };

  const fetchAlunosRelatorios = async (periodoId) => {
    setLoading(true);
    try {
      const alunosResponse = await api.get(`frequencia/api_alunos/alunos-frequencia/${sala.id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` }
      });
      setAlunos(alunosResponse.data);

      const relatoriosResponse = await api.get(`frequencia/api/relatorios/?periodo=${periodoId}&sala=${sala.id}`, {
        headers: { Authorization: `Bearer ${authTokens.access}` }
      });

      const relatoriosMap = {};
      relatoriosResponse.data.results.forEach((r) => {
        const key = `${r.aluno}-${r.periodo}`;
        relatoriosMap[key] = r;
      });
      setRelatorios(relatoriosMap);

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os relatórios.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchPeriodos(); }, []);
  useEffect(() => { if (selectedPeriodo) fetchAlunosRelatorios(selectedPeriodo); }, [selectedPeriodo]);

  // 🔄 Recarrega sempre que a tela voltar ao foco
  useFocusEffect(
    useCallback(() => {
      if (selectedPeriodo) {
        fetchAlunosRelatorios(selectedPeriodo);
      }
    }, [selectedPeriodo])
  );

  const handleAlunoPress = (aluno) => {
    const key = `${aluno.id}-${selectedPeriodo}`;
    const relatorio = relatorios[key];
    if (relatorio) {
      navigation.navigate("RelatorioUP", { relatorio, aluno, periodo: selectedPeriodo, sala });
    } else {
      navigation.navigate("RelatorioAdd", { aluno, periodo: selectedPeriodo, sala });
    }
  };

  const renderAluno = ({ item, index }) => {
    const key = `${item.id}-${selectedPeriodo}`;
    const relatorioExiste = !!relatorios[key];

    return (
      <View key={item.id}>
        {index !== 0 && <Divider />}
        <Card.Content style={styles.alunoContent}>
          <Text style={styles.alunoNome}>{item.nome}</Text>
          <IconButton
            icon={relatorioExiste ? "clipboard-edit-outline" : "plus-circle"}
            iconColor={relatorioExiste ? "#1E88E5" : "#4CAF50"}
            size={24}
            onPress={() => handleAlunoPress(item)}
          />
        </Card.Content>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#1E88E5" }}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title={sala.descricao} titleStyle={{ color: "#fff" }} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.abasContainer}>
          {periodos.map((p) => (
            <Card
              key={p.id}
              style={[styles.aba, selectedPeriodo === p.id && styles.abaSelecionada]}
              onPress={() => setSelectedPeriodo(p.id)}
            >
              <Card.Content>
                <Text style={[styles.abaText, selectedPeriodo === p.id && styles.abaTextSelecionada]}>
                  {p.periodo}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1E88E5" style={{ marginTop: 20 }} />
        ) : (
          <Card style={styles.alunosCard}>
            <FlatList
              data={alunos}
              renderItem={renderAluno}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  abasContainer: { flexDirection: "row", marginVertical: 10, paddingHorizontal: 8 },
  aba: { flex: 1, marginHorizontal: 4, borderRadius: 6, backgroundColor: "#e0e0e0" },
  abaSelecionada: { backgroundColor: "#1E88E5" },
  abaText: { color: "#333", fontWeight: "bold", textAlign: "center", fontSize: 11 },
  abaTextSelecionada: { color: "#fff" },
  alunosCard: { margin: 16, borderRadius: 8, paddingVertical: 8, elevation: 2 },
  alunoContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 1 },
  alunoNome: { fontSize: 15 },
});
