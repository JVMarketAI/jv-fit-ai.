
/* JV FIT AI V4 — Smart Goals Dashboard */
(() => {
  'use strict';

  const KEY = 'jvfit_personal_v1';
  const $ = id => document.getElementById(id);

  const css = document.createElement('style');
  css.textContent = `
    #jv-goals-open {
      width:100%;margin:12px 0;padding:15px;
      background:#fc4c02;color:white;border:0;
      border-radius:13px;font-size:16px;
      font-weight:750;cursor:pointer;
    }
    #jv-goals-panel {
      position:fixed;inset:0;z-index:10001;
      background:#f6f6f4;color:#202124;
      overflow-y:auto;padding:25px 17px 110px;
      font-family:-apple-system,BlinkMacSystemFont,
      'Segoe UI',sans-serif;
    }
    #jv-goals-panel[hidden]{display:none}
    #jv-goals-panel .jv-inner{
      max-width:680px;margin:auto;
    }
    #jv-goals-panel .jv-card{
      background:white;border:1px solid #e7e7e5;
      border-radius:16px;padding:17px;
      margin:12px 0;
    }
    #jv-goals-panel .jv-track{
      height:9px;background:#eee;
      border-radius:20px;overflow:hidden;
      margin:12px 0 6px;
    }
    #jv-goals-panel .jv-fill{
      height:100%;background:#fc4c02;
      border-radius:20px;
    }
    #jv-goals-panel .jv-muted{
      color:#687078;font-size:13px;
    }
    #jv-goals-close{
      background:#202124;color:white;
      border:0;border-radius:11px;
      padding:12px 17px;font-size:15px;
    }
  `;
  document.head.appendChild(css);

  const button = document.createElement('button');
  button.id = 'jv-goals-open';
  button.textContent = '🎯 V4 Smart Workout Goals';

  const panel = document.createElement('section');
  panel.id = 'jv-goals-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="jv-inner">
      <button id="jv-goals-close" type="button">
        ← Back to JV FIT AI
      </button>
      <h2>🎯 Smart Workout Goals</h2>
      <p class="jv-muted">
        Personalized weekly targets based on
        your last 28 days of workouts.
      </p>
      <div id="jv-goals-content"></div>
      <p class="jv-muted">
        Targets are suggestions, not medical advice.
        Your workout records are never modified.
      </p>
    </div>
  `;

  function workouts() {
    try {
      const data = JSON.parse(
        localStorage.getItem(KEY) || '[]'
      );
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function weeklyProgress() {
    const monday = new Date();
    monday.setHours(0, 0, 0, 0);
    monday.setDate(
      monday.getDate() - (monday.getDay() + 6) % 7
    );

    const week = workouts().filter(w => {
      const date = new Date(w.date + 'T12:00:00');
      return Number.isFinite(date.getTime()) &&
        date >= monday && date <= new Date();
    });

    return {
      workouts: week.length,
      activeMinutes: week.reduce(
        (sum, w) => sum + (Number(w.duration) || 0), 0
      ),
      runningMiles: week
        .filter(w =>
          ['Running', 'Walking'].includes(w.type))
        .reduce(
          (sum, w) => sum + (Number(w.distance) || 0), 0
        ),
      strengthSessions: week.filter(
        w => w.type === 'Strength'
      ).length
    };
  }

  function renderGoals() {
    const target =
      window.JVFitAdaptive?.recommendations();

    const content = $('jv-goals-content');

    if (!target) {
      content.textContent =
        'Adaptive engine unavailable. Check adaptive-goals.js.';
      return;
    }

    const current = weeklyProgress();

    const items = [
      ['Workouts', 'workouts', 'sessions'],
      ['Active minutes', 'activeMinutes', 'min'],
      ['Running + walking', 'runningMiles', 'mi'],
      ['Strength sessions', 'strengthSessions', 'sessions']
    ];

    content.replaceChildren();

    const status = document.createElement('p');
    status.className = 'jv-muted';
    status.textContent = target.message;
    content.appendChild(status);

    items.forEach(([name, key, unit]) => {
      const goal = Number(target.goals[key]) || 1;
      const done = Math.max(0, Number(current[key]) || 0);
      const percent = Math.min(100, done / goal * 100);

      const card = document.createElement('div');
      card.className = 'jv-card';

      const heading = document.createElement('h3');
      heading.textContent = name;

      const detail = document.createElement('p');
      detail.textContent =
        `${Number(done.toFixed(2))} / ${goal} ${unit}`;

      const track = document.createElement('div');
      track.className = 'jv-track';

      const fill = document.createElement('div');
      fill.className = 'jv-fill';
      fill.style.width = percent + '%';

      track.appendChild(fill);
      card.append(heading, detail, track);
      content.appendChild(card);
    });
  }

  function init() {
    const home = $('home');
    if (!home || $('jv-goals-open')) return;

    home.appendChild(button);
    document.body.appendChild(panel);

    button.addEventListener('click', () => {
      renderGoals();
      panel.hidden = false;
      window.scrollTo(0, 0);
    });

    $('jv-goals-close').addEventListener('click', () => {
      panel.hidden = true;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
