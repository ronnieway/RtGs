'use strict';

/**
 * @ngdoc service
 * @name routeToGasStationApp.geodata
 * @description
 * # geodata
 * Service in the routeToGasStationApp.
 */

angular.module('routeToGasStationApp')
	.service('geodata', function () {
		var destinations ={
			start: '',
			chosen: {
				id: '',
				name: '',
				coordinates: '',
				street: ''
			}
		}
		return destinations;
	});
