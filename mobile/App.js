import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar
} from "react-native";

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.logo}>FITGENIUS</Text>
        <Text style={styles.subtitle}>
          Your health. Your progress. Your future.
        </Text>
      </View>

      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>Welcome Back 👋</Text>
        <Text style={styles.welcomeText}>
          Your fitness journey starts here.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Activity</Text>
        <Text style={styles.cardValue}>0</Text>
        <Text style={styles.cardLabel}>Steps</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>🔥 Calories</Text>
          <Text style={styles.smallValue}>0 kcal</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>📍 Distance</Text>
          <Text style={styles.smallValue}>0 km</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>❤️ Heart Rate</Text>
          <Text style={styles.smallValue}>-- bpm</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>😴 Sleep</Text>
          <Text style={styles.smallValue}>-- hours</Text>
        </View>
      </View>

      <View style={styles.connection}>
        <Text style={styles.connectionTitle}>
          Automatic Health Tracking
        </Text>
        <Text style={styles.connectionText}>
          Connect Apple Health or Android Health Connect
          to track your fitness activities automatically.
        </Text>
        <Text style={styles.status}>● Not connected yet</Text>
      </View>

      <Text style={styles.footer}>FITGENIUS © 2026</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080d1c",
    padding: 20
  },

  header: {
    marginTop: 45,
    marginBottom: 35
  },

  logo: {
    color: "#45d7ff",
    fontSize: 27,
    fontWeight: "bold",
    letterSpacing: 3
  },

  subtitle: {
    color: "#8b9bb8",
    marginTop: 8
  },

  welcome: {
    marginBottom: 25
  },

  welcomeTitle: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "bold"
  },

  welcomeText: {
    color: "#8b9bb8",
    marginTop: 8
  },

  card: {
    backgroundColor: "#111a30",
    padding: 25,
    borderRadius: 18,
    marginBottom: 18
  },

  cardTitle: {
    color: "#aab8d0",
    fontSize: 14
  },

  cardValue: {
    color: "#45d7ff",
    fontSize: 45,
    fontWeight: "bold",
    marginTop: 15
  },

  cardLabel: {
    color: "#8b9bb8"
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },

  smallCard: {
    backgroundColor: "#111a30",
    width: "48%",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15
  },

  smallValue: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 15
  },

  connection: {
    backgroundColor: "#111a30",
    padding: 22,
    borderRadius: 18,
    marginTop: 10
  },

  connectionTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold"
  },

  connectionText: {
    color: "#8b9bb8",
    lineHeight: 23,
    marginTop: 12
  },

  status: {
    color: "#ffb84d",
    marginTop: 18
  },

  footer: {
    color: "#66738c",
    textAlign: "center",
    marginTop: 35,
    marginBottom: 35
  }
});
