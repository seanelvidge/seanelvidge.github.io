---
layout: page
permalink: /hrc
title: Hard Rock Cafe
description: A map of the open Hard Rock Cafes (red), and the ones I have visited (green).
nav: false
tags: misc
---

<html>
<head>
  <!-- Leaflet CSS -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    crossorigin=""
  />
  <style>
    #map {
  width: 100%;
  aspect-ratio: 16/9;   /* or 4/3, 2/1, whatever “shape” you like */
  height: auto;         /* lets the browser compute height from width */
}
  </style>
</head>
<body>

<div id="map"></div>

<!-- Leaflet JS -->
<script
  src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
  crossorigin=""
></script>
<!-- Papa Parse for CSV loading -->
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

<script>
// initialize map
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// custom marker icons from leaflet-color-markers
const greenIcon = new L.Icon({
  iconUrl:  'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const redIcon = new L.Icon({
  iconUrl:  'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// load and parse the CSV
Papa.parse('/assets/files/hard_rock_cafe_list.csv', {
  download: true,
  header: true,
  complete: results => {
    results.data.forEach(row => {
      const lat = parseFloat(row.Latitude);
      const lng = parseFloat(row.Longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const visited = (row.Visited || '').trim().toUpperCase() === 'Y';
      const icon = visited ? greenIcon : redIcon;

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(
          `<strong>${row.Name}</strong><br>` +
          `${row.City}, ${row.Country}<br>` +
          `Visited: ${visited ? 'Yes' : 'No'}`
        );
    });
  }
});
</script>

</body>
</html>

The data used to make this map can be downloaded from [here]('/assets/files/hard_rock_cafe_list.csv').
