
/* JV FIT AI V4 — Adaptive Goals Engine */
(() => {
  'use strict';

  const WORKOUT_KEY = 'jvfit_personal_v1';

  function getWorkouts() {
    try {
      const data = JSON.parse(
        localStorage.getItem(WORKOUT_KEY) || '[]'
      );
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function analyze() {
    const workouts = getWorkouts();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 27);

    const recent = workouts.filter(w => {
      const date = new Date(w.date + 'T12:00:00');
      return Number.isFinite(date.getTime()) &&
        date >= start && date <= new Date();
    });

    const count = type =>
      recent.filter(w => w.type === type).length;

    const minutes = types =>
      recent
        .filter(w => types.includes(w.type))
        .reduce((sum, w) =>
          sum + (Number(w.duration) || 0), 0);

    const runningMiles = recent
      .filter(w =>
        ['Running', 'Walking'].includes(w.type))
      .reduce((sum, w) =>
        sum + (Number(w.distance) || 0), 0);

    const totalMinutes = recent.reduce(
      (sum, w) => sum + (Number(w.duration) || 0),
      0
    );

    return {
      workouts: recent.length,
      weeklyAverage: recent.length / 4,
      runningMiles,
      totalMinutes,
      conditioningMinutes: minutes([
        'Running', 'Walking', 'Cycling',
        'Conditioning', 'Boxing'
      ]),
      strengthSessions: count('Strength')
    };
  }

  function recommendations() {
    const a = analyze();

    if (a.workouts === 0) {
      return {
        status: 'Getting started',
        message: 'Log workouts to unlock adaptive goals.',
        goals: {
          workouts: 3,
          activeMinutes: 90,
          runningMiles: 3,
          strengthSessions: 2
        }
      };
    }

    const round = (value, step) =>
      Math.round(value / step) * step;

    return {
      status: 'Personalized suggestions',
      message: 'Review these weekly targets.',
      goals: {
        workouts: Math.max(2, Math.min(6,
          Math.ceil(a.weeklyAverage * 1.1))),
        activeMinutes: Math.max(60, Math.min(300,
          round(a.totalMinutes / 4 * 1.1, 5))),
        runningMiles: Math.max(1, Math.min(25,
          round(a.runningMiles / 4 * 1.1, 0.5))),
        strengthSessions: Math.max(1, Math.min(4,
          Math.ceil(a.strengthSessions / 4)))
      }
    };
  }

  window.JVFitAdaptive = {
    analyze,
    recommendations
  };
})();
