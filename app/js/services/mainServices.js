'use strict';

playlistMakerApp
  .service("playlistService", function ($localStorage, $location) {
    //Service to save data in local storage in nested form.
    this.saveData = function(parentKey, key, data) {
      var newData = {};
      $localStorage[parentKey] = $localStorage[parentKey] || {};
      newData[key] = data;
      $localStorage[parentKey] = angular.extend($localStorage[parentKey], newData);
    };

    //Service to save data in local storage direct. 
    this.saveParentObj = function(key, data) {
      $localStorage[key] = data;
    }

    //Get data from local storage
    this.getData = function(key) {
      var storage = $localStorage;
      return (storage[key] || 0);
    };

    //Reset local storage
    this.resetStorage = function() {
      $localStorage.$reset();
    };
  })

  //Function to get data from JSON. We are using this function to show playlist initially
  .factory("MockData", function ($http) {
    var getData = function () {
      return $http.get('js/mockData.json');
    }
    return {
      get: getData
    };
});