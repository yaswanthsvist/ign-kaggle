// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$rootScope,$http) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
//    $rootScope.ip="http://192.168.1.113:8099"
    $rootScope.ip="http://192.168.0.52:8099"
      $http({
    method: 'POST',
    data:{},
    url: $rootScope.ip+'/platforms'
  }).then(
    function successCallback(response) {
      console.dir(response);
      $rootScope.platforms=response["data"];
    },
     function errorCallback(response) {
    }
  );

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.pie', {
    url: '/pie',
    views: {
      'tab-chats': {
        templateUrl: 'templates/pie.html',
        controller: 'pieCtrl'
      }
    }
  })
  .state('tab.bar', {
    url: '/bar',
    views: {
      'tab-chats': {
        templateUrl: 'templates/bar.html',
        controller: 'barCtrl'
      }
    },
  })
  .state('tab.pieGen', {
    url: '/pieGen',
    views: {
      'tab-chats': {
        templateUrl: 'templates/pieGen.html',
        controller: 'pieGenCtrl'
      }
    }
  })
  .state('tab.barGen', {
    url: '/barGen',
    views: {
      'tab-chats': {
        templateUrl: 'templates/barGen.html',
        controller: 'barGenCtrl'
      }
    },
  })
  .state('tab.heatmap', {
    url: '/heatmap',
    params:{
      api:"begin"
    },
    views: {
      'tab-chats': {
        templateUrl: 'templates/heatmap.html',
        controller: 'heatmapCtrl'
      }
    }
  })
  .state('tab.releases', {
    url: '/releases',
    params:{
      type:"release_year"
    },
    views: {
      'tab-chats': {
        templateUrl: 'templates/releases.html',
        controller: 'releasesCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/chats');

});
