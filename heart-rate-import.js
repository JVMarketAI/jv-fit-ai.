
/* JV FIT AI — Apple Health Heart Rate Import V1 */
(() => {
  "use strict";

  const KEY = "jvfit_heart_rate_v1";

  function parse(text) {
    const pattern = /Date:\s*([^\r\n]+)\s+BPM:\s*(\d+(?:\.\d+)?)/gi;
    const records = [];
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const date = new Date(match[1].trim());
      const bpm = Number(match[2]);

      if (
        !Number.isNaN(date.getTime()) &&
        Number.isFinite(bpm) &&
        bpm >= 20 &&
        bpm <= 300
      ) {
        records.push({
          date: date.toISOString(),
          bpm
        });
      }
    }

    return records;
  }

  function getSaved() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function importText(text) {
    const incoming = parse(text);

    if (!incoming.length) {
      return { added: 0, total: getSaved().length };
    }

    const unique = new Map();

    for (const record of [...getSaved(), ...incoming]) {
      if (
        record &&
        typeof record.date === "string" &&
        Number.isFinite(record.bpm)
      ) {
        unique.set(`${record.date}|${record.bpm}`, record);
      }
    }

    const saved = [...unique.values()].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    localStorage.setItem(KEY, JSON.stringify(saved));

    return {
      added: saved.length - getSavedBeforeCount,
      total: saved.length
    };
  }

  // Keep imported heart-rate records separate from workouts.
  function safeImport(text) {
    const before = getSaved().length;
    const incoming = parse(text);
    const unique = new Map();

    for (const record of [...getSaved(), ...incoming]) {
      if (record && typeof record.date === "string" &&
          Number.isFinite(record.bpm)) {
        unique.set(`${record.date}|${record.bpm}`, record);
      }
    }

    const saved = [...unique.values()].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    if (incoming.length) {
      localStorage.setItem(KEY, JSON.stringify(saved));
    }

    return {
      found: incoming.length,
      added: saved.length - before,
      total: saved.length
    };
  }

  window.JVFitHeartRate = {
    parse,
    importText: safeImport,
    getSaved
  };
})();
