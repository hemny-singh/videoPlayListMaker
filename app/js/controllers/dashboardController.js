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

  //On load check the logged in user and load the added videos in playlist
  function init() {
    var loggedinUser = playlistService.getData("currentUser");
    if (loggedinUser.hasOwnProperty("email")) {
      $scope.currentUser = loggedinUser;
      $scope.userPlayList = angular.copy(playlistService.getData("users")[loggedinUser.email].playlist) || [];
    }
  }
  init()

  //Show the modal to add playlist and clear the form
  $scope.createYourPlaylist = function() {
    if ($scope.currentUser.name) {
      $scope.showPlayListModal = true;
      $scope.formError = false;
    }
  }

  //Show the modal to add playlist and clear the form
  $scope.showModal = function() {
    $scope.showPlayListModal = true;
    $scope.formError = false;
    $scope.playlistObj = {};
  }

  $scope.hideModal = function() {
    $scope.showPlayListModal = false;
  }

  //Bind the url, views in iframe for current video.
  var setVideoFunction = function (playlistVideo) {
    var urlSplit = [], id
    if (playlistVideo.url.indexOf("youtube") !== -1) {
        urlSplit = playlistVideo.url.split("?v=");
        id = urlSplit[urlSplit.length-1];
    } else {
      id = playlistVideo.url
    }
    $scope.currentVideo.url = "https://www.youtube.com/embed/"+id+"?start="+
      playlistVideo.startTime+"&autoplay=1";
    $scope.currentVideo.title = playlistVideo.title;
    $scope.currentVideo.views = playlistVideo.views;
  }

  //Setup for next video in playlist and increase the views.
  var calcCurrentVideo = function () {
    var currentUser = angular.copy(playlistService.getData("users")[$scope.currentUser.email]);
    $scope.userPlayList[$scope.curIndex].views = $scope.userPlayList[$scope.curIndex].views ? parseInt($scope.userPlayList[$scope.curIndex].views, 10) + 1 : 1;
    currentUser.playlist = $scope.userPlayList;
    playlistService.saveData('users', $scope.currentUser.email, currentUser)
    setVideoFunction($scope.userPlayList[$scope.curIndex]);
    $scope.curIndex++;
    if ($scope.curIndex < $scope.userPlayList.length) {
      $scope.refreshRate = $scope.userPlayList[$scope.curIndex].endTime - $scope.userPlayList[$scope.curIndex].startTime;
    } else {
      $scope.refreshRate = $scope.userPlayList[$scope.curIndex-1].endTime - $scope.userPlayList[$scope.curIndex-1].startTime;
    }
  }

  //Watch refreshRate: which trigger function to setup next video of playlist
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

  //Play your library as per given start time and end time.
  $scope.playYourPlaylist = function () {
    if (!$scope.userPlayList.length) {
      return;
    }
    $scope.showCompletedMessage = false;
    $scope.curIndex = 0;
    $scope.refreshRate = 0;

    //first time set the next refreshRate and play the first video without any delay
    $scope.timeoutPromise = $timeout(function() {
      calcCurrentVideo()
    }, $scope.refreshRate);
  }

  //Clear the interval and timeout while destroying the controller
  $scope.$on('$destroy',function() {
    if($scope.interValPromise) {
      $interval.cancel($scope.interValPromise);
    }

    if($scope.timeoutPromise) {
      $interval.cancel($scope.timeoutPromise);
    }
  });

  //to render url in iframe as AngularJS constrains bindings to only render trusted values. 
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  //Saving playlist in local storage for loggedin user
  $scope.savePlaylist = function(val) {
    //Validating Form
    if (val === true && ($scope.playlistObj.startTime > $scope.playlistObj.endTime) || (!$scope.playlistObj.title && !$scope.playlistObj.url && !$scope.playlistObj.startTime && !$scope.playlistObj.endTime)) {
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
        //USer should be logged in to create playlist
        console.error("Please login to create your own playlist")
      }
    }
  }
});

