import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Appbar, useTheme, Card, Divider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import DetalhesCard from "../../componentes/DetalhesCard";

export default function SalaDetalhesScreen({ route, navigation }) {
  const sala = route?.params?.sala || {
    id: 1,
    descricao: "Sala 101",
    ano_descricao: "2025",
    turno: "Manhã",
    professor_nome: "Professor Exemplo",
    total_alunos: 30,
  };

  const theme = useTheme();

  const actions = [
    { title: "Alunos", icon: "account-group", screen: "AlunosScreen" },
    { title: "Frequência", icon: "calendar-check", screen: "Calendario" },
    { title: "Relatórios", icon: "file-chart", screen: "RelatoriosScreen" },
    { title: "Registros", icon: "clipboard-text", screen: "AdicionarRegistro" },
  ];

  return (
    <>
      <Appbar.Header style={{ backgroundColor: "#1E88E5" }} elevated>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalhes da Sala" titleStyle={{ color: "#fff" }} />
      </Appbar.Header>

      <ScrollView style={{ backgroundColor: "#EAF2FA" }}>
        <View style={styles.container}>
          <DetalhesCard key={sala.id} sala={sala} navigation={navigation} />

          <Card style={styles.actionsCard}>
            {actions.map((action, index) => (
              <View key={action.title}>
                <TouchableOpacity
                  style={styles.actionRow}
                  onPress={() =>
                    navigation.navigate(action.screen, { salaId: sala.id, salaDescricao: sala.descricao, sala })
                  }
                >
                  <View style={styles.iconWrapper}>
                    <MaterialCommunityIcons
                      name={action.icon}
                      size={28}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.verticalDivider} />
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color="#999"
                    style={{ marginLeft: "auto" }}
                  />
                </TouchableOpacity>
                {index < actions.length - 1 && <Divider />}
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionsCard: {
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 2,
    overflow: "hidden",
    marginTop: 1,
    marginLeft: 10,
    marginRight: 10
    
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#aaa',
    marginHorizontal: 12,
    alignSelf: 'stretch',
    marginRight: 20
  },  
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
