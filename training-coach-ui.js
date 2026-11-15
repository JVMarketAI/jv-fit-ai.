
/* JV FIT AI V5 — Smart Training Coach Dashboard */
(() => {
  'use strict';

  function createDashboard() {
    if (document.getElementById('jv-training-coach')) return;

    const section = document.createElement('section');
    section.id = 'jv-training-coach';

    section.style.cssText = `
      margin: 18px 0 120px;
      padding: 18px;
      border: 1px solid #ff632e;
      border-radius: 16px;
      background: #fff;
      color: #222;
      font-family: inherit;
    `;

    section.innerHTML = `
      <h2>🧠 JV FIT AI Smart Training Coach</h2>
      <p style="color:#666">
        Personalized training insights
      </p>

      <div id="jv-coach-stats"
           style="display:grid;
                  grid-template-columns:1fr 1fr;
                  gap:12px;
                  margin:16px 0">
      </div>

      <h3>🎯 Your Training Goals</h3>
      <p>💪 Core Strength</p>
      <p>🔥 Conditioning</p>

      <h3>🏋️ Recommended Training</h3>
      <div id="jv-coach-recommendations"></div>

      <button id="jv-coach-refresh"
              type="button"
              style="padding:12px 18px;
                     border:0;
                     border-radius:10px;
                     background:#f4511e;
                     color:white;
                     font-weight:bold;
                     margin-top:14px">
        🔄 Refresh Training Plan
      </button>
    `;

    const target =
      document.querySelector('main') || document.body;

    target.appendChild(section);

    function refresh() {
      const api = window.JVFitTrainingInsights;
      const statsBox =
        document.getElementById('jv-coach-stats');
      const recommendationsBox =
        document.getElementById('jv-coach-recommendations');

      if (!api ||
          typeof api.getRecommendations !== 'function') {
        statsBox.textContent =
          'Training insights engine unavailable.';
        recommendationsBox.textContent = '';
        return;
      }

      try {
        const result = api.getRecommendations();
        const stats = result.stats;

        statsBox.replaceChildren();

        [
          ['Weekly workouts', stats.weeklyWorkouts],
          ['Training minutes', stats.weeklyMinutes]
        ].forEach(([label, value]) => {
          const card = document.createElement('div');

          card.style.cssText = `
            padding:14px;
            background:#f6f6f6;
            border-radius:12px;
          `;

          const number = document.createElement('strong');
          number.textContent = String(value);
          number.style.fontSize = '28px';

          const description = document.createElement('p');
          description.textContent = label;
          description.style.margin = '6px 0 0';

          card.append(number, description);
          statsBox.appendChild(card);
        });

        recommendationsBox.replaceChildren();

        result.suggestions.forEach(suggestion => {
          const item = document.createElement('p');
          item.textContent = '✓ ' + suggestion;
          item.style.cssText = `
            padding:12px;
            margin:8px 0;
            background:#fff4ee;
            border-radius:10px;
            line-height:1.5;
          `;

          recommendationsBox.appendChild(item);
        });
      } catch (error) {
        statsBox.textContent =
          'Unable to load training insights.';
        recommendationsBox.textContent = '';
        console.error('JV FIT AI Coach:', error);
      }
    }

    document
      .getElementById('jv-coach-refresh')
      .addEventListener('click', refresh);

    window.addEventListener('focus', refresh);

    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      createDashboard
    );
  } else {
    createDashboard();
  }
})();
