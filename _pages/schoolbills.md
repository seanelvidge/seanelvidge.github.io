---
layout: page
permalink: /schoolbills
title: Function for creating the School Bills
nav: false
tags: mathematics 
---

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Monthly School Bills Calculator</title>
  <style>
    :root {
      --bg: #0b1020;
      --card: #0f172a;
      --muted: #94a3b8;
      --text: #e2e8f0;
      --accent: #60a5fa;
      --border: #1f2a44;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      background: radial-gradient(1200px 600px at 10% -10%, #11193a55, transparent), var(--bg);
      color: var(--text); line-height: 1.4;
      display: grid; place-items: start center; min-height: 100svh; padding: 24px;
    }
    .wrap { width: min(1000px, 100%); }
    header {
      display: grid; gap: 16px; grid-template-columns: 1fr;
      margin-bottom: 16px;
    }
    .title { font-size: clamp(1.25rem, 2.2vw + 0.6rem, 2rem); font-weight: 700; }
    .controls { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; }
    @media (max-width: 640px) { .controls { grid-template-columns: 1fr; } }
    .card {
      background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
      border: 1px solid var(--border);
      border-radius: 16px; padding: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    }
    label { display: block; font-size: 0.9rem; color: var(--muted); margin-bottom: 6px; }
    input[type="month"], input[type="number"], input[type="checkbox"] {
      width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border); background: #0b122a; color: var(--text);
    }
    .grid { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    .totals { display: grid; gap: 12px; grid-template-columns: repeat(4, 1fr); }
    @media (max-width: 900px) { .totals { grid-template-columns: 1fr 1fr; } }
    .pill { background: #0c1933; border: 1px solid var(--border); padding: 12px; border-radius: 12px; }
    .pill h3 { margin: 0 0 6px; font-size: 0.95rem; color: var(--muted); font-weight: 600; }
    .pill .val { font-size: 1.25rem; font-weight: 700; }
    .grand { font-size: clamp(1.4rem, 2.2vw + 0.8rem, 2rem); font-weight: 800; }
    .muted { color: var(--muted); }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 0; border-bottom: 1px dashed var(--border); }
    th { color: var(--muted); font-weight: 600; }
    .hint { font-size: 0.85rem; color: var(--muted); margin-top: 6px; }
    .row { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; }
    .switch { display: inline-flex; align-items: center; gap: 8px; }
    .accent { color: var(--accent); }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="card">
      <div class="title">Monthly School Bills Calculator</div>
      <div class="controls">
        <div>
          <label for="monthInput">Select month</label>
          <input id="monthInput" type="month" />
          <div class="hint">Calculates for weekdays only (Mon–Fri) in the chosen calendar month.</div>
        </div>
        <div>
          <label for="children">Number of children</label>
          <input id="children" type="number" min="1" step="1" value="2" />
          <div class="hint">Default is 2. Adjust if needed.</div>
        </div>
      </div>
      <div class="row">
        <div class="switch">
          <input id="showBreakdown" type="checkbox" checked />
          <label for="showBreakdown">Show weekday counts</label>
        </div>
        <div class="muted">Breakfast: Mon, Tue, Wed, Fri (£4.50/child/day) · After school: Mon, Thu, Fri (£5.00/child/day) · Lunch: every weekday (£2.70/child/day)</div>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <h2 class="muted" style="margin-top:0">Totals</h2>
        <div class="totals" style="margin-bottom: 12px;">
          <div class="pill">
            <h3>Breakfast club</h3>
            <div class="val" id="breakfastTotal">£0.00</div>
          </div>
          <div class="pill">
            <h3>After school club</h3>
            <div class="val" id="afterTotal">£0.00</div>
          </div>
          <div class="pill">
            <h3>Lunches</h3>
            <div class="val" id="lunchTotal">£0.00</div>
          </div>
          <div class="pill">
            <h3>Per child</h3>
            <div class="val" id="perChild">£0.00</div>
          </div>
        </div>
        <div class="grand">Grand total: <span class="accent" id="grandTotal">£0.00</span></div>
        <div class="hint">All amounts in GBP.</div>
      </div>

      <div class="card">
        <h2 class="muted" style="margin-top:0">Per child breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Child</th>
              <th>Clubs (Breakfast+After)</th>
              <th>Lunches</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody id="perChildBreakdown"></tbody>
        </table>
        <div class="hint">Each child uses the same schedule. "Clubs" combines breakfast and after-school totals.</div>
      </div>
    </section>

    <footer class="muted" style="margin-top:16px; text-align:center;">
      Built for quick monthly estimates. Update the month (and number of children if needed) to recalc instantly.
    </footer>
  </div>

  <script>
    const PRICES = {
      breakfastPerChildPerDay: 4.50,
      afterPerChildPerDay: 5.00,
      lunchPerChildPerDay: 2.70,
    };

    const fmtGBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

    const monthInput = document.getElementById('monthInput');
    const childrenInput = document.getElementById('children');

    const els = {
      breakfastTotal: document.getElementById('breakfastTotal'),
      afterTotal: document.getElementById('afterTotal'),
      lunchTotal: document.getElementById('lunchTotal'),
      perChild: document.getElementById('perChild'),
      grandTotal: document.getElementById('grandTotal'),
      perChildBreakdown: document.getElementById('perChildBreakdown')
    };

    function getMonthParts(value) {
      if (!value) return null;
      const [y, m] = value.split('-').map(Number);
      return { year: y, monthIndex: m - 1 };
    }

    function daysInMonth(year, monthIndex) {
      return new Date(year, monthIndex + 1, 0).getDate();
    }

    function countWeekdayInMonth(year, monthIndex, weekday) {
      let count = 0;
      const nDays = daysInMonth(year, monthIndex);
      for (let d = 1; d <= nDays; d++) {
        const gd = new Date(year, monthIndex, d).getDay();
        if (gd === weekday) count++;
      }
      return count;
    }

    function compute() {
      const parts = getMonthParts(monthInput.value);
      const nChildren = Math.max(1, Math.floor(Number(childrenInput.value || 2)));
      if (!parts) return;

      const { year, monthIndex } = parts;
      const monday = countWeekdayInMonth(year, monthIndex, 1);
      const tuesday = countWeekdayInMonth(year, monthIndex, 2);
      const wednesday = countWeekdayInMonth(year, monthIndex, 3);
      const thursday = countWeekdayInMonth(year, monthIndex, 4);
      const friday = countWeekdayInMonth(year, monthIndex, 5);
      const weekdayTotal = monday + tuesday + wednesday + thursday + friday;

      const breakfastDays = monday + tuesday + wednesday + friday;
      const afterDays = monday + thursday + friday;
      const lunchDays = weekdayTotal;

      const breakfastTotal = PRICES.breakfastPerChildPerDay * breakfastDays * nChildren;
      const afterTotal = PRICES.afterPerChildPerDay * afterDays * nChildren;
      const lunchTotal = PRICES.lunchPerChildPerDay * lunchDays * nChildren;
      const grandTotal = breakfastTotal + afterTotal + lunchTotal;
      const perChild = grandTotal / nChildren;

      els.breakfastTotal.textContent = fmtGBP.format(breakfastTotal);
      els.afterTotal.textContent = fmtGBP.format(afterTotal);
      els.lunchTotal.textContent = fmtGBP.format(lunchTotal);
      els.perChild.textContent = fmtGBP.format(perChild);
      els.grandTotal.textContent = fmtGBP.format(grandTotal);

      // Per child breakdown
      const clubPerChild = (PRICES.breakfastPerChildPerDay * breakfastDays) + (PRICES.afterPerChildPerDay * afterDays);
      const lunchPerChild = PRICES.lunchPerChildPerDay * lunchDays;
      const totalPerChild = clubPerChild + lunchPerChild;

      const rows = [];
      for (let i = 1; i <= nChildren; i++) {
        rows.push(`<tr>
          <td>Child ${i}</td>
          <td>${fmtGBP.format(clubPerChild)}</td>
          <td>${fmtGBP.format(lunchPerChild)}</td>
          <td>${fmtGBP.format(totalPerChild)}</td>
        </tr>`);
      }
      els.perChildBreakdown.innerHTML = rows.join("\n");
    }

    (function init() {
      const now = new Date();
      const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
      monthInput.value = ym;
      [monthInput, childrenInput].forEach(el => el.addEventListener('input', compute));
      compute();
    })();
  </script>
</body>
</html>
