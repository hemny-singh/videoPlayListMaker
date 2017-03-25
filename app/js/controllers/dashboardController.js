'use strict';

playlistMakerApp
  .controller("DashboardController", function ($scope, playlistService, $location, $route) {
  $scope.showPlayListModal = false;
  $scope.playlistObj = {};
  $scope.userPlayList = [];

  function init() {
    var loggedinUser = playlistService.getData("currentUser");
    if (loggedinUser.hasOwnProperty("email")) {
      $scope.userPlayList = angular.copy(playlistService.getData("users")[loggedinUser.email].playlist) || [];
    }
  }
  init()

  $scope.createYourPlaylist = function() {
    $scope.showPlayListModal = true;
  }

  $scope.showModal = function() {
    $scope.showPlayListModal = true;
    $scope.playlistObj = {};
  }

  $scope.hideModal = function() {
    $scope.showPlayListModal = false;
  }

  $scope.savePlaylist = function() {
    $scope.showPlayListModal = false;
    var loggedinUser = playlistService.getData("currentUser");
    if (loggedinUser && loggedinUser.hasOwnProperty("email")) {
      var currentUser = angular.copy(playlistService.getData("users")[loggedinUser.email]),
        userPlayList = angular.copy(currentUser.playlist) || []
      userPlayList.push($scope.playlistObj)
      currentUser.playlist = userPlayList
      playlistService.saveData('users', loggedinUser.email, currentUser)
      $scope.userPlayList = angular.copy(playlistService.getData("users")[loggedinUser.email].playlist)
    } else {
      console.error("Please login to create your own playlist")
    }
  }
});

