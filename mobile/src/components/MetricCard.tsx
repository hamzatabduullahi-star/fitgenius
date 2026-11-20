import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

type Props = {
  icon: string;
  label: string;
  value: string;
  unit: string;
  color: string;
};

export default function MetricCard({
  icon,
  label,
  value,
  unit,
  color
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>

      <Text style={styles.label}>{label}</Text>

      <View style={styles.row}>
        <Text style={[styles.value, { color }]}>
          {value}
        </Text>

        <Text style={styles.unit}> {unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  icon: {
    fontSize: 22,
  },

  label: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },

  value: {
    fontSize: 26,
    fontWeight: '700',
  },

  unit: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
});
