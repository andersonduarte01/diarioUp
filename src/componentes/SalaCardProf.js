import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import { Card, Text, Chip, useTheme } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

export default function SalaCard({ sala, navigation }) {
  const theme = useTheme();

  // animações
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);
  const alunosScale = useSharedValue(0.8);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 500 });
    cardTranslateY.value = withTiming(0, { duration: 500 });
    alunosScale.value = withSpring(1, { damping: 5, stiffness: 120 });
  }, []);

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
          <Card.Content>
            {/* Cabeçalho */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}
                >
                  <Ionicons name="school-outline" size={20} color="#fff" />
                </View>

                <Text
                  variant="titleMedium"
                  style={[styles.title, { color: theme.colors.primary }]}
                >
                  {sala.descricao}
                </Text>
              </View>

              <Chip
                style={[styles.chip, { backgroundColor: "rgba(60, 144, 235, 0.15)" }]}
                textStyle={[styles.chipText, { color: theme.colors.primary }]}
              >
                {sala.ano_descricao || "-"}
              </Chip>
            </View>

            {/* Infos */}
            <View style={styles.infos}>
              {/* Turno */}
              <View style={styles.infoRow}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
                <Text style={[styles.infoLabel, { color: theme.colors.onBackground }]}>
                  Turno:
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.onBackground }]}>
                  {sala.turno}
                </Text>
              </View>

              {/* Total de alunos */}
              <View style={styles.infoRow}>
                <Ionicons
                  name="people-outline"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
                <Text style={[styles.infoLabel, { color: theme.colors.onBackground }]}>
                  Total de alunos:
                </Text>
                <Animated.Text
                  style={[styles.infoValue, { color: theme.colors.onBackground }, animatedAlunosStyle]}
                >
                  {sala.total_alunos}
                </Animated.Text>
              </View>
            </View>
          </Card.Content>

          {/* Rodapé */}
          <Card.Actions style={styles.footer}>
            {/* Botão Editar */}
            <Pressable
              onPress={() => navigation.navigate('Detalhes', { sala })}
              style={[styles.buttonEdit, { borderColor: theme.colors.primary }]}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: "600" }}>
                Detalhes
              </Text>              
              <Ionicons
                name="arrow-forward-outline"
                size={16}
                color={theme.colors.primary}
                style={{ marginLeft: 6}}
              />
            </Pressable>            
          </Card.Actions>
        </Card>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  card: { borderRadius: 20, elevation: 6 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 36, height: 36, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 8 },
  title: { fontWeight: "bold", fontSize: 18 },
  chip: { borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2, marginTop: 10 },
  chipText: { fontSize: 12, fontWeight: "600" },
  infos: { marginTop: 14 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, marginLeft: 6 },
  icon: { marginRight: 6 },
  infoLabel: { fontWeight: "600" },
  infoValue: { marginLeft: 6, fontWeight: "700" },
  footer: { justifyContent: "flex-end", flexDirection: "row", gap: 8 },
  buttonEdit: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 18
  },
  buttonAlunos: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
