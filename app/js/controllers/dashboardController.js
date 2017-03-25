'use strict';

playlistMakerApp
  .controller("DashboardController", function ($scope, playlistService, $location,
     $route, $sce, $timeout, $interval, $q) {
  $scope.showPlayListModal = false;
  $scope.playlistObj = {};
  $scope.userPlayList = [];
  $scope.currentUser = {};
  $scope.currentVideo = {};
  var videoInterval = 0;
  $scope.formError = false;

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
  }

  var asyncFunctionToPlayVideos = function (obj) {
    var interval = obj.endTime - obj.startTime
    var deferred = $q.defer()
    setVideoFunction(obj)
    $scope.timeoutPromise = $timeout(function() {
      return deferred.resolve(true)
    }, interval*1000);
    return deferred.promise;
  }

  $scope.playYourPlaylist = function () {
    if (!$scope.userPlayList.length) {
      return;
    }
    var i = 0;
    $scope.interValPromise = $interval(function() {
      asyncFunctionToPlayVideos($scope.userPlayList[i]).then(function(val) {
        if (i < $scope.userPlayList.length) {
          i++
        } else {
          console.log('play list ended')
          $interval.cancel($scope.interValPromise);
        }
      })
    }, 10)
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

