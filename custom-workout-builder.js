
/* JV FIT AI V5 — Custom Workout Builder */
(() => {
  'use strict';

  const STORAGE_KEY = 'jvfit_custom_plans_v1';

  function loadPlans() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function savePlans(plans) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(plans)
      );
      return true;
    } catch {
      return false;
    }
  }

  function newPlan(name = 'My Workout') {
    return {
      id: 'plan-' + Date.now() + '-' +
        Math.random().toString(36).slice(2, 8),
      name: String(name).trim() || 'My Workout',
      createdAt: new Date().toISOString(),
      exercises: []
    };
  }

  function addExercise(plan, exercise = {}) {
    if (!plan || !Array.isArray(plan.exercises)) {
      return null;
    }

    const item = {
      id: 'exercise-' + Date.now() + '-' +
        Math.random().toString(36).slice(2, 8),
      name: String(exercise.name || 'New Exercise'),
      sets: Math.max(
        1, Math.round(Number(exercise.sets) || 3)
      ),
      reps: String(exercise.reps || '10'),
      rest: Math.max(
        0, Math.round(Number(exercise.rest) || 0)
      )
    };

    plan.exercises.push(item);
    return item;
  }

  function updateExercise(plan, id, changes = {}) {
    if (!plan || !Array.isArray(plan.exercises)) {
      return false;
    }

    const item = plan.exercises.find(e => e.id === id);
    if (!item) return false;

    if (changes.name !== undefined) {
      item.name = String(changes.name).trim() ||
        'New Exercise';
    }

    if (changes.sets !== undefined) {
      const sets = Number(changes.sets);
      if (Number.isFinite(sets)) {
        item.sets = Math.max(1, Math.round(sets));
      }
    }

    if (changes.reps !== undefined) {
      item.reps = String(changes.reps);
    }

    if (changes.rest !== undefined) {
      const rest = Number(changes.rest);
      if (Number.isFinite(rest)) {
        item.rest = Math.max(0, Math.round(rest));
      }
    }

    return true;
  }

  function removeExercise(plan, id) {
    if (!plan || !Array.isArray(plan.exercises)) {
      return false;
    }

    const index = plan.exercises.findIndex(
      e => e.id === id
    );

    if (index < 0) return false;
    plan.exercises.splice(index, 1);
    return true;
  }

  function savePlan(plan) {
    if (!plan || !plan.id ||
        !Array.isArray(plan.exercises)) {
      return false;
    }

    const plans = loadPlans();
    const index = plans.findIndex(
      p => p.id === plan.id
    );

    const copy = JSON.parse(JSON.stringify(plan));

    if (index >= 0) {
      plans[index] = copy;
    } else {
      plans.push(copy);
    }

    return savePlans(plans);
  }

  function deletePlan(id) {
    const plans = loadPlans();
    const updated = plans.filter(p => p.id !== id);

    if (updated.length === plans.length) {
      return false;
    }

    return savePlans(updated);
  }

  window.JVFitCustomBuilder = {
    newPlan,
    addExercise,
    updateExercise,
    removeExercise,
    savePlan,
    loadPlans,
    deletePlan
  };
})();
