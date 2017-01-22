'use strict';

/**
 * @ngdoc function
 * @name routeToGasStationApp.controller:ResultsCtrl
 * @description
 * # ResultsCtrl
 * Controller of the routeToGasStationApp
 */
angular.module('routeToGasStationApp')
	.controller('ResultsCtrl', ['$scope', '$location', '$http', 'geodata', function ($scope, $location, $http, geodata) {
		var map;
		var panorama;
		var origin;
		var latt;
		var lngg;
		var detination;
		var destlat;
		var destlng;
		var start;
		var finish;
		var wayPointsString = '';
		var directionsText = [];
		var said = 0;
		$scope.chosenStation = geodata;
		$scope.directionsText = directionsText;

		function initMap() {
			map = new google.maps.Map(document.getElementById('map'), {
				zoom: 7,
				center: {lat: 50, lng: 0}
			});			
		}

		function calculateAndDisplayRoute(directionsService, directionsDisplay) {
			said = 0;
			var directionsService = new google.maps.DirectionsService;
			var directionsDisplay = new google.maps.DirectionsRenderer;
			origin = geodata.start.split(',');
			latt = Number(origin[0]);
			lngg = Number(origin[1]);
			detination = geodata.chosen.coordinates.split(',');
			destlat = Number(detination[0]);
			destlng = Number(detination[1]);
			start = new google.maps.LatLng(latt, lngg);
			finish = new google.maps.LatLng(destlat, destlng);
			directionsService.route({
				origin: start,
				destination: finish,
				travelMode: google.maps.TravelMode.DRIVING
			}, function(response, status) {
				if (status === google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);

					for (let f=0; f<response.routes[0].overview_path.length; f++) {
						let flat = response.routes[0].overview_path[f].lat();
						flat = String(flat).slice(0,8);
						let flng = response.routes[0].overview_path[f].lng();
						flng = String(flng).slice(0,8);
						wayPointsString = wayPointsString + '%7C' + flat + ',' + flng;
					}
					console.log(response.routes[0].overview_path);
					var surl ='https://maps.googleapis.com/maps/api/staticmap?size=800x400&maptype=roadmap&markers=' + $scope.chosenStation.start + '%7C' + $scope.chosenStation.chosen.coordinates + '&key=AIzaSyBAEwrqTBUvPZpCqyjLjjst85AGzpQbS5Q&path=color:0x0000ff' + wayPointsString;
					$http.get(surl)
					.then(function(response) {
						if($scope.staticMap) {
							$scope.staticMap = response.config.url;
						}
					});
				} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
			directionsDisplay.setMap(map);
			directionsDisplay.setPanel(document.getElementById('right-panel'));

			setTimeout(function() {
				allTextArray = document.getElementsByClassName('adp-substep');
				var k;
				for (var j=2; j<allTextArray.length; j=j+4) {
					k=j+1;
					directionsText.push(allTextArray[j].innerText + ' ' + allTextArray[k].innerText);
				}
				console.log(directionsText);
				
			}, 2000);

			initialize();
		}

		$scope.$watch(function () {
			return geodata.chosen.id;
		}, function (value) {
        	if (value != ''){
        		calculateAndDisplayRoute();
        	}
    	});

		var allTextArray;
		var spekIt;

		function initialize() {
			panorama = new google.maps.StreetViewPanorama(
				document.getElementById('street-view'), {
					position: {lat: destlat, lng: destlng},
					pov: {heading: 165, pitch: 0},
					zoom: 1
				}
			);
		}

		var speakInterval;
		$scope.speakIt = function() {
			if (window.Notification && Notification.permission !== 'granted') {
				Notification.requestPermission(function (status) {
					if (Notification.permission !== status) {
						Notification.permission = status;
					}
				});
			}
			if (window.Notification && Notification.permission === 'granted') {
				var n = new Notification('Click this notification to speak up your route');
				n.onclick = function(event) {
					event.preventDefault();
					tell(said);
					n.close();
				}
				setTimeout(n.close.bind(n), 60000);				
			} else if (window.Notification && Notification.permission !== 'denied') {
				Notification.requestPermission(function (status) {
					if (status === 'granted') {
						var n = new Notification('Click the notification to speak up your route');
						n.onclick = function(event) {
							event.preventDefault();
							tell(said);
							n.close();
						}
						setTimeout(n.close.bind(n), 60000);				
					} else {
						alert('Notifications are not allowed in your browser');
					}
				});
			} else {
				alert('Notifications are not allowed in your browser');
			}

			function tellMore() {
				if (window.Notification && Notification.permission === 'granted') {
					var interval = setTimeout(function () {
						var n = new Notification('Click the notification to speak up your route');
						n.onclick = function(event) {
							event.preventDefault();
							tell(said);
							n.close();
						}
						setTimeout(n.close.bind(n), 60000);				
					}, 5000);
				} else if (window.Notification && Notification.permission !== 'denied') {
					Notification.requestPermission(function (status) {
						if (status === 'granted') {
							var interval = setTimeout(function () {
								var n = new Notification('Click the notification to speak up your route');
								n.onclick = function(event) {
									event.preventDefault();
									tell(said);
									n.close();
								}
								setTimeout(n.close.bind(n), 60000);				
							}, 5000);
						} else {
							alert('Notifications are not allowed in your browser');
						}
					});
				} else {
					alert('Notifications are not allowed in your browser');
				}
			}

			function tell(x) {
				spekIt = new SpeechSynthesisUtterance();
				if (directionsText[x]) {
					spekIt.text = directionsText[x];
	    			window.speechSynthesis.resume();
					speechSynthesis.speak(spekIt);
					said = said + 1;
					tellMore();					
				} else {
					spekIt.text = 'To listen the directions once more, please click the button again';
	    			window.speechSynthesis.resume();
					speechSynthesis.speak(spekIt);
					said = 0;
				}
			}
/*
			spekIt = new SpeechSynthesisUtterance();
			let s = 0;
			setTimeout(function repeatSpeak(s) {
				if (directionsText[s]) {
					spekIt.text = directionsText[s];
					console.log(s);
    				window.speechSynthesis.resume();
					speechSynthesis.speak(spekIt).then(function() {
						s = s + 1;
						repeatSpeak(s);
					});
					
				}
			}, 2000);
*/		
		};

		function getLang() {
		    var currentLang = navigator.language || navigator.userLanguage;
		}

		initMap();	

	}]);
