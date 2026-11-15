
/* JV FIT AI V5 — Heart Rate Analysis Engine */
(() => {
  'use strict';

  const HEART_KEY = 'jvfit_heart_rate_v1';
  const WORKOUT_KEY = 'jvfit_personal_v1';

  function readArray(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function heartReadings() {
    return readArray(HEART_KEY)
      .map(r => ({
        date: new Date(r.date),
        bpm: Number(r.bpm)
      }))
      .filter(r =>
        Number.isFinite(r.date.getTime()) &&
        Number.isFinite(r.bpm) &&
        r.bpm >= 20 &&
        r.bpm <= 300
      )
      .sort((a, b) => a.date - b.date);
  }

  function analyzeHeartRate() {
    const readings = heartReadings();

    if (!readings.length) {
      return {
        status: 'No heart-rate data',
        count: 0,
        message: 'Import Apple Health readings to begin.'
      };
    }

    const values = readings.map(r => r.bpm);
    const sum = values.reduce((a, b) => a + b, 0);

    const latest = readings[readings.length - 1];
    const oldest = readings[0];

    return {
      status: 'Analysis available',
      count: readings.length,
      averageBpm: Math.round(sum / values.length),
      minimumBpm: Math.min(...values),
      maximumBpm: Math.max(...values),
      latestBpm: latest.bpm,
      latestDate: latest.date.toISOString(),
      oldestDate: oldest.date.toISOString()
    };
  }

  function analyzeWorkoutHistory() {
    const workouts = readArray(WORKOUT_KEY);

    const valid = workouts.filter(w =>
      w &&
      typeof w.date === 'string' &&
      Number.isFinite(Number(w.duration)) &&
      Number(w.duration) > 0
    );

    const minutes = valid.reduce(
      (total, w) => total + Number(w.duration),
      0
    );

    return {
      totalWorkouts: valid.length,
      totalMinutes: Math.round(minutes)
    };
  }

  function recommendations() {
    const heart = analyzeHeartRate();
    const workouts = analyzeWorkoutHistory();

    if (!heart.count) {
      return {
        status: 'Waiting for data',
        message: 'Import heart-rate readings first.'
      };
    }

    const ageDays =
      (Date.now() - new Date(heart.latestDate).getTime()) /
      86400000;

    if (ageDays > 30) {
      return {
        status: 'Historical data',
        message:
          'Your heart-rate readings are over 30 days old. ' +
          'Record a new workout before using heart-rate ' +
          'trends to adjust training.',
        heart,
        workouts
      };
    }

    return {
      status: 'Recent data available',
      message:
        'Recent heart-rate readings are available. ' +
        'Workout-specific analysis requires matching ' +
        'readings to recorded exercise sessions.',
      heart,
      workouts
    };
  }

  window.JVFitHeartAnalysis = {
    analyzeHeartRate,
    analyzeWorkoutHistory,
    recommendations
  };
})();
