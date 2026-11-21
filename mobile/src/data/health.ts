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
      includeBackgroundRead: true,
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
    console.error('Health permission error:', error);

    return {
      success: false,
      message: 'Unable to request health permissions.',
    };
  }
}

export async function getTodayHealthData() {
  try {
    const today = startOfDay();
    const now = new Date();

    const [
      steps,
      distance,
      calories,
      heartRates,
      sleep,
      workouts,
    ] = await Promise.all([
      HealthKit.queryStatistics({
        type: HealthKit.QuantityType.stepCount,
        unit: HealthKit.Unit.count,
        from: today,
        to: now,
        options: HealthKit.StatisticsOption.cumulativeSum,
      }),

      HealthKit.queryStatistics({
        type: HealthKit.QuantityType.distanceWalkingRunning,
        unit: HealthKit.Unit.meter,
        from: today,
        to: now,
        options: HealthKit.StatisticsOption.cumulativeSum,
      }),

      HealthKit.queryStatistics({
        type: HealthKit.QuantityType.activeEnergyBurned,
        unit: HealthKit.Unit.kilocalorie,
        from: today,
        to: now,
        options: HealthKit.StatisticsOption.cumulativeSum,
      }),

      HealthKit.queryQuantitySamples({
        type: HealthKit.QuantityType.heartRate,
        unit: HealthKit.Unit.countPerMinute,
        from: today,
        to: now,
        limit: 1,
        ascending: false,
      }),

      HealthKit.queryCategorySamples({
        type: HealthKit.CategoryType.sleepAnalysis,
        from: new Date(Date.now() - 24 * 60 * 60 * 1000),
        to: now,
        ascending: true,
      }),

      HealthKit.queryWorkouts({
        from: today,
        to: now,
        limit: 50,
        ascending: false,
      }),
    ]);

    const asleepValues = [
      HealthKit.SleepAnalysisValue.asleepUnspecified,
      HealthKit.SleepAnalysisValue.asleepCore,
      HealthKit.SleepAnalysisValue.asleepDeep,
      HealthKit.SleepAnalysisValue.asleepREM,
    ];

    const sleepMinutes = sleep.reduce((total, sample) => {
      if (!asleepValues.includes(sample.value)) {
        return total;
      }

      const minutes =
        (new Date(sample.endDate).getTime() -
          new Date(sample.startDate).getTime()) / 60000;

      return total + Math.max(0, minutes);
    }, 0);

    const exerciseMinutes = workouts.reduce(
      (total, workout) => {
        const minutes =
          (new Date(workout.endDate).getTime() -
            new Date(workout.startDate).getTime()) / 60000;

        return total + Math.max(0, minutes);
      },
      0
    );

    return {
      success: true,
      steps: steps.sum ?? 0,
      distanceKm: (distance.sum ?? 0) / 1000,
      calories: calories.sum ?? 0,
      heartRate: heartRates[0]?.value ?? null,
      sleepHours: sleepMinutes / 60,
      exerciseMinutes,
    };
  } catch (error) {
    console.error('Health data retrieval error:', error);

    return {
      success: false,
      message: 'Unable to retrieve health readings.',
    };
  }
}

/* WEEKLY ACTIVITY DATA */

export async function getWeeklyActivityData() {
  try {
    const endDate = new Date();

    const startDate = startOfDay();
    startDate.setDate(startDate.getDate() - 6);

    const [steps, calories, distance] = await Promise.all([
      HealthKit.queryStatisticsCollection({
        type: HealthKit.QuantityType.stepCount,
        unit: HealthKit.Unit.count,
        from: startDate,
        to: endDate,
        interval: { day: 1 },
        options: HealthKit.StatisticsOption.cumulativeSum,
      }),

      HealthKit.queryStatisticsCollection({
        type: HealthKit.QuantityType.activeEnergyBurned,
        unit: HealthKit.Unit.kilocalorie,
        from: startDate,
        to: endDate,
        interval: { day: 1 },
        options: HealthKit.StatisticsOption.cumulativeSum,
      }),

      HealthKit.queryStatisticsCollection({
        type: HealthKit.QuantityType.distanceWalkingRunning,
        unit: HealthKit.Unit.meter,
        from: startDate,
        to: endDate,
        interval: { day: 1 },
        options: HealthKit.StatisticsOption.cumulativeSum,
      }),
    ]);

    const weeklyData = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + index);

      const findDay = (records: any[]) => {
        return records.find(record => {
          const recordDate = new Date(record.startDate);

          return (
            recordDate.getFullYear() === date.getFullYear() &&
            recordDate.getMonth() === date.getMonth() &&
            recordDate.getDate() === date.getDate()
          );
        });
      };

      const stepRecord = findDay(steps);
      const calorieRecord = findDay(calories);
      const distanceRecord = findDay(distance);

      return {
        date: date.toISOString(),
        day: date.toLocaleDateString('en-US', {
          weekday: 'short',
        }),
        steps: stepRecord?.sum ?? 0,
        calories: calorieRecord?.sum ?? 0,
        distanceKm: (distanceRecord?.sum ?? 0) / 1000,
      };
    });

    return {
      success: true,
      days: weeklyData,
    };
  } catch (error) {
    console.error('Weekly health data error:', error);

    return {
      success: false,
      message: 'Unable to retrieve weekly health data.',
      days: [],
    };
  }
}
