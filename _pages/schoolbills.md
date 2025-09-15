<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>School Bills (Simple)</title>
</head>
<body>
  <!-- Simple: month picker only -->
  <h1>School Bills</h1>
  <label for="monthInput">Month:</label>
  <input id="monthInput" type="month" />

  <p>Assumes 2 children. Prices: Breakfast Mon/Tue/Wed/Fri £4.50 per child per day; After school Mon/Thu/Fri £5.00 per child per day; Lunch every weekday £2.70 per child per day.</p>

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

  <h3>Weekday counts in month</h3>
  <ul>
    <li>Mon: <span id="mMon">0</span></li>
    <li>Tue: <span id="mTue">0</span></li>
    <li>Wed: <span id="mWed">0</span></li>
    <li>Thu: <span id="mThu">0</span></li>
    <li>Fri: <span id="mFri">0</span></li>
    <li>Total weekdays: <span id="mWeek">0</span></li>
  </ul>

  <script>
    // Fixed to 2 children for simplicity
    const N_CHILDREN = 2;

    const PRICES = {
      breakfastPerChildPerDay: 4.50,
      afterPerChildPerDay: 5.00,
      lunchPerChildPerDay: 2.70,
    };

    const fmtGBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

    const monthInput = document.getElementById('monthInput');

    const els = {
      breakfastTotal: document.getElementById('breakfastTotal'),
      afterTotal: document.getElementById('afterTotal'),
      lunchTotal: document.getElementById('lunchTotal'),
      grandTotal: document.getElementById('grandTotal'),
      perChildBreakdown: document.getElementById('perChildBreakdown'),
      mMon: document.getElementById('mMon'),
      mTue: document.getElementById('mTue'),
      mWed: document.getElementById('mWed'),
      mThu: document.getElementById('mThu'),
      mFri: document.getElementById('mFri'),
      mWeek: document.getElementById('mWeek'),
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
      if (!parts) return;

      const { year, monthIndex } = parts;
      const monday = countWeekdayInMonth(year, monthIndex, 1);
      const tuesday = countWeekdayInMonth(year, monthIndex, 2);
      const wednesday = countWeekdayInMonth(year, monthIndex, 3);
      const thursday = countWeekdayInMonth(year, monthIndex, 4);
      const friday = countWeekdayInMonth(year, monthIndex, 5);
      const weekdayTotal = monday + tuesday + wednesday + thursday + friday;

      els.mMon.textContent = monday;
      els.mTue.textContent = tuesday;
      els.mWed.textContent = wednesday;
      els.mThu.textContent = thursday;
      els.mFri.textContent = friday;
      els.mWeek.textContent = weekdayTotal;

      const breakfastDays = monday + tuesday + wednesday + friday;
      const afterDays = monday + thursday + friday;
      const lunchDays = weekdayTotal;

      const breakfastTotal = PRICES.breakfastPerChildPerDay * breakfastDays * N_CHILDREN;
      const afterTotal = PRICES.afterPerChildPerDay * afterDays * N_CHILDREN;
      const lunchTotal = PRICES.lunchPerChildPerDay * lunchDays * N_CHILDREN;
      const grandTotal = breakfastTotal + afterTotal + lunchTotal;

      els.breakfastTotal.textContent = fmtGBP.format(breakfastTotal);
      els.afterTotal.textContent = fmtGBP.format(afterTotal);
      els.lunchTotal.textContent = fmtGBP.format(lunchTotal);
      els.grandTotal.textContent = fmtGBP.format(grandTotal);

      const clubPerChild = (PRICES.breakfastPerChildPerDay * breakfastDays) + (PRICES.afterPerChildPerDay * afterDays);
      const lunchPerChild = PRICES.lunchPerChildPerDay * lunchDays;
      const totalPerChild = clubPerChild + lunchPerChild;

      const rows = [];
      for (let i = 1; i <= N_CHILDREN; i++) {
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
      monthInput.addEventListener('input', compute);
      compute();
    })();
  </script>
</body>
</html>
