import React, { useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  Text,
  Appbar,
  Card,
  Divider,
  TextInput,
  Button,
  Switch,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexto/AuthContext";
import api from "../../services/Api";
import Icon from "react-native-vector-icons/Ionicons";
import { SuccessModal, ErrorModal } from "../../componentes/AppModal";

const formatarData = (data) => {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-");
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
        const alunosData = Array.isArray(responseAlunos.data)
          ? responseAlunos.data
          : [];
        setAlunos(alunosData);

        const responseFreq = await api.get(
          `frequencia/api/frequencias/aluno-frequencia/${sala.id}/?data=${dataSelecionada}`,
          { headers: { Authorization: `Bearer ${authTokens.access}` } }
        );

        const freqObj = {};
        alunosData.forEach((aluno) => {
          const freq = responseFreq.data.find((f) => f.aluno === aluno.id);
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
      [alunoSelecionado.id]: {
        ...prev[alunoSelecionado.id],
        observacao: observacaoTemp,
      },
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
        frequencias_alunos: Object.keys(frequencias).map((id) => ({
          aluno: parseInt(id),
          presente: frequencias[id].presente,
          observacao: frequencias[id].observacao,
        })),
      };

      await api.post("frequencia/api/frequencias/criar_bloco/", payload, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });

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
          <Icon
            name="create-outline"
            size={24}
            color="#1E88E5"
            style={{ marginRight: 12 }}
            onPress={() => abrirModalObservacao(item)}
          />
          <View style={styles.verticalDivider} />
          <View style={{ flex: 1 }}>
            <Text style={styles.alunoNome}>{item.nome}</Text>
            {freq.observacao ? (
              <Text style={styles.observacaoText}>{freq.observacao}</Text>
            ) : null}
          </View>

          <Switch
            value={freq.presente}
            onValueChange={() => togglePresenca(item.id)}
            color="#1E88E5"
          />
        </View>

        {index < alunos.length - 1 && <Divider />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#1E88E5" }}>
        <Appbar.Action
          icon={() => <Icon name="arrow-back" size={24} color="#fff" />}
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title={`Editar Frequência - (${formatarData(dataSelecionada)})`}
          titleStyle={{ color: "#fff" }}
        />
      </Appbar.Header>

      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAluno}
        contentContainerStyle={{ padding: 12 }}
        ListFooterComponent={
          <Button
            mode="contained"
            onPress={salvarFrequencia}
            style={styles.saveButton}
            disabled={loading}
            buttonColor="#1E88E5"
          >
            {loading ? <ActivityIndicator color="#fff" /> : "Salvar Alterações"}
          </Button>
        }
      />

      {/* Modal Observação */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <Card style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Observação - {alunoSelecionado?.nome}
            </Text>
            <TextInput
              mode="outlined"
              style={styles.modalInput}
              multiline
              numberOfLines={6}
              value={observacaoTemp}
              onChangeText={setObservacaoTemp}
              placeholder="Digite a observação"
            />
            <Button
              mode="contained"
              style={{ marginTop: 12 }}
              buttonColor="#1E88E5"
              onPress={fecharModalObservacao}
            >
              Fechar
            </Button>
          </Card>
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
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  alunoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  alunoNome: { fontSize: 16, fontWeight: "bold", color: "#333" },
  observacaoText: { color: "#666", fontSize: 14, marginTop: 4 },

  saveButton: {
    marginTop: 16,
    marginBottom: 40,
    padding: 6,
    borderRadius: 12,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#aaa",
    marginHorizontal: 12,
    alignSelf: "stretch",
    marginRight: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "85%",
    padding: 16,
    borderRadius: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  modalInput: { minHeight: 140, textAlignVertical: "top" },
});
