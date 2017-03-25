'use strict';

playlistMakerApp
  .controller("DashboardController", function ($scope, playlistService, $location,
     $route, $sce, $timeout) {
  $scope.showPlayListModal = false;
  $scope.playlistObj = {};
  $scope.userPlayList = [];
  $scope.currentUser = {};
  $scope.currentVideo = {};

  function init() {
    var loggedinUser = playlistService.getData("currentUser");
    if (loggedinUser.hasOwnProperty("email")) {
      $scope.currentUser = loggedinUser;
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

  var setVideoFunction = function (playlistVideo) {
    var urlSplit = [], id
    if (playlistVideo.url.indexOf("youtube") !== -1) {
        urlSplit = playlistVideo.url.split("?v=");
        id = urlSplit[urlSplit.length-1];
    } else {
      id = playlistVideo.url
    }
    $scope.currentVideo.url = "https://www.youtube.com/embed/"+id+"?autoplay=1";
    // $scope.currentVideo.title = playlistVideo.title;
  }

  $scope.playYourPlaylist = function () {
    var i = 0, interval = 0;
    do {
      setVideoFunction($scope.userPlayList[i]);
      interval = 120 - $scope.userPlayList[i].startTime
      // $timeout(function() {
      //     i++
      // }, interval*1000)
    } while(i < $scope.userPlayList.length)
  }

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

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

