import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MetricCard from '../components/MetricCard';
import StepsRing from '../components/StepsRing';
import { today } from '../data/placeholder';
import { theme } from '../../theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.logo}>FITGENIUS</Text>

        <Text style={styles.title}>Today</Text>

        <Text style={styles.subtitle}>
          Keep moving, you're doing great.
        </Text>

        <View style={styles.ringWrap}>
          <StepsRing
            steps={today.steps}
            goal={today.stepGoal}
          />
        </View>

        <Text style={styles.sectionTitle}>
          Your Activity
        </Text>

        <View style={styles.grid}>
          <MetricCard
            icon="🔥"
            label="Calories"
            value={String(today.calories)}
            unit="kcal"
            color={theme.colors.calories}
          />

          <MetricCard
            icon="📍"
            label="Distance"
            value={today.distanceKm.toFixed(1)}
            unit="km"
            color={theme.colors.steps}
          />

          <MetricCard
            icon="❤️"
            label="Heart Rate"
            value={String(today.heartRate)}
            unit="bpm"
            color={theme.colors.heart}
          />

          <MetricCard
            icon="🌙"
            label="Sleep"
            value={today.sleepHours.toFixed(1)}
            unit="hrs"
            color={theme.colors.sleep}
          />

          <MetricCard
            icon="⚡"
            label="Exercise"
            value={String(today.exerciseMinutes)}
            unit="min"
            color={theme.colors.accent}
          />
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            Automatic Health Tracking
          </Text>

          <Text style={styles.noticeText}>
            HealthKit and Health Connect integration
            will allow FitGenius to access supported
            health data with your permission.
          </Text>

          <Text style={styles.status}>
            ● Integration coming soon
          </Text>
        </View>

        <Text style={styles.footer}>
          FITGENIUS © 2026
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(6),
  },

  logo: {
    color: theme.colors.steps,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 25,
  },

  title: {
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: '800',
  },

  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    marginTop: 4,
  },

  ringWrap: {
    alignItems: 'center',
    marginVertical: theme.spacing(4),
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  notice: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 20,
    marginTop: 15,
  },

  noticeTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: 'bold',
  },

  noticeText: {
    color: theme.colors.textMuted,
    lineHeight: 23,
    marginTop: 12,
  },

  status: {
    color: theme.colors.accent,
    marginTop: 15,
  },

  footer: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 35,
  },
});
