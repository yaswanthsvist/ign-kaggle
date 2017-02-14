angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$http,$rootScope) {

})
.controller('pieCtrl', function($scope,$http,$state,Platforms) {
  $scope.$on("$ionicView.enter",function(event,data){
    $scope.platforms=Platforms.get();
    var data=[];
    var platforms=Object.keys($scope.platforms);
    for(var i=0;i<platforms.length;i++){
      var col=[];
      col.push(platforms[i]);
      col.push($scope.platforms[platforms[i]].games);
      data.push(col);
    }
    var chart = c3.generate({
      bindto: '#chartpie',
      size:{
        height:540
      },
      data: {
          columns: data,
          type : 'pie',
          onclick: function (d, i) {
            console.log(d.id);
            $state.go("tab.platform",{"platform":d.id});
            console.log("onclick", d, i); },
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

  });


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
        height:440
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
  /*  var chart = c3.generate({
      bindto: '#chartpieGen',
      size:{
        height:540
      },
      data: {
          columns: [
              ['data1', 30],
              ['data2', 120]
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
*/
    $http({
          method: 'POST',
          data:{},
          url: $rootScope.ip+'/genres'
        }).then(
          function successCallback(response) {
//            console.dir(response);
            //   $rootScope.platforms=response["data"];
            //   $scope.platforms=response["data"];
            //   var data=[];
            //   var platforms=Object.keys($scope.platforms);
            //   for(var i=0;i<platforms.length;i++){
            //     if(platforms[i]=="NaN")
            //       continue;
            //     var col=[];
            //     col.push(platforms[i]);
            //     col.push($scope.platforms[platforms[i]].games);

            //     data.push(col);
            // }
            // console.dir(data);

            // chart.unload({ids:"data1"});
            // chart.unload({ids:"data2"});
            // chart.load({columns:data});
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
        height:440
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
  var platforms=null;
  var year=null;

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
            if(response.data.platforms.z){
              z=response.data.platforms.z;
              for(var i=0;i<z.length;i++){
                console.log(z[i]);
                if(z[i]==1){
                  z[i]=3;
                }
                if(z[i]==0.5){
                  z[i]=1;
                }
                

              }
              console.dir(z);
            }else{
              for(var i=0;i<year.length;i++){
                z[i]=1;
              }
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
                hoverinfo:"z",
                colorscale:["red","green"],
                zmin:0,
                zmax:3,
                dx:1,
                zauto:false,
                xbins:{
                  start:1990,
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
.controller('ChatsCtrl', function($scope,$state,Platforms,$ionicLoading,$http,$rootScope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.enter', function(e) {
      $http({
        method: 'POST',
        data:{},
        url: $rootScope.ip+'/platforms'
      }).then(
        function successCallback(response) {
          $rootScope.platforms=response["data"];
          Platforms.set(response["data"]);
        },
        function errorCallback(response) {
      });
  });
  
  $scope.goto=function(p,obj){
    if(obj==null||obj==undefined)
      $state.go(p);
    else
      $state.go(p,obj);
  }
 })

.controller('ChatDetailCtrl', function($scope, $stateParams) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('platformCtrl', function($scope,$state,$stateParams,Platforms) {
  $scope.$on("$ionicView.beforeEnter",function(event,data){
    console.log($stateParams.platform);
    if($stateParams.platform!=null){
      platforms=Platforms.get();
      $scope.platform=platforms[$stateParams.platform];
      console.dir($scope.platform);
      var data=[];
      var gener=Object.keys($scope.platform.gener);
      for(var i=0;i<gener.length;i++){
        var col=[];
        col.push(gener[i]);
        col.push($scope.platform.gener[gener[i]]);
        data.push(col);
      }
      var chart = c3.generate({
        bindto: '#chartPlat',
        size:{
          height:540
        },
        data: {
            columns: data,
            type : 'pie',
            onclick: function (d, i) {
              console.dir(d);
              //$state.go("tab.platform",{"platform":d.id});
              console.log("onclick", d, i); },
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

    }
    $scope.toInt=function(x){
      return parseInt(x*10)/10;
    }
  });
})
;
