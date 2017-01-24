'use strict';

/**
 * @ngdoc function
 * @name routeToGasStationApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the routeToGasStationApp
 */
angular.module('routeToGasStationApp')
	.controller('NavCtrl', function ($scope, $location) {
		$scope.isActive = function (viewLocation) {
			return viewLocation === $location.path();
		};

		$scope.hideMobMenu = function() {
			var el = angular.element('#js-navbar-collapse');
 			el.attr('class', 'navbar-collapse collapse');
		}
	});
