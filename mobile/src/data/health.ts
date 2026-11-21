import * as HealthKit from '@appeeky/expo-healthkit';

const startOfDay = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export async function connectHealth() {
  try {
    if (!HealthKit.isAvailable()) {
      return {
        success: false,
        message: 'Health services are unavailable on this device.',
      };
    }

    await HealthKit.requestAuthorization({
      toRead: [
        HealthKit.QuantityType.stepCount,
        HealthKit.QuantityType.distanceWalkingRunning,
        HealthKit.QuantityType.activeEnergyBurned,
        HealthKit.QuantityType.heartRate,
        HealthKit.CategoryType.sleepAnalysis,
        HealthKit.WorkoutType.workout,
      ],
    });

    return {
      success: true,
      message: 'Health permission request completed.',
    };
  } catch (error) {
    console.error('Health connection error:', error);

    return {
      success: false,
      message: 'Unable to request health permissions.',
    };
  }
}

export async function getTodayHealthData() {
  const from = startOfDay();
  const to = new Date();

  const [steps, distance, calories, heartRates, sleep, workouts] =
    await Promise.all([
      HealthKit.queryStatistics({
        type: HealthKit.QuantityType.stepCount,
        unit: HealthKit.Unit.count,
        from,
        to,
        options: HealthKit.StatisticsOption.cumulativeSum,
      }),

      HealthKit.queryStatistics({
        type: HealthKit.QuantityType.distanceWalkingRunning,
        unit: HealthKit.Unit.meter,
        from,
        to,
        options: HealthKit.StatisticsOption.cumulativeSum,
      }),

      HealthKit.queryStatistics({
        type: HealthKit.QuantityType.activeEnergyBurned,
        unit: HealthKit.Unit.kilocalorie,
        from,
        to,
        options: HealthKit.StatisticsOption.cumulativeSum,
      }),

      HealthKit.queryQuantitySamples({
        type: HealthKit.QuantityType.heartRate,
        unit: HealthKit.Unit.countPerMinute,
        from,
        to,
        limit: 1,
        ascending: false,
      }),

      HealthKit.queryCategorySamples({
        type: HealthKit.CategoryType.sleepAnalysis,
        from,
        to,
      }),

      HealthKit.queryWorkouts({
        from,
        to,
        limit: 20,
      }),
    ]);

  const sleepMinutes = sleep.reduce((total, sample) => {
    const value = String(sample.value).toLowerCase();

    if (
      value.includes('asleep') ||
      value.includes('core') ||
      value.includes('deep') ||
      value.includes('rem')
    ) {
      return total +
        (new Date(sample.endDate).getTime() -
         new Date(sample.startDate).getTime()) / 60000;
    }

    return total;
  }, 0);

  return {
    steps: steps?.sum ?? 0,
    distanceKm: (distance?.sum ?? 0) / 1000,
    calories: calories?.sum ?? 0,
    heartRate: heartRates[0]?.quantity ?? null,
    sleepHours: sleepMinutes / 60,
    exerciseMinutes: workouts.reduce((total, workout) => {
      return total +
        (new Date(workout.endDate).getTime() -
         new Date(workout.startDate).getTime()) / 60000;
    }, 0),
  };
}
