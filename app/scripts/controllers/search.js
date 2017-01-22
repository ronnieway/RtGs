'use strict';

/**
 * @ngdoc function
 * @name routeToGasStationApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the routeToGasStationApp
 */
angular.module('routeToGasStationApp')
	.controller('SearchCtrl', ['$scope', '$location', '$http', 'geodata', function ($scope, $location, $http, geodata) {
		$scope.chosenStation = geodata;
    	$scope.getLocation = function() {
	  		if (navigator.geolocation) {						
				navigator.geolocation.getCurrentPosition(coordinates);
			} else {
				alert('Geolocation is not supported by this browser.');
			}			
		};

		var coords;
		function coordinates (data) {
			coords = data.coords.latitude + ',' + data.coords.longitude;
			geodata.start = coords;
	  		var url ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + coords + '&radius=5000&types=gas_station&key=AIzaSyBAEwrqTBUvPZpCqyjLjjst85AGzpQbS5Q';
			$http.get(url)
			.then(function(response) {
				var dataCellsArray = [];
				var dataCellsArrayHead = [{'name':'Station','address':'Address','open':'Open now?'}];
				var obRowCells = {};
				var result=response.data.results;
				for (var k=0; k<result.length; k++) {
					obRowCells = {};
					obRowCells.name = result[k].name;
					obRowCells.coordinates = result[k].geometry.location.lat + ',' + result[k].geometry.location.lng;
					obRowCells.id = result[k].id;
					if (result[k].opening_hours) {
						if (result[k].opening_hours.open_now) {
							obRowCells.open = 'open';
						} else {
							obRowCells.open = 'close';
						}
					} else {
						obRowCells.open = 'unknown';
					}
					obRowCells.address = result[k].vicinity;
					dataCellsArray.push(obRowCells);
				}	
				$scope.stationsList = dataCellsArray;
				$scope.stationsListHead = dataCellsArrayHead;
			}, function (response) {
				console.log('error', response);
			});
		}

		$scope.geocode = function() {
			var country = document.getElementById('countryInput').value;
			var city = document.getElementById('cityInput').value;
			var street = document.getElementById('streetInput').value;
			var building = document.getElementById('buildingInput').value;
			var address = country + ' ' + city + ' ' + street + ' ' + building;
			var coords;
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
				var url ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + coords + '&radius=10000&types=gas_station&key=AIzaSyBAEwrqTBUvPZpCqyjLjjst85AGzpQbS5Q';
				$http.get(url)
				.then(function(response) {
					var dataCellsArray = [];
					var dataCellsArrayHead = [{'name':'Station','address':'Address','open':'Open now?'}];
					var obRowCells = {};
					var result=response.data.results;
					for (var k=0; k<result.length; k++) {
						obRowCells = {};
						obRowCells.name = result[k].name;
						obRowCells.coordinates = result[k].geometry.location.lat + ',' + result[k].geometry.location.lng;
						obRowCells.id = result[k].id;
						if (result[k].opening_hours) {
							if (result[k].opening_hours.open_now) {
								obRowCells.open = 'open';
							} else {
								obRowCells.open = 'close';
							}
						} else {
							obRowCells.open = 'unknown';
						}
						obRowCells.address = result[k].vicinity;
						dataCellsArray.push(obRowCells);
					}	
					$scope.stationsList = dataCellsArray;
					$scope.stationsListHead = dataCellsArrayHead;
				}, function (response) {
					console.log('error', response);
				});
			});			
		}

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

