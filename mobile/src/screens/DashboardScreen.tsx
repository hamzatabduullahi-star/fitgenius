import React, { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  AppState,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import MetricCard from '../components/MetricCard';
import StepsRing from '../components/StepsRing';
import WeeklyActivityChart from '../components/WeeklyActivityChart';

import {
  connectHealth,
  getTodayHealthData,
  getWeeklyActivityData,
  isHealthAvailable,
} from '../data/health';

import { theme } from '../../theme';

const STEP_GOAL = 10000;

export default function DashboardScreen() {
  const [health, setHealth] = useState<any>(null);
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);

  const [status, setStatus] = useState(
    'Checking health service availability...'
  );

  const hasConnected = useRef(false);
  const isLoading = useRef(false);

  const today = new Date();

  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const hour = today.getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
      ? 'Good afternoon'
      : 'Good evening';

  const steps = health?.steps ?? 0;

  const progress = Math.min(
    (steps / STEP_GOAL) * 100,
    100
  );

  const remainingSteps = Math.max(
    STEP_GOAL - steps,
    0
  );

  async function refreshHealthData() {
    if (isLoading.current) return;

    if (!isHealthAvailable()) {
      setAvailable(false);
      setHealth(null);
      setWeeklyActivity([]);
      setStatus(
        'Health services are unavailable on this device. You can still use FitGenius.'
      );
      return;
    }

    isLoading.current = true;
    setLoading(true);

    try {
      const [result, weeklyResult] = await Promise.all([
        getTodayHealthData(),
        getWeeklyActivityData(),
      ]);

      if (!result.success) {
        setHealth(null);
        setStatus(
          result.message || 'Unable to retrieve health data.'
        );
        return;
      }

      setHealth(result);

      if (weeklyResult.success) {
        setWeeklyActivity(weeklyResult.days);
      }

      setStatus('Your health data is up to date.');
    } catch (error) {
      console.error('Health refresh error:', error);
      setStatus('Unable to refresh health data.');
    } finally {
      isLoading.current = false;
      setLoading(false);
    }
  }

  async function loadHealth() {
    if (isLoading.current) return;

    if (!isHealthAvailable()) {
      setAvailable(false);
      setHealth(null);
      setWeeklyActivity([]);
      setStatus(
        'No compatible health service was found. You can still use FitGenius.'
      );
      return;
    }

    setAvailable(true);
    isLoading.current = true;
    setLoading(true);

    try {
      const connection = await connectHealth();

      if (!connection.success) {
        setStatus(connection.message);
        setHealth(null);
        return;
      }

      hasConnected.current = true;

      const [result, weeklyResult] = await Promise.all([
        getTodayHealthData(),
        getWeeklyActivityData(),
      ]);

      if (!result.success) {
        setStatus(
          result.message || 'Unable to retrieve health data.'
        );
        return;
      }

      setHealth(result);

      if (weeklyResult.success) {
        setWeeklyActivity(weeklyResult.days);
      }

      setStatus('Your health data is up to date.');
    } catch (error) {
      console.error('Health connection error:', error);
      setStatus('Health connection failed. You can still use FitGenius.');
    } finally {
      isLoading.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHealth();

    const subscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (
          nextAppState === 'active' &&
          hasConnected.current
        ) {
          refreshHealthData();
        }
      }
    );

    return () => subscription.remove();
  }, []);

  const display = (
    value: number | null | undefined,
    decimals = 0
  ) => {
    if (value === null || value === undefined) {
      return '—';
    }

    return decimals
      ? value.toFixed(decimals)
      : Math.round(value).toString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>FITGENIUS</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          <View style={styles.profileIcon}>
            <Text style={styles.profileLetter}>F</Text>
          </View>
        </View>

        {/* GREETING */}

        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            {greeting} 👋
          </Text>

          <Text style={styles.title}>
            Let's get moving.
          </Text>

          <Text style={styles.subtitle}>
            Your health and activity at a glance.
          </Text>
        </View>

        {/* DAILY STEPS */}

        <View style={styles.stepsCard}>
          <Text style={styles.cardHeading}>
            DAILY STEPS
          </Text>

          <View style={styles.ringWrap}>
            <StepsRing
              steps={steps}
              goal={STEP_GOAL}
            />
          </View>

          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Daily goal progress
            </Text>

            <Text style={styles.progressValue}>
              {Math.round(progress)}%
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text style={styles.remaining}>
            {health
              ? remainingSteps > 0
                ? `${remainingSteps.toLocaleString()} steps left to reach your goal`
                : 'Congratulations! You reached your daily goal.'
              : 'Connect a health service to see your step progress.'}
          </Text>
        </View>

        {/* TODAY'S ACTIVITY */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Your Activity
          </Text>

          <Text style={styles.sectionCaption}>
            TODAY
          </Text>
        </View>

        <View style={styles.grid}>
          <MetricCard
            icon="🔥"
            label="Calories"
            value={display(health?.calories)}
            unit="kcal"
            color={theme.colors.calories}
          />

          <MetricCard
            icon="📍"
            label="Distance"
            value={display(health?.distanceKm, 1)}
            unit="km"
            color={theme.colors.steps}
          />

          <MetricCard
            icon="❤️"
            label="Heart Rate"
            value={display(health?.heartRate)}
            unit="bpm"
            color={theme.colors.heart}
          />

          <MetricCard
            icon="🌙"
            label="Sleep"
            value={display(health?.sleepHours, 1)}
            unit="hrs"
            color={theme.colors.sleep}
          />

          <MetricCard
            icon="⚡"
            label="Exercise"
            value={display(health?.exerciseMinutes)}
            unit="min"
            color={theme.colors.accent}
          />
        </View>

        {/* WEEKLY PROGRESS */}

        <View style={[styles.sectionHeader, styles.weeklyHeader]}>
          <Text style={styles.sectionTitle}>
            Weekly Progress
          </Text>

          <Text style={styles.sectionCaption}>
            LAST 7 DAYS
          </Text>
        </View>

        {available ? (
          <WeeklyActivityChart days={weeklyActivity} />
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartTitle}>
              Weekly activity will appear here
            </Text>

            <Text style={styles.emptyChartText}>
              Connect a compatible health service to view your activity history.
            </Text>
          </View>
        )}

        {/* HEALTH CONNECTION */}

        <View style={styles.notice}>
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusDot,
                !available && styles.statusDotInactive,
              ]}
            />

            <Text style={styles.noticeTitle}>
              Health Connection
            </Text>
          </View>

          <Text style={styles.noticeText}>
            {status}
          </Text>

          <Pressable
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={loadHealth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#080d1c" />
            ) : (
              <Text style={styles.buttonText}>
                ↻  {available ? 'Refresh Health Data' : 'Try Connecting Again'}
              </Text>
            )}
          </Pressable>
        </View>

        {/* FOOTER */}

        <Text style={styles.footer}>
          FITGENIUS © 2026
        </Text>

        <Text style={styles.footerCaption}>
          Your health. Your progress. Your journey.
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    color: theme.colors.steps,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
  },

  date: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 6,
  },

  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileLetter: {
    color: theme.colors.steps,
    fontSize: 19,
    fontWeight: '900',
  },

  greetingSection: {
    marginBottom: 24,
  },

  greeting: {
    color: theme.colors.steps,
    fontSize: 15,
    fontWeight: '700',
  },

  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 7,
  },

  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 7,
  },

  stepsCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    padding: 20,
    marginBottom: 30,
  },

  cardHeading: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

  ringWrap: {
    alignItems: 'center',
    marginVertical: 22,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  progressLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },

  progressValue: {
    color: theme.colors.steps,
    fontSize: 13,
    fontWeight: '800',
  },

  progressBackground: {
    height: 9,
    backgroundColor: theme.colors.border,
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.steps,
    borderRadius: 10,
  },

  remaining: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 13,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  weeklyHeader: {
    marginTop: 28,
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },

  sectionCaption: {
    color: theme.colors.steps,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  emptyChart: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 20,
    marginBottom: 10,
  },

  emptyChartTitle: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 14,
  },

  emptyChartText: {
    color: theme.colors.textMuted,
    lineHeight: 22,
    fontSize: 12,
    marginTop: 8,
  },

  notice: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 20,
    marginTop: 15,
  },

  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
    marginRight: 9,
  },

  statusDotInactive: {
    backgroundColor: theme.colors.calories,
  },

  noticeTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },

  noticeText: {
    color: theme.colors.textMuted,
    lineHeight: 23,
    marginTop: 12,
  },

  button: {
    backgroundColor: theme.colors.steps,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 48,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#080d1c',
    fontWeight: '900',
  },

  footer: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 35,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

  footerCaption: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontSize: 11,
    marginTop: 7,
  },
});
