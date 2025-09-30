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


const monthInput = document.getElementById('monthInput');
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
</html>
