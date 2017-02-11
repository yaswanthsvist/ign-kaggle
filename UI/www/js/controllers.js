angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$http,$rootScope) {

})
.controller('pieCtrl', function($scope,$http,$rootScope) {
    var chart = c3.generate({
      bindto: '#chartpie',
      size:{
        height:640
      },
      data: {
          columns: [
              ['data1', 30],
              ['data2', 120],
          ],
          type : 'pie',
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      },
      pie: {
          label: {
              format: function (value, ratio, id) {
                  return d3.format('')(value);
              }
          }
      }

    });

    $http({
          method: 'POST',
          data:{},
          url: $rootScope.ip+'/platforms'
        }).then(
          function successCallback(response) {
            console.dir(response);
            $rootScope.platforms=response["data"];
            $scope.platforms=response["data"];
            var data=[];
            var platforms=Object.keys($scope.platforms);
            for(var i=0;i<platforms.length;i++){
              var col=[];
              col.push(platforms[i]);
              col.push($scope.platforms[platforms[i]].games);

              data.push(col);
            }
            console.dir(data);

            chart.unload({ids:"data1"});
            chart.unload({ids:"data2"});
            chart.load({columns:data});
          },
           function errorCallback(response) {
          }
        );

})
.controller('barCtrl', function($scope,$http,$rootScope) {
  console.log("barCtrl");
    var data=[];
      var col=['x'];
      var games=["games"];
    var platforms=Object.keys($rootScope.platforms);
    for(var i=0;i<platforms.length;i++){
      col.push(platforms[i]);
      games.push($rootScope.platforms[platforms[i]].games);
    }
      data.push(col);
      data.push(games);
    console.dir(data);

    var chart = c3.generate({
      bindto: '#chart',
      size:{
        height:640
      },
      data: {
        x : 'x',
        columns:data,
        type: 'bar'
      },
      axis: {
          x: {
              type: 'category', // this needed to load string x value
              tick: {
                fit: true
              }
          }

      }

    });

})
.controller('pieGenCtrl', function($scope,$http,$rootScope) {
  console.log("pieGenCtrl");
    var chart = c3.generate({
      bindto: '#chartpieGen',
      size:{
        height:640
      },
      data: {
          columns: [
              ['data1', 30],
              ['data2', 120],
          ],
          type : 'pie',
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      },
      pie: {
          label: {
              format: function (value, ratio, id) {
                  return d3.format('')(value);
              }
          }
      }

    });

    $http({
          method: 'POST',
          data:{},
          url: $rootScope.ip+'/genres'
        }).then(
          function successCallback(response) {
            console.dir(response);
            $rootScope.platforms=response["data"];
            $scope.platforms=response["data"];
            var data=[];
            var platforms=Object.keys($scope.platforms);
            for(var i=0;i<platforms.length;i++){
              var col=[];
              col.push(platforms[i]);
              col.push($scope.platforms[platforms[i]].games);

              data.push(col);
            }
            console.dir(data);

            chart.unload({ids:"data1"});
            chart.unload({ids:"data2"});
            chart.load({columns:data});
          },
           function errorCallback(response) {
          }
        );

})
.controller('barGenCtrl', function($scope,$http,$rootScope) {
  console.log("barGenCtrl");
    var data=[];
      var col=['x'];
      var games=["games"];
    var platforms=Object.keys($rootScope.platforms);
    for(var i=0;i<platforms.length;i++){
      col.push(platforms[i]);
      games.push($rootScope.platforms[platforms[i]].games);
    }
      data.push(col);
      data.push(games);
    console.dir(data);

    var chart = c3.generate({
      bindto: '#chartGen',
      size:{
        height:640
      },
      data: {
        x : 'x',
        columns:data,
        type: 'bar'
      },
      axis: {
          x: {
              type: 'category', // this needed to load string x value
              tick: {
                fit: true
              }
          }

      }

    });

})
.controller('heatmapCtrl', function($scope,$http,$rootScope,$stateParams) {
  console.log("heatmapCtrl");

    $http({
          method: 'POST',
          data:{},
          url: $rootScope.ip+'/'+$stateParams.api,
        }).then(
          function successCallback(response) {
            console.dir(response);
            var platforms=response.data.platforms.platforms;
            var year=response.data.platforms.year;
            TESTER = document.getElementById('tester');
            var z=[];
            for(var i=0;i<year.length;i++){
              z[i]=1;
            }

            var data = [
              {
                x: year,
                y: platforms,
                z:z,
                xtype:"array",
                ytype:"array",
                autobinx:false,
                xgap:2,
                ygap:2,
                dx:1,
                xbins:{
                  start:1970,
                  end:2020,
                  size:1
                },
                type: 'histogram2d'
              }
            ];
            Plotly.plot( TESTER, data, {
            margin: { t: 0 } } );            
          },
           function errorCallback(response) {
          }
        );

})
.controller('releasesCtrl', function($scope,$http,$rootScope,$stateParams) {
  console.log("releasesCtrl");
    console.log($stateParams.type);
    $http({
          method: 'POST',
          data:{type:$stateParams.type},
          url: $rootScope.ip+'/releases',
        }).then(
          function successCallback(response) {
            console.dir(response);
            var x=response.data.x;
            var y=response.data.y;
            TESTER = document.getElementById('tester');
            var data = [
              {
                x: x,
                y: y,
                xtype:"array",
                ytype:"array",
                autobinx:false,
                xgap:2,
                dx:1,
                xbins:{
                  start:x[0],
                  end:x[x.length-1],
                  size:1
                },
                type: 'bar'
              }
            ];
            Plotly.plot( TESTER, data, {
            margin: { t: 0 } } );            
          },
           function errorCallback(response) {
          }
        );

})
.controller('ChatsCtrl', function($scope, Chats,$state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.goto=function(p,obj){
    if(obj==null||obj==undefined)
      $state.go(p);
    else
      $state.go(p,obj);
  }
 })

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
