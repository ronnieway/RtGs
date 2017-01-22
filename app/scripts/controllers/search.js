'use strict';

/**
 * @ngdoc function
 * @name routeToGasStationApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the routeToGasStationApp
 */
angular.module('routeToGasStationApp')
	.controller('SearchCtrl', ['$scope', '$location', '$http', '$anchorScroll', 'geodata', function ($scope, $location, $http, $anchorScroll, geodata) {
		var coords;
		var service;
		var dataCellsArray;

		$scope.chosenStation = geodata;

    	$scope.getLocation = function() {
	  		if (navigator.geolocation) {						
				navigator.geolocation.getCurrentPosition(coordinates);
			} else {
				alert('Geolocation is not supported by this browser.');
			}			
		};

		function coordinates (data) {
			coords = data.coords.latitude + ',' + data.coords.longitude;
			geodata.start = coords;
			var fromHere = new google.maps.LatLng(Number(data.coords.latitude),Number(data.coords.longitude));
	  		var request = {
				location: fromHere,
				radius: '5000',
				types: ['gas_station']
			};

			service = new google.maps.places.PlacesService(document.createElement('div'));
			service.nearbySearch(request, callback);
		};

		function callback(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				var obRowCells = {};
				dataCellsArray = [];
				for (var k=0; k<results.length; k++) {
					obRowCells = {};
					obRowCells.name = results[k].name;
					obRowCells.coordinates = results[k].geometry.location.lat() + ',' + results[k].geometry.location.lng();
					obRowCells.id = results[k].id;
					if (results[k].opening_hours) {
						if (results[k].opening_hours.open_now) {
							obRowCells.open = 'open';
						} else {
							obRowCells.open = 'close';
						}
					} else {
						obRowCells.open = 'unknown';
					}
					obRowCells.address = results[k].vicinity;
					dataCellsArray.push(obRowCells);
				}	
				
			} else {
				console.log("something goes wrong:" + status);
			}
			$scope.stationsList = dataCellsArray;
			$scope.$apply();
			$anchorScroll();
		};

		$scope.geocode = function() {
			var country = document.getElementById('countryInput').value;
			var city = document.getElementById('cityInput').value;
			var street = document.getElementById('streetInput').value;
			var building = document.getElementById('buildingInput').value;
			var address = country + ' ' + city + ' ' + street + ' ' + building;
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address': address}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					var lat = results[0].geometry.location.lat();
					var lng = results[0].geometry.location.lng();
					coords = lat + ',' + lng;
				} else {
					alert('We are sorry, but we can not find that address because of the following reason: ' + status);
				}
				geodata.start = coords;
				if (results[0]) {
					var fromHere = results[0].geometry.location;				
			  		var request = {
						location: fromHere,
						radius: '5000',
						types: ['gas_station']
					};

					service = new google.maps.places.PlacesService(document.createElement('div'));
					service.nearbySearch(request, callback);
				}
			});			
		};

		$scope.chosen = function(event) {
			var id = event.target.id;
			var theArray = id.split(';');
			geodata.chosen.id = theArray[0];
			geodata.chosen.name = theArray[1];
			geodata.chosen.coordinates = theArray[2];
			geodata.chosen.street = theArray[3];
			$location.path('results');
		}		
	}]);