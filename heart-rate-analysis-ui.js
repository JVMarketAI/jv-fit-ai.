
/* JV FIT AI V5 — Smart Heart Rate Analysis UI */
(() => {
  'use strict';

  function start() {
    if (document.getElementById('jv-hr-analysis')) return;

    const section = document.createElement('section');
    section.id = 'jv-hr-analysis';
    section.style.cssText = `
      margin: 18px 0 120px;
      padding: 18px;
      border: 1px solid #ff7a30;
      border-radius: 16px;
      background: #fff;
      color: #222;
    `;

    const title = document.createElement('h2');
    title.textContent = '❤️ Smart Heart Rate Analysis';

    const status = document.createElement('p');
    const heartStats = document.createElement('p');
    const workoutStats = document.createElement('p');
    const guidance = document.createElement('p');

    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.textContent = 'Refresh Analysis';

    section.append(
      title, status, heartStats,
      workoutStats, guidance, refresh
    );

    const target =
      document.querySelector('main') || document.body;
    target.appendChild(section);

    function render() {
      const api = window.JVFitHeartAnalysis;

      if (!api) {
        status.textContent =
          'Heart-rate analysis engine unavailable.';
        return;
      }

      try {
        const heart = api.analyzeHeartRate();
        const workouts = api.analyzeWorkoutHistory();
        const advice = api.recommendations();

        status.textContent = `Status: ${advice.status}`;

        heartStats.textContent = heart.count
          ? `${heart.count} readings | ` +
            `Average: ${heart.averageBpm} BPM | ` +
            `Min: ${heart.minimumBpm} | ` +
            `Max: ${heart.maximumBpm}`
          : 'No heart-rate readings imported.';

        workoutStats.textContent =
          `Workout history: ${workouts.totalWorkouts} sessions | ` +
          `${workouts.totalMinutes} total minutes`;

        guidance.textContent = advice.message;
      } catch (error) {
        status.textContent = 'Unable to analyze data.';
        heartStats.textContent = '';
        workoutStats.textContent = '';
        guidance.textContent = '';
        console.error('JV FIT AI analysis error:', error);
      }
    }

    refresh.addEventListener('click', render);
    window.addEventListener('focus', render);

    const importButton =
      document.getElementById('jv-hr-file');

    if (importButton) {
      importButton.addEventListener('change', () => {
        setTimeout(render, 100);
      });
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
