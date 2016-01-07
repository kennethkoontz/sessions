angular
  .module('app', [
    'ui.router',
    'ngStorage'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: '/login.html',
        controller: 'LoginCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: '/register.html',
        controller: 'RegisterCtrl'
      })
      .state('main', {
        templateUrl: '/session.html'
      })
      .state('main.session', {
        url: "/session/:id",
        views: {
          sessions: {
            controller: "SessionsCtrl",
            templateUrl: "sessions.html",
            resolve: {
              sessions: function ($http) {
                return $http({
                  method: 'get',
                  url: '/sessions'
                }).then(function (res) {
                  return res.data;
                });
              }
            }
          },
          members: {
            controller: "MembersCtrl",
            templateUrl: "members.html",
            resolve: {
              session: function ($http, $stateParams) {
                return $http({
                  method: 'get',
                  url: '/sessions/' + $stateParams.id
                }).then(function (res) {
                  return res.data;
                });
              }
            }
          },
          blocks: {
            controller: "BlocksCtrl",
            templateUrl: '/blocks.html',
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
            },
          }
        }
      });
    $urlRouterProvider.otherwise('/session/');
  })
  .controller('BlocksCtrl', function ($scope, $http, $stateParams, $state, $sessionStorage, blocks, session, sessions) {
    if ($stateParams.id == '' && sessions.length > 0)
      $state.go('main.session', {id: sessions[0]._id});

    socket.emit('enter-room', {session_id: $stateParams.id, user_id: $sessionStorage.user._id});
    $scope.session = session;
    $scope.blocks = blocks;
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
  })
  .controller('MembersCtrl', function ($scope, session) {
    $scope.session = session;
  })
  .controller('SessionsCtrl', function ($scope, $http, $state, $stateParams, sessions) {
    $scope.newSession = {};
    $scope.sessions = sessions;

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
  })
  .controller('LoginCtrl', function ($scope, $http, $sessionStorage, $state) {
    $scope.form = {};

    $scope.submit = function () {
      $http({
        method: 'post',
        url: '/authenticate',
        data: $scope.form
      }).then(function (res) {
        $sessionStorage.token = res.data.token;
        $sessionStorage.user = res.data.user;
        $state.go('main.session');
      }, function (err) {
        // TODO let user know that it's a bad user password combo
        $sessionStorage.$reset();
      });
    };
  })
  .controller('RegisterCtrl', function ($scope, $http) {
    $scope.form = {};
    $scope.submit = function () {
      $http({
        method: 'post',
        url: '/users',
        data: $scope.form
      }).then(function (res) {
        console.log(res)
      }, function (err) {
        console.log(err);
      });
    };
  });
