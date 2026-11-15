
/* JV FIT AI V5 — Adaptive Workout Planner */
(() => {
  'use strict';

  const workouts = {
    core: [
      {
        name: 'Dead Bug',
        sets: 3,
        reps: '10 per side',
        rest: 30
      },
      {
        name: 'Front Plank',
        sets: 3,
        reps: '30 seconds',
        rest: 30
      },
      {
        name: 'Bird Dog',
        sets: 3,
        reps: '10 per side',
        rest: 30
      },
      {
        name: 'Side Plank',
        sets: 2,
        reps: '20 seconds per side',
        rest: 30
      }
    ],

    conditioning: [
      {
        name: 'Brisk Walk or Easy Jog',
        sets: 1,
        reps: '5 minutes warm-up',
        rest: 0
      },
      {
        name: 'Jog / Walk Intervals',
        sets: 6,
        reps: '1 minute jog + 1 minute walk',
        rest: 0
      },
      {
        name: 'Easy Walk',
        sets: 1,
        reps: '5 minutes cool-down',
        rest: 0
      }
    ],

    fullBody: [
      {
        name: 'Bodyweight Squat',
        sets: 3,
        reps: '12',
        rest: 60
      },
      {
        name: 'Push-Up',
        sets: 3,
        reps: '8–12',
        rest: 60
      },
      {
        name: 'Glute Bridge',
        sets: 3,
        reps: '12',
        rest: 45
      },
      {
        name: 'Dead Bug',
        sets: 3,
        reps: '10 per side',
        rest: 30
      },
      {
        name: 'March or Walk',
        sets: 1,
        reps: '5 minutes',
        rest: 0
      }
    ]
  };

  function getHistory() {
    const api = window.JVFitTrainingInsights;

    if (!api || typeof api.analyze !== 'function') {
      return {
        weeklyWorkouts: 0,
        weeklyMinutes: 0
      };
    }

    try {
      return api.analyze();
    } catch {
      return {
        weeklyWorkouts: 0,
        weeklyMinutes: 0
      };
    }
  }

  function generate(options = {}) {
    const allowed = ['core', 'conditioning', 'fullBody'];
    const goal = allowed.includes(options.goal)
      ? options.goal
      : 'fullBody';

    const levels = ['beginner', 'intermediate', 'advanced'];
    const level = levels.includes(options.level)
      ? options.level
      : 'beginner';

    const history = getHistory();

    const multiplier = {
      beginner: 0.75,
      intermediate: 1,
      advanced: 1.25
    }[level];

    const exercises = workouts[goal].map(item => ({
      ...item,
      sets: Math.max(
        1,
        Math.round(item.sets * multiplier)
      )
    }));

    let guidance =
      'Start with a comfortable effort and prioritize technique.';

    if (history.weeklyWorkouts >= 4) {
      guidance =
        'You have logged several workouts this week. ' +
        'Consider an easier session if you feel fatigued.';
    }

    return {
      goal,
      level,
      title: {
        core: 'Core Strength Workout',
        conditioning: 'Conditioning Workout',
        fullBody: 'Full-Body Strength & Conditioning'
      }[goal],
      exercises,
      history,
      guidance,
      disclaimer:
        'Template-based workout guidance, not a medical ' +
        'assessment or a measurement of recovery.'
    };
  }

  window.JVFitAdaptivePlanner = {
    generate
  };
})();
