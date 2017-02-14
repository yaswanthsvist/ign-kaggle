angular.module('starter.services', [])

.factory('Platforms', function() {
  var platfoms =null;
  return {
    get: function() {
      return platfoms;
    },
    set: function(data) {
      platfoms=data;
    }
  };
})
.factory('Geners', function() {
  var geners =null;
  return {
    get: function() {
      return geners;
    },
    set: function(data) {
      geners=data;
    }
  };
});
