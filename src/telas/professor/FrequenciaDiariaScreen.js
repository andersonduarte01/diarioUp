import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Modal,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexto/AuthContext";
import api from "../../services/Api";
import Icon from "react-native-vector-icons/Ionicons";
import { SuccessModal, ErrorModal } from '../../componentes/AppModal';

const formatarData = (data) => {
  if (!data) return "";
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export default function FrequenciaCadastroScreen({ route }) {
  const { sala, dataSelecionada } = route.params;
  const navigation = useNavigation();
  const { authTokens } = useContext(AuthContext);

  const [alunos, setAlunos] = useState([]);
  const [frequencias, setFrequencias] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [observacaoTemp, setObservacaoTemp] = useState("");
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);  

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await api.get(
          `frequencia/api_alunos/alunos-frequencia/${sala.id}/`,
          { headers: { Authorization: `Bearer ${authTokens.access}` } }
        );
        const alunosData = Array.isArray(response.data.results)
          ? response.data.results
          : [];
        setAlunos(alunosData);

        const freqInicial = {};
        alunosData.forEach((aluno) => {
          freqInicial[aluno.id] = { presente: true, observacao: "" };
        });
        setFrequencias(freqInicial);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAlunos();
  }, [sala]);

  const togglePresenca = (alunoId) => {
    setFrequencias((prev) => ({
      ...prev,
      [alunoId]: { ...prev[alunoId], presente: !prev[alunoId].presente },
    }));
  };

  const abrirModalObservacao = (aluno) => {
    setAlunoSelecionado(aluno);
    setObservacaoTemp(frequencias[aluno.id].observacao || "");
    setModalVisible(true);
  };

  const fecharModalObservacao = () => {
    if (!alunoSelecionado) return;
    setFrequencias((prev) => ({
      ...prev,
      [alunoSelecionado.id]: { ...prev[alunoSelecionado.id], observacao: observacaoTemp },
    }));
    setModalVisible(false);
    setAlunoSelecionado(null);
  };

  const salvarFrequencia = async () => {
    try {        
      const payload = {
        sala_id: sala.id,
        data: dataSelecionada,
        frequencias_alunos: Object.keys(frequencias).map((id) => ({
          aluno: parseInt(id),
          presente: frequencias[id].presente,
          observacao: frequencias[id].observacao,
        })),
      };

      await api.post(
        "frequencia/api/frequencias/criar_bloco/",
        payload,
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );

      setModalSucessoVisible(true);
    } catch (error) {
      setModalErroVisible(true);
    }
  };

  const renderAluno = ({ item }) => {
    const freq = frequencias[item.id] || { presente: true, observacao: "" };

    return (
      <View style={styles.alunoCard}>
        <View style={styles.alunoHeader}>
          <TouchableOpacity onPress={() => abrirModalObservacao(item)} style={{ marginRight: 12 }}>
            <Icon name="create-outline" size={24} color="#1E88E5" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.alunoNome}>{item.nome}</Text>
            {freq.observacao ? <View style={styles.divider} /> : null}
            {freq.observacao ? <Text style={styles.observacaoText}>{freq.observacao}</Text> : null}
          </View>

          <Switch
            value={freq.presente}
            onValueChange={() => togglePresenca(item.id)}
            trackColor={{ false: "#f28b82", true: "#bbdefb" }}
            thumbColor={freq.presente ? "#1E88E5" : "#d32f2f"}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Frequência - ({formatarData(dataSelecionada)})
        </Text>
      </View>

      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAluno}
        contentContainerStyle={{ padding: 12 }}
      />

      <TouchableOpacity style={styles.saveButton} onPress={salvarFrequencia}>
        <Text style={styles.saveButtonText}>Salvar Frequência</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Observação - {alunoSelecionado?.nome}
            </Text>
            <TextInput
              style={styles.modalInput}
              multiline
              numberOfLines={4}
              value={observacaoTemp}
              onChangeText={(txt) => setObservacaoTemp(txt)}
              placeholder="Digite a observação"
            />
            <TouchableOpacity style={styles.modalButton} onPress={fecharModalObservacao}>
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SuccessModal
        visible={modalSucessoVisible}
        message="Frequência cadastrada com sucesso!"
        onClose={() => {
          setModalSucessoVisible(false);
          navigation.goBack();
        }}
      />

      <ErrorModal
        visible={modalErroVisible}
        message="Ocorreu um erro. Tente novamente."
        onClose={() => setModalErroVisible(false)}
      />       
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E88E5", padding: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  alunoCard: { backgroundColor: "#fff", padding: 12, marginBottom: 10, borderRadius: 12, elevation: 2 },
  alunoHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  alunoNome: { fontSize: 16, fontWeight: "bold", color: "#333" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 4 },
  observacaoText: { color: "#666", fontSize: 14 },

  saveButton: { backgroundColor: "#1E88E5", padding: 16, borderRadius: 12, alignItems: "center", margin: 12 },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  modalInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8, textAlignVertical: "top", marginBottom: 12 },
  modalButton: { backgroundColor: "#1E88E5", padding: 12, borderRadius: 8, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});
