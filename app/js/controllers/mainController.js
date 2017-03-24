'use strict';

playlistMakerApp
  .controller("MainController", function ($scope, playlistService, $location, $route) {
    $scope.currUsrActive = false;
    $scope.$route = $route;
    function init() {
      $scope.currentUser = playlistService.getData("currentUser") || {};
      $scope.currUsrActive = $scope.currentUser.hasOwnProperty('email') ? true : false;
    };
    init();

    $scope.logoutFun = function() {
      playlistService.saveParentObj("currentUser", {});
      location.reload();
    };

    $scope.createTopic = function() {
      if ($scope.currUsrActive) {
        $location.path('/');
      } else {
        $scope.showModal = true;
      }
    };

    $scope.openRegisterPage = function(mode) {
      if(mode) {
        return;
      } else {
        $location.path("/user:register");
      }
    };
});