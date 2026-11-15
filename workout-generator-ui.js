
/* JV FIT AI V5 — Interactive Workout Generator */
(() => {
  'use strict';

  function start() {
    if (document.getElementById('jv-workout-generator')) {
      return;
    }

    const section = document.createElement('section');
    section.id = 'jv-workout-generator';

    section.style.cssText = `
      margin: 18px 0 120px;
      padding: 18px;
      border: 1px solid #f4511e;
      border-radius: 16px;
      background: white;
      color: #222;
      font-family: inherit;
    `;

    section.innerHTML = `
      <h2>🏋️ JV FIT AI Workout Generator</h2>
      <p>Build a workout for your training goals.</p>

      <label for="jv-workout-goal">
        <strong>🎯 Workout Goal</strong>
      </label>
      <select id="jv-workout-goal"
        style="display:block;width:100%;padding:12px;
        margin:10px 0 18px;border-radius:10px">
        <option value="core">Core Strength</option>
        <option value="conditioning">Conditioning</option>
        <option value="fullBody">Full Body</option>
      </select>

      <label for="jv-workout-level">
        <strong>💪 Fitness Level</strong>
      </label>
      <select id="jv-workout-level"
        style="display:block;width:100%;padding:12px;
        margin:10px 0 18px;border-radius:10px">
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <button id="jv-generate-workout"
        type="button"
        style="width:100%;padding:14px;border:0;
        border-radius:12px;background:#f4511e;
        color:white;font-weight:bold">
        ⚡ Generate My Workout
      </button>

      <div id="jv-generated-workout"
        aria-live="polite"
        style="margin-top:20px"></div>
    `;

    const target =
      document.querySelector('main') || document.body;

    target.appendChild(section);

    const goalSelect =
      section.querySelector('#jv-workout-goal');
    const levelSelect =
      section.querySelector('#jv-workout-level');
    const output =
      section.querySelector('#jv-generated-workout');

    section.querySelector('#jv-generate-workout')
      .addEventListener('click', () => {
        const planner = window.JVFitAdaptivePlanner;

        if (!planner ||
            typeof planner.generate !== 'function') {
          output.textContent =
            'Workout planner is unavailable.';
          return;
        }

        try {
          const plan = planner.generate({
            goal: goalSelect.value,
            level: levelSelect.value
          });

          output.replaceChildren();

          const title = document.createElement('h3');
          title.textContent = plan.title;
          output.appendChild(title);

          const level = document.createElement('p');
          level.textContent =
            'Level: ' + plan.level;
          output.appendChild(level);

          plan.exercises.forEach(exercise => {
            const card = document.createElement('div');
            card.style.cssText = `
              background:#fff4ee;
              padding:14px;
              margin:10px 0;
              border-radius:12px;
            `;

            const name = document.createElement('strong');
            name.textContent = exercise.name;

            const details = document.createElement('p');
            details.textContent =
              exercise.sets + ' sets × ' +
              exercise.reps +
              ' | Rest: ' + exercise.rest + ' sec';

            card.append(name, details);
            output.appendChild(card);
          });

          const guidance = document.createElement('p');
          guidance.textContent = plan.guidance;
          output.appendChild(guidance);

          const disclaimer = document.createElement('small');
          disclaimer.textContent = plan.disclaimer;
          output.appendChild(disclaimer);

        } catch (error) {
          output.textContent =
            'Unable to generate workout.';
          console.error('JV FIT AI Planner:', error);
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
