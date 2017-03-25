'use strict';

/**
 * Main module of the application. configuring routing here
 */
var playlistMakerApp = angular
  .module('playlistMaker', [
    'ngRoute',
    'ngStorage'
  ]);

playlistMakerApp.config(function($routeProvider, $locationProvider) {
  "use strict";

  $routeProvider
    .when('/', {
      templateUrl: '/template/dashboard.html',
      controller: 'DashboardController'
    })
    .when('/user:params', {
      templateUrl: '/template/user.html',
      controller: 'UserController',
      activetab: 'user:params'
    })
  });
