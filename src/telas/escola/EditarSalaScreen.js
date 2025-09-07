import React, { useEffect, useState, useContext } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { TextInput, Button, Text, useTheme, Portal, Modal, Card, Appbar } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import api from "../../services/Api";
import { AuthContext } from "../../contexto/AuthContext";
import { SuccessModal, ErrorModal } from '../../componentes/AppModal';

export default function EditarSalaScreen({ route, navigation }) {
  const theme = useTheme();
  const { authTokens } = useContext(AuthContext);
  const { salaId } = route.params;

  const [descricao, setDescricao] = useState("");
  const [turno, setTurno] = useState("");
  const [ano, setAno] = useState(null);
  const [anosDisponiveis, setAnosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [excluirConfirmado, setExcluirConfirmado] = useState(false);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);

  const turnos = [
    { label: "Selecione o turno", value: "selecione" },
    { label: "Manhã", value: "manha" },
    { label: "Tarde", value: "tarde" },
    { label: "Tempo Integral", value: "integral" },
  ];

  // Fetch sala e anos disponíveis
  useEffect(() => {
    const fetchData = async () => {
      try {
        const salaRes = await api.get(`salas/api/salas/${salaId}/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setDescricao(salaRes.data.descricao);
        setTurno(salaRes.data.turno);
        setAno(salaRes.data.ano);

        const anosRes = await api.get(`salas/anos/anos/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setAnosDisponiveis(Array.isArray(anosRes.data) ? anosRes.data : anosRes.data.results || []);
      } catch (error) {
        console.log("Erro ao buscar sala ou anos:", error);
        Alert.alert("Erro", "Não foi possível carregar a sala ou anos.");
      }
      setLoading(false);
    };
    fetchData();
  }, [salaId]);

  // Atualiza a sala
  const handleUpdate = async () => {
    try {
      await api.patch(
        `salas/api/edit_del_sala/${salaId}/`,
        { descricao, turno, ano },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      setModalSucessoVisible(true);
    } catch (error) {
      setModalErroVisible(true);
    }
  };

  // Deleta a sala
  const handleDelete = async () => {
    try {
      await api.delete(`salas/api/edit_del_sala/${salaId}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });

      setExcluirConfirmado(true);
      setModalVisible(false);

    } catch (error) {
      console.log("Erro ao deletar sala:", error);

      // Mostra alerta e redireciona após o usuário pressionar "OK"
      Alert.alert(
        "Sucesso!",
        "Sala excluída com sucesso. Você será redirecionado.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
        { cancelable: false }
      );
    }
  };

  // Navega de volta após o modal de exclusão ser fechado
  useEffect(() => {
    if (!modalVisible && excluirConfirmado) {
      navigation.goBack();
    }
  }, [modalVisible, excluirConfirmado]);

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content
          title="Editar Sala"
          titleStyle={{ color: "#fff" }}
        />
      </Appbar.Header>    
      <ScrollView style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Sala"
              value={descricao}
              onChangeText={setDescricao}
              style={styles.input}
              mode="outlined"
            />

            <Text style={styles.label}>Turno</Text>
            <View style={styles.pickerContainer1}>
              <Picker selectedValue={turno} onValueChange={setTurno}>
                {turnos.map((t) => (
                  <Picker.Item key={t.value} label={t.label} value={t.value} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Ano</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={ano} onValueChange={setAno}>
                {anosDisponiveis.map((a) => (
                  <Picker.Item key={a.id} label={a.descricao} value={a.id} />
                ))}
              </Picker>
            </View>

            <View style={styles.botoes}>
              <Button
                mode="contained"
                onPress={handleUpdate}
                style={{ flex: 1, borderColor: theme.colors.error, borderRadius: 6 }}

              >
                Salvar
              </Button>

              <Button
                mode="outlined"
                onPress={() => setModalVisible(true)}
                style={{ flex: 1, borderColor: theme.colors.error, borderRadius: 6 }}
                textColor={theme.colors.error}
              >
                Excluir Sala
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modal}
          >
            <Text style={{ marginBottom: 16 }}>Tem certeza que deseja excluir esta sala?</Text>
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              onPress={handleDelete}
              style={{ marginBottom: 8, borderRadius: 6 }}
            >
              Sim, excluir
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => setModalVisible(false)}
              style={{ marginBottom: 8, borderRadius: 6 }}
            >
              Cancelar
            </Button>
          </Modal>
        </Portal>

        <SuccessModal
          visible={modalSucessoVisible}
          message="Sala atualizada com sucesso!"
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: { marginBottom: 16 },
  card: {
    borderRadius: 16,
    elevation: 6,
    padding: 8,
  },
  pickerContainer1: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  botoes: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});
