---
layout: page
permalink: /usstates
title: Visited US States
description: A map of the US States I have visited
nav: false
tags: misc
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet/dist/leaflet.css"
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

  <!-- Leaflet core -->
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <!-- PapaParse for CSV parsing -->
  <script src="https://unpkg.com/papaparse@5.3.1/papaparse.min.js"></script>
  <script>
    // 1. Initialize the map
    const map = L.map('map').setView([37.8, -96], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 2. Load and parse the CSV of states
    Papa.parse('/assets/files/US_states.csv', {
      download: true,
      header: true,
      complete: ({ data }) => {
        const visited = {};
        data.forEach(row => {
          // Normalize state names exactly as in your GeoJSON
          visited[row.State.trim()] = row.Visited === 'Y';
        });
        addStatesLayer(visited);
      }
    });

    // 3. Fetch US states GeoJSON and style according to visited[]
    function addStatesLayer(visited) {
      fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
        .then(res => res.json())
        .then(geoData => {
          L.geoJson(geoData, {
            style: feature => ({
              fillColor: visited[feature.properties.name] ? 'green' : '#ccc',
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            }),
            onEachFeature: (feature, layer) => {
              const name = feature.properties.name;
              const flag = visited[name] ? '✅ Visited' : '❌ Not visited';
              layer.bindPopup(`<strong>${name}</strong><br>${flag}`);
            }
          }).addTo(map);
        });
    }
  </script>
</body>
</html>
