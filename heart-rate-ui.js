
/* JV FIT AI — Heart Rate Import UI */
(() => {
  'use strict';

  function setup() {
    if (document.getElementById('jv-hr-import')) return;

    const section = document.createElement('section');
    section.id = 'jv-hr-import';
    section.style.cssText = `
      margin: 16px 0;
      padding: 16px;
      border: 1px solid #ff7a30;
      border-radius: 14px;
    `;

    section.innerHTML = `
      <h3>❤️ Apple Health Sync</h3>
      <p>Import heart-rate readings from your iPhone.</p>
      <button type="button" id="jv-hr-button">
        Import Apple Health Data
      </button>
      <input id="jv-hr-file" type="file"
        accept=".txt,text/plain" hidden>
      <p id="jv-hr-status" role="status"></p>
    `;

    const target =
      document.querySelector('main') || document.body;
    target.appendChild(section);

    const button = section.querySelector('#jv-hr-button');
    const fileInput = section.querySelector('#jv-hr-file');
    const status = section.querySelector('#jv-hr-status');

    button.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      try {
        if (!window.JVFitHeartRate?.importText) {
          throw new Error('Heart-rate engine unavailable.');
        }

        const content = await file.text();
        const result =
          window.JVFitHeartRate.importText(content);

        status.textContent =
          `Import complete: ${result.added} new readings. ` +
          `${result.total} readings stored.`;
      } catch (error) {
        status.textContent =
          `Import failed: ${error.message}`;
      }

      fileInput.value = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
