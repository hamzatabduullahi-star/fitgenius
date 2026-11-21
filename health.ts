import * as HealthKit from '@appeeky/expo-healthkit';

export async function connectHealth() {
  try {
    if (!HealthKit.isAvailable()) {
      return {
        success: false,
        message: 'Health Connect is not available on this device.',
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
      message: 'Health permissions requested successfully.',
    };
  } catch (error) {
    console.error('Health connection error:', error);

    return {
      success: false,
      message: 'Could not connect to health data.',
    };
  }
}
