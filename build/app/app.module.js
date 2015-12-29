angular
  .module('app', [
    'ui.router'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('session', {
        url: "/session/:id",
        controller: "SessionCtrl",
        templateUrl: "/session.html",
        resolve: {
          session: function ($http, $stateParams) {
            return $http({
              method: 'get',
              url: '/sessions/' + $stateParams.id
            }).then(function (res) {
              return res.data;
            });
          },
          sessions: function ($http) {
            return $http({
              method: 'get',
              url: '/sessions'
            }).then(function (res) {
              return res.data;
            });
          }
        }
      });
    $urlRouterProvider.otherwise('/session/');
  })
  .controller('SessionCtrl', function($scope, $http, sessions, session) {
    $scope.newSession = {};
    $scope.sessions = sessions;
    $scope.session = session;

    $scope.activateNewSession = function() {
      $scope.newSession.active = true;
    };

    $scope.createSession = function(e) {
      if (e.keyCode === 13) {
        $http({
          method: 'post',
          url: '/sessions',
          data: $scope.newSession
        })
          .then(function(res) {
            $scope.sessions.push(res.data);
            $scope.newSession = {};
          });
      }
    };

    $scope.shareSessionLink = function() {
      $scope.link = $scope.session.link;
    };
  });
