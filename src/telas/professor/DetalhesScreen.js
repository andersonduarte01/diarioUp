import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Appbar, useTheme, Divider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DetalhesCard from "../../componentes/DetalhesCard"

export default function SalaDetalhesScreen({ route, navigation }) {
  const sala = route?.params?.sala || {
    id: 1,
    nome: "Sala 101",
    ano: "2025",
    turno: "Manhã",
    professor_nome: "Professor Exemplo",
  };

  const theme = useTheme();

  const actions = [
    { title: "Alunos", icon: "account-group", screen: "AlunosSala" },
    { title: "Frequência", icon: "calendar-check", screen: "FrequenciaSala" },
    { title: "Relatórios", icon: "file-chart", screen: "RelatoriosSala" },
    { title: "Registros", icon: "clipboard-text", screen: "RegistrosSala" },
  ];

  return (
    <>
      <Appbar.Header style={{ backgroundColor: "#1E88E5" }} elevated>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalhes da Sala" titleStyle={{ color: "#fff" }} />
      </Appbar.Header>

      <ScrollView style={{ backgroundColor: "#EAF2FA" }}>
        <View style={styles.container}>
          <DetalhesCard key={sala.id} sala={sala} navigation={navigation}/>
          
          <View style={styles.actionsContainer}>
            {/* Card Alunos */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("AlunosScreen", { salaId: sala.id, salaDescricao: sala.descricao,})}
            >
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.actionTitle}>Alunos</Text>
            </TouchableOpacity>

            {/* Card Frequência */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Calendario", { sala })}
            >
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.actionTitle}>Frequência</Text>
            </TouchableOpacity>

            {/* Card Relatórios */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("RelatoriosSala", { sala })}
            >
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="file-chart"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.actionTitle}>Relatórios</Text>
            </TouchableOpacity>

            {/* Card Registros */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("RegistrosSala", { sala })}
            >
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="clipboard-text"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.actionTitle}>Registros</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardMain: {
    borderRadius: 16,
    paddingBottom: 12,
    backgroundColor: "#fcfdfdff",
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#007AFF",
    textAlign: "center"
  },
  infoText: {
    fontSize: 14,
    marginVertical: 2,
  },
  actionsContainer: {
    gap: 14,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 1,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E0ECFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
