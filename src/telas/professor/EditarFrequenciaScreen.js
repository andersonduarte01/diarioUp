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
  ActivityIndicator,
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
  const mes = String(d.getMonth() + 1).padStart(2, "0"); // mês começa do 0
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export default function EditarFrequenciaScreen({ route }) {
  const { sala, dataSelecionada, onAtualizarCalendario } = route.params;
  const navigation = useNavigation();
  const { authTokens } = useContext(AuthContext);

  const [alunos, setAlunos] = useState([]);
  const [frequencias, setFrequencias] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [observacaoTemp, setObservacaoTemp] = useState("");
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFrequencias = async () => {
      try {
        const responseAlunos = await api.get(
          `frequencia/api_alunos/alunos-frequencia/${sala.id}/`,
          { headers: { Authorization: `Bearer ${authTokens.access}` } }
        );
        const alunosData = Array.isArray(responseAlunos.data.results)
          ? responseAlunos.data.results
          : [];
        setAlunos(alunosData);

        const responseFreq = await api.get(
          `frequencia/api/frequencias/aluno-frequencia/${sala.id}/?data=${dataSelecionada}`,
          { headers: { Authorization: `Bearer ${authTokens.access}` } }
        );

        const freqObj = {};
        alunosData.forEach(aluno => {
          const freq = responseFreq.data.find(f => f.aluno === aluno.id);
          freqObj[aluno.id] = freq
            ? { presente: freq.presente, observacao: freq.observacao || "" }
            : { presente: true, observacao: "" };
        });
        setFrequencias(freqObj);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFrequencias();
  }, [sala, dataSelecionada, authTokens]);

  const togglePresenca = (alunoId) => {
    setFrequencias(prev => ({
      ...prev,
      [alunoId]: { ...prev[alunoId], presente: !prev[alunoId].presente }
    }));
  };

  const abrirModalObservacao = (aluno) => {
    setAlunoSelecionado(aluno);
    setObservacaoTemp(frequencias[aluno.id].observacao || "");
    setModalVisible(true);
  };

  const fecharModalObservacao = () => {
    if (!alunoSelecionado) return;
    setFrequencias(prev => ({
      ...prev,
      [alunoSelecionado.id]: { ...prev[alunoSelecionado.id], observacao: observacaoTemp }
    }));
    setModalVisible(false);
    setAlunoSelecionado(null);
  };

  const salvarFrequencia = async () => {
    setLoading(true);
    try {
      const payload = {
        sala_id: sala.id,
        data: dataSelecionada,
        frequencias_alunos: Object.keys(frequencias).map(id => ({
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
      if (onAtualizarCalendario) onAtualizarCalendario();
    } catch (error) {
      setModalErroVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const renderAluno = ({ item, index }) => {
    const freq = frequencias[item.id] || { presente: true, observacao: "" };
    return (
      <View>
        <View style={styles.alunoItem}>
          <TouchableOpacity onPress={() => abrirModalObservacao(item)} style={{ marginRight: 12 }}>
            <Icon name="create-outline" size={24} color="#1E88E5" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.alunoNome}>{item.nome}</Text>
            {freq.observacao ? <Text style={styles.observacaoText}>{freq.observacao}</Text> : null}
          </View>

          <Switch
            value={freq.presente}
            onValueChange={() => togglePresenca(item.id)}
            trackColor={{ false: "#f28b82", true: "#bbdefb" }}
            thumbColor={freq.presente ? "#1E88E5" : "#d32f2f"}
          />
        </View>

        {index < alunos.length - 1 && <View style={styles.divider} />}
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
          Editar Frequência - ({formatarData(dataSelecionada)})
        </Text>
      </View>

      <View style={styles.alunosCard}>
        <FlatList
          data={alunos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderAluno}
          scrollEnabled={true}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        onPress={salvarFrequencia}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        )}
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
              onChangeText={setObservacaoTemp}
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
        message="Frequência atualizada com sucesso!"
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
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E88E5", padding: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  alunosCard: { backgroundColor: "#fff", padding: 12, margin: 12, borderRadius: 12, elevation: 2 },
  alunoItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 4 },
  alunoNome: { fontSize: 16, fontWeight: "bold", color: "#333" },
  observacaoText: { color: "#666", fontSize: 14, marginTop: 4 },

  saveButton: { backgroundColor: "#1E88E5", padding: 16, borderRadius: 12, alignItems: "center", margin: 12 },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  modalInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8, textAlignVertical: "top", marginBottom: 12 },
  modalButton: { backgroundColor: "#1E88E5", padding: 12, borderRadius: 8, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});
