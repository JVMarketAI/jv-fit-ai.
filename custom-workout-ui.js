
/* JV FIT AI V5 — Custom Workout Editor */
(() => {
  'use strict';

  function start() {
    if (document.getElementById('jv-custom-editor')) return;

    const api = window.JVFitCustomBuilder;
    const section = document.createElement('section');
    section.id = 'jv-custom-editor';
    section.style.cssText = `
      margin:18px 0 120px;
      padding:18px;
      border:1px solid #f4511e;
      border-radius:16px;
      background:white;
      color:#222;
      font-family:inherit;
      box-sizing:border-box;
      max-width:100%;
    `;

    section.innerHTML = `
      <h2>🛠️ JV FIT AI Custom Workout Editor</h2>
      <p>Create and save your own workout routines.</p>

      <label for="jv-plan-name">Workout name</label>
      <input id="jv-plan-name" type="text"
        placeholder="My Strength Workout"
        style="width:100%;box-sizing:border-box;
        padding:12px;margin:8px 0 16px;
        border:1px solid #ccc;border-radius:10px">

      <div id="jv-exercise-list"></div>

      <button id="jv-add-exercise" type="button">
        ➕ Add Exercise
      </button>

      <button id="jv-save-plan" type="button">
        💾 Save Workout Plan
      </button>

      <h3>📋 Saved Workout Plans</h3>
      <div id="jv-saved-plans"></div>
      <p id="jv-editor-status" role="status"></p>
    `;

    section.querySelectorAll('button').forEach(button => {
      button.style.cssText = `
        padding:12px;
        margin:6px 6px 6px 0;
        border:0;
        border-radius:10px;
        background:#f4511e;
        color:white;
        font-weight:bold;
      `;
    });

    (document.querySelector('main') || document.body)
      .appendChild(section);

    const list = section.querySelector('#jv-exercise-list');
    const saved = section.querySelector('#jv-saved-plans');
    const nameInput = section.querySelector('#jv-plan-name');
    const status = section.querySelector('#jv-editor-status');

    if (!api) {
      status.textContent = 'Custom workout engine unavailable.';
      return;
    }

    let current = api.newPlan();

    section.querySelector('#jv-new-workout')
      .addEventListener('click', () => {
        if (current.exercises.length &&
            !confirm(
              'Start a new workout? Unsaved changes will be lost.'
            )) {
          return;
        }

        current = api.newPlan();
        nameInput.value = current.name;
        renderExercises();

        status.textContent =
          'New workout ready. Your saved plans are safe.';
      });

    function field(label, value, onChange, type = 'text') {
      const wrapper = document.createElement('label');
      wrapper.style.cssText = `
        display:block;margin:8px 0;
      `;

      const text = document.createElement('span');
      text.textContent = label;
      text.style.display = 'block';

      const input = document.createElement('input');
      input.type = type;
      input.value = value;
      input.style.cssText = `
        width:100%;box-sizing:border-box;
        padding:10px;border:1px solid #ccc;
        border-radius:8px;font-size:16px;
      `;

      input.addEventListener('change', () => {
        onChange(input.value);
      });

      wrapper.append(text, input);
      return wrapper;
    }

    function renderExercises() {
      list.replaceChildren();

      current.exercises.forEach(exercise => {
        const card = document.createElement('div');
        card.style.cssText = `
          padding:14px;margin:12px 0;
          background:#fff4ee;border-radius:12px;
        `;

        const update = changes => {
          api.updateExercise(current, exercise.id, changes);
        };

        card.append(
          field('Exercise', exercise.name,
            value => update({name:value})),
          field('Sets', exercise.sets,
            value => update({sets:value}), 'number'),
          field('Reps or duration', exercise.reps,
            value => update({reps:value})),
          field('Rest (seconds)', exercise.rest,
            value => update({rest:value}), 'number')
        );

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = '🗑️ Remove Exercise';
        remove.addEventListener('click', () => {
          api.removeExercise(current, exercise.id);
          renderExercises();
        });

        card.appendChild(remove);
        list.appendChild(card);
      });
    }

    function renderSaved() {
      saved.replaceChildren();

      api.loadPlans().forEach(plan => {
        const row = document.createElement('div');
        row.style.cssText = `
          padding:12px;margin:8px 0;
          background:#f5f5f5;border-radius:10px;
        `;

        const title = document.createElement('strong');
        title.textContent = plan.name;

        const open = document.createElement('button');
        open.type = 'button';
        open.textContent = '✏️ Edit';
        open.addEventListener('click', () => {
          current = JSON.parse(JSON.stringify(plan));
          nameInput.value = current.name;
          renderExercises();
          status.textContent = 'Plan loaded for editing.';
        });

        const del = document.createElement('button');
        del.type = 'button';
        del.textContent = 'Delete';
        del.addEventListener('click', () => {
          if (!confirm('Delete this saved plan?')) return;

          if (api.deletePlan(plan.id)) {
            status.textContent = 'Plan deleted.';
            renderSaved();
          } else {
            status.textContent = 'Unable to delete plan.';
          }
        });

        row.append(title, open, del);
        saved.appendChild(row);
      });
    }

    section.querySelector('#jv-add-exercise')
      .addEventListener('click', () => {
        api.addExercise(current, {
          name:'New Exercise',
          sets:3,
          reps:'10',
          rest:60
        });
        renderExercises();
      });

    section.querySelector('#jv-save-plan')
      .addEventListener('click', () => {
        current.name = nameInput.value.trim() ||
          'My Workout';

        if (!current.exercises.length) {
          status.textContent = 'Add an exercise first.';
          return;
        }

        if (api.savePlan(current)) {
          status.textContent = 'Workout plan saved!';
          renderSaved();
        } else {
          status.textContent = 'Unable to save workout plan.';
        }
      });

    nameInput.value = current.name;
    renderExercises();
    renderSaved();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
