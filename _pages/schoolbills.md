---
layout: page
permalink: /schoolbills
title: School Bills
nav: false
tags: mathematics
---

<html lang="en">
<body>

  <label for="monthInput">Month:</label>
  <input id="monthInput" type="month" />

  <p>Children: George and James. Prices: Breakfast (Mon/Tue/Wed/Fri) £4.50/child/day; After-school (Mon/Thu/Fri) £5.00/child/day; Lunch (Mon–Fri) £2.70/child/day.</p>
  <p>Use the weekday calendar to deselect days for each child (e.g., half-term, trips). Each week has master checkboxes to toggle that week’s column. By default all applicable days are selected.</p>

  <h2>Weekday calendar (Mon–Fri only)</h2>
  <div id="calContainer"></div>

  <h2>Totals</h2>
  <ul>
    <li>Breakfast club: <strong id="breakfastTotal">£0.00</strong></li>
    <li>After school club: <strong id="afterTotal">£0.00</strong></li>
    <li>Lunches: <strong id="lunchTotal">£0.00</strong></li>
    <li>Grand total: <strong id="grandTotal">£0.00</strong></li>
  </ul>

  <h2>Per child breakdown</h2>
  <table border="1" cellpadding="6" cellspacing="0">
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

  <script>
    const PRICES = {
      breakfastPerChildPerDay: 4.50,
      afterPerChildPerDay: 5.00,
      lunchPerChildPerDay: 2.70,
    };

    const CHILDREN = ["George", "James"];
    const fmtGBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

    const monthInput   = document.getElementById('monthInput');
    const calContainer = document.getElementById('calContainer');

    const els = {
      breakfastTotal: document.getElementById('breakfastTotal'),
      afterTotal: document.getElementById('afterTotal'),
      lunchTotal: document.getElementById('lunchTotal'),
      grandTotal: document.getElementById('grandTotal'),
      perChildBreakdown: document.getElementById('perChildBreakdown'),
    };

    function getMonthParts(value) {
      if (!value) return null;
      const [y, m] = value.split('-').map(Number);
      return { year: y, monthIndex: m - 1 };
    }

    function daysInMonth(year, monthIndex) {
      return new Date(year, monthIndex + 1, 0).getDate();
    }

    function listWeekdays(year, monthIndex) {
      const labels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const out = [];
      const nDays = daysInMonth(year, monthIndex);
      for (let d = 1; d <= nDays; d++) {
        const date = new Date(year, monthIndex, d);
        const wd = date.getDay();
        if (wd >= 1 && wd <= 5) {
          // group by ISO week number
          const week = getWeekNumber(date);
          out.push({ date, idx: d, weekday: wd, label: `${labels[wd]} ${d}`, week });
        }
      }
      return out;
    }

    function getWeekNumber(d) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    }

    function rebuildCalendar() {
      const parts = getMonthParts(monthInput.value);
      if (!parts) return;
      const { year, monthIndex } = parts;
      const weekdays = listWeekdays(year, monthIndex);

      // Group by week number
      const grouped = {};
      weekdays.forEach(w => {
        if (!grouped[w.week]) grouped[w.week] = [];
        grouped[w.week].push(w);
      });

      let html = '';
      Object.keys(grouped).forEach(weekNum => {
        const days = grouped[weekNum];
        html += `<h3>Week ${weekNum}</h3>`;
        html += '<table border="1" cellpadding="4" cellspacing="0">';
        html += '<thead><tr><th>Date</th>';
        CHILDREN.forEach((child, ci) => {
          html += `<th>${child} Breakfast <input type="checkbox" data-master="${weekNum}-c${ci}B"></th>`;
          html += `<th>${child} After <input type="checkbox" data-master="${weekNum}-c${ci}A"></th>`;
          html += `<th>${child} Lunch <input type="checkbox" data-master="${weekNum}-c${ci}L"></th>`;
        });
        html += '</tr></thead><tbody>';
        days.forEach(({label, weekday}) => {
          html += '<tr>' + `<td>${label}</td>`;
          CHILDREN.forEach((child, ci) => {
            html += checkboxCell(ci, 'B', weekday, weekNum);
            html += checkboxCell(ci, 'A', weekday, weekNum);
            html += checkboxCell(ci, 'L', weekday, weekNum);
          });
          html += '</tr>';
        });
        html += '</tbody></table>';
      });
      calContainer.innerHTML = html;

      // Add listeners for masters and checkboxes
      calContainer.querySelectorAll('input[data-master]').forEach(m => {
        m.checked = true;
        applyMaster(m);
        m.addEventListener('change', () => { applyMaster(m); compute(); });
      });
      calContainer.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', compute);
      });

      compute();
    }

    function checkboxCell(childIndex, slot, weekday, weekNum) {
      let enabled = false;
      if (slot === 'B') enabled = (weekday === 1 || weekday === 2 || weekday === 3 || weekday === 5);
      if (slot === 'A') enabled = (weekday === 1 || weekday === 4 || weekday === 5);
      if (slot === 'L') enabled = (weekday >= 1 && weekday <= 5);
      const disabledAttr = enabled ? '' : 'disabled';
      const checkedAttr = enabled ? 'checked' : '';
      return `<td style="text-align:center"><input type="checkbox" ${disabledAttr} ${checkedAttr} data-week="${weekNum}" data-child="${childIndex}" data-slot="${slot}"></td>`;
    }

    function applyMaster(masterCb) {
      const id = masterCb.getAttribute('data-master');
      const [weekNum, rest] = id.split('-');
      const child = rest[1]; // index string
      const slot = rest[2];
      calContainer.querySelectorAll(`tbody input[data-week="${weekNum}"][data-child="${child}"][data-slot="${slot}"]`).forEach(cb => {
        if (!cb.disabled) cb.checked = masterCb.checked;
      });
    }

    function compute() {
      const counts = CHILDREN.map(() => ({B:0,A:0,L:0}));

      calContainer.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => {
        if (cb.checked && !cb.disabled) {
          const child = parseInt(cb.getAttribute('data-child'));
          const slot = cb.getAttribute('data-slot');
          counts[child][slot]++;
        }
      });

      const breakfastTotal = PRICES.breakfastPerChildPerDay * counts.reduce((s,c)=>s+c.B,0);
      const afterTotal     = PRICES.afterPerChildPerDay * counts.reduce((s,c)=>s+c.A,0);
      const lunchTotal     = PRICES.lunchPerChildPerDay * counts.reduce((s,c)=>s+c.L,0);
      const grandTotal = breakfastTotal + afterTotal + lunchTotal;

      els.breakfastTotal.textContent = fmtGBP.format(breakfastTotal);
      els.afterTotal.textContent     = fmtGBP.format(afterTotal);
      els.lunchTotal.textContent     = fmtGBP.format(lunchTotal);
      els.grandTotal.textContent     = fmtGBP.format(grandTotal);

      const rows = [];
      CHILDREN.forEach((child, ci) => {
        const clubs = PRICES.breakfastPerChildPerDay * counts[ci].B + PRICES.afterPerChildPerDay * counts[ci].A;
        const lunches = PRICES.lunchPerChildPerDay * counts[ci].L;
        rows.push(`<tr><td>${child}</td><td>${fmtGBP.format(clubs)}</td><td>${fmtGBP.format(lunches)}</td><td>${fmtGBP.format(clubs+lunches)}</td></tr>`);
      });
      els.perChildBreakdown.innerHTML = rows.join('');
    }

    (function init(){
      const now=new Date();
      const ym=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
      monthInput.value=ym;
      monthInput.addEventListener('input',rebuildCalendar);
      rebuildCalendar();
    })();
  </script>
</body>
</html>

