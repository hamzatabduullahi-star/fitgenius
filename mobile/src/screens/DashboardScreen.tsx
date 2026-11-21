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
import { connectHealth, getTodayHealthData } from '../data/health';
import { theme } from '../../theme';

const STEP_GOAL = 10000;

export default function DashboardScreen() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(
    'Connecting to your health service...'
  );

  const hasConnected = useRef(false);
  const isLoading = useRef(false);

  async function refreshHealthData() {
    if (isLoading.current) return;

    isLoading.current = true;
    setLoading(true);

    try {
      const result = await getTodayHealthData();

      if (!result.success) {
        setStatus(result.message || 'Unable to retrieve health data.');
        return;
      }

      setHealth(result);
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

      // Allow the health service time to finish processing permissions.
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = await getTodayHealthData();

      if (!result.success) {
        setStatus(result.message || 'Unable to retrieve health data.');
        return;
      }

      setHealth(result);
      setStatus('Your health data is up to date.');
    } catch (error) {
      console.error('Health connection error:', error);
      setStatus('Health connection failed. Please try again.');
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
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.logo}>FITGENIUS</Text>

        <Text style={styles.title}>Today</Text>

        <Text style={styles.subtitle}>
          Your health and activity at a glance.
        </Text>

        {loading && !health ? (
          <View style={styles.loading}>
            <ActivityIndicator
              size="large"
              color={theme.colors.steps}
            />

            <Text style={styles.loadingText}>
              Connecting to health services...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.ringWrap}>
              <StepsRing
                steps={health?.steps ?? 0}
                goal={STEP_GOAL}
              />
            </View>

            <Text style={styles.sectionTitle}>
              Your Activity
            </Text>

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
          </>
        )}

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            Health Tracking Status
          </Text>

          <Text style={styles.noticeText}>
            {status}
          </Text>

          <Pressable
            style={styles.button}
            onPress={loadHealth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Refreshing...' : 'Refresh Health Data'}
            </Text>
          </Pressable>
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

  loading: {
    alignItems: 'center',
    marginVertical: 55,
  },

  loadingText: {
    color: theme.colors.textMuted,
    marginTop: 15,
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

  button: {
    backgroundColor: theme.colors.steps,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 18,
  },

  buttonText: {
    color: '#080d1c',
    fontWeight: '800',
  },

  footer: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 35,
  },
});
