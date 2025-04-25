---
layout: page
permalink: /usroute
title: US Road Trip
description: US road trip plan
nav: false
tags: misc
---

<html lang="en">
  <head>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true"></script>
    <script>
		var routes_list = []
		var markerOptions = {icon: "http://maps.gstatic.com/mapfiles/markers2/marker.png"};
		var directionsDisplayOptions = {preserveViewport: true,
										markerOptions: markerOptions};
		var directionsService = new google.maps.DirectionsService();
		var map;

		function initialize() {
		  var center = new google.maps.LatLng(39, -96);
		  var mapOptions = {
			zoom: 5,
			center: center
		  };
		  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		  for (i=0; i<routes_list.length; i++) {
		  	routes_list[i].setMap(map);	
		  }
		}

		function calcRoute(start, end, routes) {
		  
		  var directionsDisplay = new google.maps.DirectionsRenderer(directionsDisplayOptions);

		  var waypts = [];
		  for (var i = 0; i < routes.length; i++) {
		  	waypts.push({
		  	  location:routes[i],
		  	  stopover:true});
		  	}
		  
		  var request = {
			  origin: start,
			  destination: end,
			  waypoints: waypts,
			  optimizeWaypoints: false,
			  travelMode: google.maps.TravelMode.DRIVING
		  };

		  directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);		
			}
		  });

		  routes_list.push(directionsDisplay);
		}

		function createRoutes(route) {
			// Google's free map API is limited to 10 waypoints so need to break into batches
			route.push(route[0]);
			var subset = 0;
			while (subset < route.length) {
				var waypointSubset = route.slice(subset, subset + 10);

				var startPoint = waypointSubset[0];
				var midPoints = waypointSubset.slice(1, waypointSubset.length - 1);
				var endPoint = waypointSubset[waypointSubset.length - 1];

				calcRoute(startPoint, endPoint, midPoints);

				subset += 9;
			}
		}

		optimal_route = ['1 Blues Alley, Clarksdale, MS 38614', 'Graceland, Elvis Presley Blvd, Memphis, TN 38116', 'U.S. Space & Rocket Center, 1 Tranquility Base, Huntsville, AL 35805', 'Mammoth Cave National Park, Kentucky', 'Cades Cove, Tennessee, 37882', "1214 Middle St, Sullivan's Island, SC 29482", 'Calhoun St, Charleston, SC 29401', '301 Martin Luther King Jr Blvd, Savannah, GA 31401', 'Rehoboth Beach, Delaware', 'University of Michigan, 500 S State St, Ann Arbor, MI 48109', 'Indiana Dunes National Park, Indiana', '5481 County Rd C, Spring Green, WI 53588', '28995 Lansing Rd, Dyersville, IA 52040', 'Mall of America, 60 E Broadway, Bloomington, MN 55425', 'Theodore Roosevelt National Park, North Dakota', 'Glacier National Park, Montana', 'Columbia River Gorge, Oregon', 'Crater Lake National Park, Oregon', 'Sawtooth National Forest, Idaho 75, Stanley, ID 83278', 'Craters of the Moon National Monument, Idaho', 'Little Bighorn Battlefield National Monument, Montana', 'The Badlands Loop Road, SD-240, South Dakota', 'Mount Rushmore National Memorial', 'Chimney Rock Trail, Bayard, NE 69334', 'Monument Rocks Natural Landmark, Scott City, KS 67871', 'Omaha’s Henry Doorly Zoo and Aquarium, Nebraska', 'Gateway Arch, Missouri', 'Hot Springs National Park, Arkansas', 'Vicksburg National Military Park, 3201 Clay St, Vicksburg, MS 39183', '1 Blues Alley, Clarksdale, MS 38614']
		
		createRoutes(optimal_route);

		google.maps.event.addDomListener(window, 'load', initialize);

    </script>
  </head>
  <body>
    <div id="map-canvas"></div>
  </body>
</html>
