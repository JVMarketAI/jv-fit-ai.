
/* JV FIT AI — Heart Rate Dashboard V1 */
(() => {
  'use strict';

  function createDashboard() {
    if (document.getElementById('jv-hr-dashboard')) return;

    const section = document.createElement('section');
    section.id = 'jv-hr-dashboard';
    section.style.cssText = `
      margin: 18px 0;
      padding: 18px;
      border: 1px solid #ff7a30;
      border-radius: 16px;
      background: #fff;
      color: #222;
    `;

    section.innerHTML = `
      <h2>❤️ Heart Rate Dashboard</h2>
      <p id="jv-hr-summary">Loading readings...</p>
      <div id="jv-hr-chart" style="
        display:flex;
        align-items:end;
        gap:5px;
        height:150px;
        padding:12px 0;
        border-bottom:1px solid #ddd;
      "></div>
      <div id="jv-hr-list"></div>
      <button type="button" id="jv-hr-refresh">
        Refresh Heart Rate
      </button>
    `;

    const target =
      document.querySelector('main') || document.body;
    target.appendChild(section);

    function render() {
      const api = window.JVFitHeartRate;

      if (!api?.getSaved) {
        section.querySelector('#jv-hr-summary').textContent =
          'Heart-rate engine unavailable.';
        return;
      }

      const readings = api.getSaved()
        .filter(r =>
          r &&
          Number.isFinite(Number(r.bpm)) &&
          Number(r.bpm) > 0 &&
          Number.isFinite(new Date(r.date).getTime())
        )
        .sort((a,b) =>
          new Date(a.date) - new Date(b.date)
        );

      const summary = section.querySelector('#jv-hr-summary');
      const chart = section.querySelector('#jv-hr-chart');
      const list = section.querySelector('#jv-hr-list');

      chart.replaceChildren();
      list.replaceChildren();

      if (!readings.length) {
        summary.textContent =
          'No readings yet. Import your Apple Health file.';
        return;
      }

      const values = readings.map(r => Number(r.bpm));
      const average = Math.round(
        values.reduce((a,b) => a+b, 0) / values.length
      );
      const min = Math.min(...values);
      const max = Math.max(...values);

      summary.textContent =
        `${readings.length} readings | ` +
        `Average: ${average} BPM | ` +
        `Min: ${min} | Max: ${max}`;

      const recent = readings.slice(-30);
      const maxChart = Math.max(100, ...recent.map(r => Number(r.bpm)));

      for (const reading of recent) {
        const bar = document.createElement('div');
        bar.style.cssText = `
          flex:1;
          min-width:3px;
          height:${Math.max(3, Number(reading.bpm)/maxChart*100)}%;
          background:#f4511e;
          border-radius:4px 4px 0 0;
        `;
        bar.title =
          `${reading.bpm} BPM — ${new Date(reading.date).toLocaleString()}`;
        chart.appendChild(bar);
      }

      const heading = document.createElement('h3');
      heading.textContent = 'Recent readings';
      list.appendChild(heading);

      for (const reading of readings.slice(-10).reverse()) {
        const item = document.createElement('p');
        item.textContent =
          `${new Date(reading.date).toLocaleString()} — ` +
          `${reading.bpm} BPM`;
        list.appendChild(item);
      }
    }

    section.querySelector('#jv-hr-refresh')
      .addEventListener('click', render);

    render();
    window.addEventListener('focus', render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDashboard);
  } else {
    createDashboard();
  }
})();
