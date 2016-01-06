angular
  .module('app', [
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('session', {
        url: "/session/:id",
        controller: "SessionCtrl",
        templateUrl: "/session.html",
        resolve: {
          blocks: function ($http, $stateParams) {
            return $http({
              method: 'get',
              url: '/blocks',
              params: {
                session: $stateParams.id
              }
            }).then(function (res) {
              return res.data;
            });
          },
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
  .controller('SessionCtrl', function ($scope, $http, $state, $stateParams, sessions, session, blocks) {
    if (!$stateParams.id && sessions.length) {
      $state.go('session', {id: sessions[0]._id});
      return;
    }
    socket.emit('enter-room', {session_id: $stateParams.id, user_id: '566f54028750c50d3fb227f1'});
    $scope.newSession = {};
    $scope.sessions = sessions;
    $scope.session = session;
    $scope.blocks = blocks;

    $scope.activateNewSession = function () {
      $scope.newSession.active = true;
    };

    $scope.createSession = function (e) {
      if (e.keyCode === 13) {
        $http({
          method: 'post',
          url: '/sessions',
          data: $scope.newSession
        })
          .then(function (res) {
            $scope.sessions.push(res.data);
            $scope.newSession = {};
          });
      }
    };

    $scope.shareSessionLink = function () {
      $scope.link = $scope.session.link;
    };

    $scope.createBlock = function (session) {
      $http({
        url: '/blocks',
        method: 'post',
        data: {
          session: session._id
        }
      }).then(function (res) {
        $scope.blocks.push(res.data);
      });
    };

    $scope.stopBlock = function (block) {
      $http({
        url: '/blocks/' + block._id,
        method: 'patch',
        data: {
          status: 'active'
        }
      }).then(function (res) {
        block.status = res.data.status
      })
    };

    $scope.endBlock = function (block) {
      $http({
        url: '/blocks/' + block._id,
        method: 'patch',
        data: {
          status: 'closed'
        }
      }).then(function (res) {
        block.status = res.data.status
      });
    };
  });
