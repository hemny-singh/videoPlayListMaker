'use strict';

playlistMakerApp
  .controller("DashboardController", function ($scope, playlistService, $location,
     $route, $sce, $timeout, $interval, $q) {
  $scope.showPlayListModal = false;
  $scope.playlistObj = {};
  $scope.userPlayList = [];
  $scope.currentUser = {};
  $scope.currentVideo = {};
  $scope.formError = false;
  $scope.refreshRate = 0;
  $scope.showCompletedMessage = false;

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
    $scope.formError = false;
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
    $scope.currentVideo.title = playlistVideo.title;
    $scope.currentVideo.views = playlistVideo.views;
  }

  var calcCurrentVideo = function () {
    var currentUser = angular.copy(playlistService.getData("users")[$scope.currentUser.email]);
    $scope.userPlayList[$scope.curIndex].views = $scope.userPlayList[$scope.curIndex].views ? parseInt($scope.userPlayList[$scope.curIndex].views, 10) + 1 : 1;
    currentUser.playlist = $scope.userPlayList;
    playlistService.saveData('users', $scope.currentUser.email, currentUser)
    setVideoFunction($scope.userPlayList[$scope.curIndex]);
    $scope.curIndex++;
    if ($scope.curIndex < $scope.userPlayList.length) {
      $scope.refreshRate = $scope.userPlayList[$scope.curIndex].endTime - $scope.userPlayList[$scope.curIndex].startTime;
    }
  }

  $scope.$watch("refreshRate", function(oldVal, newVal) {
    if (oldVal !== newVal && oldVal !== 0) {
      $interval.cancel($scope.interValPromise);
      $timeout.cancel($scope.timeoutPromise);
      $scope.interValPromise = $interval(function() {
        if ($scope.curIndex < $scope.userPlayList.length) {
          calcCurrentVideo();
        } else {
          $scope.showCompletedMessage = true;
          $interval.cancel($scope.interValPromise);
        }
    }, $scope.refreshRate*1000);
    }
  }, true);

  $scope.playYourPlaylist = function () {
    if (!$scope.userPlayList.length) {
      return;
    }
    $scope.showCompletedMessage = false;
    $scope.curIndex = 0;
    $scope.refreshRate = 0;

    $scope.timeoutPromise = $timeout(function() {
      calcCurrentVideo()
    }, $scope.refreshRate);
  }

  $scope.$on('$destroy',function() {
    if($scope.interValPromise) {
      $interval.cancel($scope.interValPromise);
    }

    if($scope.timeoutPromise) {
      $interval.cancel($scope.timeoutPromise);
    }
  });



  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  $scope.savePlaylist = function(val) {
    if (val === true && (!$scope.playlistObj.title && !$scope.playlistObj.url && !$scope.playlistObj.startTime && !$scope.playlistObj.endTime)) {
      $scope.formError = true
      return 
    } else {
      $scope.showPlayListModal = false;
      var loggedinUser = playlistService.getData("currentUser");
      if (loggedinUser && loggedinUser.hasOwnProperty("email")) {
        var currentUser = angular.copy(playlistService.getData("users")[loggedinUser.email]),
          userPlayList = angular.copy(currentUser.playlist) || []
        $scope.playlistObj.views = 0;
        userPlayList.push($scope.playlistObj)
        currentUser.playlist = val ? userPlayList : []
        playlistService.saveData('users', loggedinUser.email, currentUser)
        $scope.userPlayList = angular.copy(playlistService.getData("users")[loggedinUser.email].playlist)
      } else {
        console.error("Please login to create your own playlist")
      }
    }
  }
});

