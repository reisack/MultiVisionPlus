angular.module('app')
    .factory('mvAuth', function($http, mvIdentity, mvUser, $q) {

        return {
            authenticateUser: function(username, password) {
                var dfd = $q.defer();
                $http.post('/login', {
                    username: username,
                    password: password
                }).then(function(response) {
                    if (response && response.data && response.data.success) {
                        var user = new mvUser();
                        angular.extend(user, response.data.user);
                        mvIdentity.currentUser = user;
                        dfd.resolve(true);
                    } else {
                        dfd.resolve(false);
                    }
                });

                return dfd.promise;
            },

            createUser: function(newUserData) {
                var newUser = new mvUser(newUserData);
                var dfd = $q.defer();

                newUser.$save().then(function() {
                    // On logue directement après création du compte
                    mvIdentity.currentUser = newUser;
                    dfd.resolve();
                }, function(response) {
                    dfd.reject(response.data.reason);
                });

                return dfd.promise;
            },

            updateCurrentUser: function(newUserData) {
                var dfd = $q.defer();

                // On update pas "currentUser" tant que la sauvegarde n'est pas entièrement correcte
                // On travaille donc avec une copie pendant la sauvegarde
                var clone = angular.copy(mvIdentity.currentUser);
                angular.extend(clone, newUserData);
                clone.$update().then(function() {
                    mvIdentity.currentUser = clone;
                    dfd.resolve();
                }, function(response) {
                    dfd.reject(response.data.reason);
                });

                return dfd.promise;
            },

            logoutUser: function() {
                var dfd = $q.defer();
                $http.post('/logout', {
                    logout: true
                }).then(function() {
                    mvIdentity.currentUser = undefined;
                    dfd.resolve();
                });

                return dfd.promise;
            },

            authorizeCurrentUserForRoute: function(role) {
                if (mvIdentity.isAuthorized(role)) {
                    return true;
                } else {
                    return $q.reject('not authorized');
                }
            },

            authorizeAuthenticatedUserForRoute: function() {
                if (mvIdentity.isAuthenticated()) {
                    return true;
                } else {
                    return $q.reject('not authorized');
                }
            }
        }
});