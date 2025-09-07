import React, { useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Card, Text, useTheme, Divider } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

export default function SalaCard({ sala, navigation, index = 0 }) {
  const theme = useTheme();

  // animações
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);
  const alunosScale = useSharedValue(0.8);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    const delay = index * 120; // atraso por card na lista
    cardOpacity.value = withTiming(1, { duration: 500, delay });
    cardTranslateY.value = withTiming(0, { duration: 500, delay });
    alunosScale.value = withSpring(1, { damping: 5, stiffness: 120, delay });
  }, [index]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { translateY: cardTranslateY.value },
      { scale: pressScale.value },
    ],
  }));

  const animatedAlunosStyle = useAnimatedStyle(() => ({
    transform: [{ scale: alunosScale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (pressScale.value = withSpring(0.97))}
      onPressOut={() => (pressScale.value = withSpring(1))}
    >
      <Animated.View style={[animatedCardStyle, styles.container]}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.row}>
            {/* Parte Azul (1/3) */}
            <View
              style={[styles.left, { backgroundColor: theme.colors.primary }]}
            >
              {/* Ícone da Sala */}
              <View style={styles.iconContainer}>
                <Ionicons name="school-outline" size={60} color="#fff" />
              </View>

              <Divider style={styles.dividerLight} />

              <View style={styles.alunosContainer}>
                <Animated.Text
                  style={[styles.alunosText, animatedAlunosStyle]}
                >
                  {sala.total_alunos} alunos
                </Animated.Text>
              </View>
            </View>
            <View style={styles.right}>
              <Text style={[styles.title, { color: theme.colors.primary }]}>
                {sala.descricao}
              </Text>

              <Divider style={styles.dividerDark} />

              {/* Ano e Turno */}
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Ano: {sala.ano_descricao || "-"}
                </Text>
                <Text style={styles.infoText}>Turno: {sala.turno}</Text>
              </View>

              <Divider style={styles.dividerDark} />
              <View style={styles.footer}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("EditarSala", { salaId: sala.id })
                  }
                  style={[
                    styles.buttonEdit,
                    { borderColor: theme.colors.primary },
                  ]}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={16}
                    color={theme.colors.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Editar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    navigation.navigate("AlunosScreen", {
                      salaId: sala.id,
                      salaDescricao: sala.descricao,
                    })
                  }
                  style={[
                    styles.buttonAlunos,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}
                  >
                    Alunos
                  </Text>
                </Pressable>
              </View>

            </View>
          </View>
        </Card>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 10,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    minHeight: 120,
  },
  left: {
    width: "33%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    flex: 2,
    justifyContent: "center",
  },
  alunosContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  alunosText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  right: {
    width: "67%",
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    marginLeft: 20
  },
  dividerLight: {
    backgroundColor: "rgba(255,255,255,0.4)",
    width: "80%",
    height: 2,
    marginVertical: 2,
  },
  dividerDark: {
    backgroundColor: "rgba(0,0,0,0.1)",
    height: 2,
    marginVertical: 6,
  },
  infoContainer: {
    flexDirection: "column",
    gap: 4,
    marginLeft: 20
  },
  infoText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600"
  },
footer: {
  flexDirection: "row",
  marginHorizontal: 15,
  marginTop: 10,
  gap: 10,
},

buttonEdit: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center", 
  borderWidth: 1,
  paddingVertical: 4,
  borderRadius: 4,
},

buttonAlunos: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 4,
  borderRadius: 4,
},
});
