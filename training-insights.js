
/* JV FIT AI V5 — Personalized Training Insights */
(() => {
  'use strict';

  const WORKOUT_KEY = 'jvfit_personal_v1';

  function getWorkouts() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(WORKOUT_KEY) || '[]'
      );

      const entries = Array.isArray(saved)
        ? saved
        : Array.isArray(saved.entries)
          ? saved.entries
          : [];

      return entries.filter(w =>
        w &&
        !Number.isNaN(Date.parse(w.date)) &&
        Number.isFinite(Number(w.duration)) &&
        Number(w.duration) > 0
      );
    } catch {
      return [];
    }
  }

  function analyze() {
    const workouts = getWorkouts();
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;

    const recent = workouts.filter(w => {
      const time = Date.parse(w.date);
      return time <= now && time >= now - week;
    });

    const minutes = recent.reduce(
      (sum, w) => sum + Number(w.duration),
      0
    );

    const types = recent.map(w =>
      String(w.type || 'other').toLowerCase()
    );

    const hasStrength = types.some(t =>
      /strength|weight|lifting|resistance/.test(t)
    );

    const hasConditioning = types.some(t =>
      /run|walk|cardio|cycle|bike|hiit|conditioning/.test(t)
    );

    return {
      totalWorkouts: workouts.length,
      weeklyWorkouts: recent.length,
      weeklyMinutes: Math.round(minutes),
      hasStrength,
      hasConditioning
    };
  }

  function getRecommendations() {
    const stats = analyze();
    const suggestions = [];

    if (stats.weeklyWorkouts === 0) {
      suggestions.push(
        'Start with a 20–30 minute workout at a comfortable intensity.'
      );
    }

    if (!stats.hasStrength) {
      suggestions.push(
        'Core strength: Try 2 sets of planks, dead bugs, ' +
        'and controlled squats. Focus on technique.'
      );
    }

    if (!stats.hasConditioning) {
      suggestions.push(
        'Conditioning: Try 15–20 minutes of brisk walking, ' +
        'easy cycling, or comfortable jogging.'
      );
    }

    if (stats.weeklyWorkouts >= 3) {
      suggestions.push(
        'You have logged at least 3 workouts this week. ' +
        'Include recovery time between demanding sessions.'
      );
    }

    suggestions.push(
      'These are general training suggestions, not ' +
      'medical or recovery assessments.'
    );

    return {
      goals: ['Core strength', 'Conditioning'],
      stats,
      suggestions
    };
  }

  window.JVFitTrainingInsights = {
    analyze,
    getRecommendations
  };
})();
