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

  <p>Two children. Prices: Breakfast (Mon/Tue/Wed/Fri) £4.50/child/day; After-school (Mon/Thu/Fri) £5.00/child/day; Lunch (Mon–Fri) £2.70/child/day.</p>
  <p>Use the weekday calendar to deselect days for each child (e.g., half-term, trips). Columns have master checkboxes to toggle all for that column. By default all applicable days are selected.</p>

  <h2>Weekday calendar (Mon–Fri only)</h2>
  <table border="1" cellpadding="6" cellspacing="0" id="calTable"></table>

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
    const N_CHILDREN = 2;

    const PRICES = {
      breakfastPerChildPerDay: 4.50,
      afterPerChildPerDay: 5.00,
      lunchPerChildPerDay: 2.70,
    };

    const fmtGBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

    const monthInput = document.getElementById('monthInput');
    const calTable   = document.getElementById('calTable');

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
        // Keep Mon..Fri (1..5)
        if (wd >= 1 && wd <= 5) {
          out.push({ idx: d, weekday: wd, label: `${labels[wd]} ${d}` });
        }
      }
      return out;
    }

    function rebuildCalendar() {
      const parts = getMonthParts(monthInput.value);
      if (!parts) return;
      const { year, monthIndex } = parts;
      const weekdays = listWeekdays(year, monthIndex);

      // Build header with master toggles per column
      // Columns: Date | C1 Breakfast | C1 After | C1 Lunch | C2 Breakfast | C2 After | C2 Lunch
      let html = '<thead><tr>' +
        '<th>Date</th>' +
        '<th>Child 1 Breakfast <input type="checkbox" data-master="c1B" /></th>' +
        '<th>Child 1 After <input type="checkbox" data-master="c1A" /></th>' +
        '<th>Child 1 Lunch <input type="checkbox" data-master="c1L" /></th>' +
        '<th>Child 2 Breakfast <input type="checkbox" data-master="c2B" /></th>' +
        '<th>Child 2 After <input type="checkbox" data-master="c2A" /></th>' +
        '<th>Child 2 Lunch <input type="checkbox" data-master="c2L" /></th>' +
      '</tr></thead><tbody>';

      // Rows for each weekday
      for (let r = 0; r < weekdays.length; r++) {
        const { idx, label, weekday } = weekdays[r];
        html += '<tr>' +
          `<td>${label}</td>` +
          // For each child/slot, include data attrs for filtering & defaults:
          checkboxCell(1, 'B', weekday) +
          checkboxCell(1, 'A', weekday) +
          checkboxCell(1, 'L', weekday) +
          checkboxCell(2, 'B', weekday) +
          checkboxCell(2, 'A', weekday) +
          checkboxCell(2, 'L', weekday) +
        '</tr>';
      }
      html += '</tbody>';
      calTable.innerHTML = html;

      // Initialize master toggles to checked and apply to column
      const masterIds = ['c1B','c1A','c1L','c2B','c2A','c2L'];
      masterIds.forEach(id => {
        const m = calTable.querySelector(`input[data-master="${id}"]`);
        if (m) {
          m.checked = true;
          applyMaster(m);
          m.addEventListener('change', () => { applyMaster(m); compute(); });
        }
      });

      // Recompute when any checkbox in body changes
      calTable.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', compute);
      });

      compute();
    }

    function checkboxCell(child, slot, weekday) {
      // slot: 'B' breakfast valid days Mon(1) Tue(2) Wed(3) Fri(5)
      //       'A' after-school valid days Mon(1) Thu(4) Fri(5)
      //       'L' lunch valid days Mon..Fri (1..5)
      let enabled = false;
      if (slot === 'B') enabled = (weekday === 1 || weekday === 2 || weekday === 3 || weekday === 5);
      if (slot === 'A') enabled = (weekday === 1 || weekday === 4 || weekday === 5);
      if (slot === 'L') enabled = (weekday >= 1 && weekday <= 5);
      const disabledAttr = enabled ? '' : 'disabled';
      const checkedAttr = enabled ? 'checked' : '';
      return `<td style="text-align:center"><input type="checkbox" ${disabledAttr} ${checkedAttr} data-child="${child}" data-slot="${slot}"></td>`;
    }

    function applyMaster(masterCb) {
      const id = masterCb.getAttribute('data-master');
      const child = id[1]; // '1' or '2'
      const slot  = id[2]; // 'B' 'A' 'L'
      calTable.querySelectorAll(`tbody input[type="checkbox"][data-child="${child}"][data-slot="${slot}"]`).forEach(cb => {
        if (!cb.disabled) cb.checked = masterCb.checked;
      });
    }

    function compute() {
      // Count checked boxes per category per child
      const counts = {
        c1: { B: 0, A: 0, L: 0 },
        c2: { B: 0, A: 0, L: 0 },
      };

      calTable.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => {
        if (cb.checked && !cb.disabled) {
          const child = cb.getAttribute('data-child');
          const slot  = cb.getAttribute('data-slot');
          counts[child === '1' ? 'c1' : 'c2'][slot]++;
        }
      });

      // Totals across both children
      const breakfastTotal = PRICES.breakfastPerChildPerDay * (counts.c1.B + counts.c2.B);
      const afterTotal     = PRICES.afterPerChildPerDay     * (counts.c1.A + counts.c2.A);
      const lunchTotal     = PRICES.lunchPerChildPerDay     * (counts.c1.L + counts.c2.L);
      const grandTotal     = breakfastTotal + afterTotal + lunchTotal;

      els.breakfastTotal.textContent = fmtGBP.format(breakfastTotal);
      els.afterTotal.textContent     = fmtGBP.format(afterTotal);
      els.lunchTotal.textContent     = fmtGBP.format(lunchTotal);
      els.grandTotal.textContent     = fmtGBP.format(grandTotal);

      // Per child rows
      const rows = [];
      const perChild = (c) => {
        const clubs = PRICES.breakfastPerChildPerDay * counts[c].B + PRICES.afterPerChildPerDay * counts[c].A;
        const lunches = PRICES.lunchPerChildPerDay * counts[c].L;
        return { clubs, lunches, total: clubs + lunches };
      };
      const c1 = perChild('c1');
      const c2 = perChild('c2');
      rows.push(`<tr><td>Child 1</td><td>${fmtGBP.format(c1.clubs)}</td><td>${fmtGBP.format(c1.lunches)}</td><td>${fmtGBP.format(c1.total)}</td></tr>`);
      rows.push(`<tr><td>Child 2</td><td>${fmtGBP.format(c2.clubs)}</td><td>${fmtGBP.format(c2.lunches)}</td><td>${fmtGBP.format(c2.total)}</td></tr>`);
      els.perChildBreakdown.innerHTML = rows.join('');
    }

    (function init() {
      const now = new Date();
      const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
      monthInput.value = ym;
      monthInput.addEventListener('input', rebuildCalendar);
      rebuildCalendar();
    })();
  </script>
</body>
</html>
