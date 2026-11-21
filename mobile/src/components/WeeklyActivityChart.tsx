import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { theme } from '../../theme';

type DayActivity = {
  date: string;
  day: string;
  steps: number;
  calories: number;
  distanceKm: number;
};

type Props = {
  days: DayActivity[];
};

export default function WeeklyActivityChart({ days }: Props) {
  const highestSteps = Math.max(
    ...days.map(day => day.steps),
    1
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weekly Activity</Text>

      <Text style={styles.subtitle}>
        Your daily steps over the last 7 days
      </Text>

      <View style={styles.chart}>
        {days.map((item, index) => {
          const height = Math.max(
            (item.steps / highestSteps) * 130,
            item.steps > 0 ? 5 : 3
          );

          return (
            <View style={styles.dayColumn} key={item.date || index}>
              <Text style={styles.stepValue}>
                {item.steps >= 1000
                  ? `${(item.steps / 1000).toFixed(1)}k`
                  : item.steps}
              </Text>

              <View style={styles.barArea}>
                <View
                  style={[
                    styles.bar,
                    {
                      height,
                      backgroundColor:
                        item.steps > 0
                          ? theme.colors.steps
                          : theme.colors.border,
                    },
                  ]}
                />
              </View>

              <Text style={styles.dayLabel}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Daily step goal
        </Text>

        <Text style={styles.goal}>
          10,000 steps
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },

  title: {
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: '800',
  },

  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 6,
  },

  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 25,
  },

  dayColumn: {
    flex: 1,
    alignItems: 'center',
  },

  stepValue: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginBottom: 8,
  },

  barArea: {
    height: 135,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  bar: {
    width: 15,
    borderRadius: 8,
    minHeight: 3,
  },

  dayLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 10,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 20,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  footerText: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },

  goal: {
    color: theme.colors.steps,
    fontSize: 12,
    fontWeight: '800',
  },
});
