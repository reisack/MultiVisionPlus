(function() {
    'use strict';

    var passport = require('passport');

    exports.authenticate = function (req, res, next) {
        req.body.username = req.body.username.toLowerCase();
        var auth = passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                res.send({
                    success: false
                });
            } else {
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                });

                res.send({
                    success: true,
                    user: user
                });
            }

        });

        auth(req, res, next);
    };

    exports.requiresApiLogin = function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.status(403); // accès refusé
            res.end();
        } else {
            next();
        }
    };

    exports.requiresRole = function (role) {
        return function (req, res, next) {
            if (!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
                res.status(403); // accès refusé
                res.end();
            } else {
                next();
            }
        };
    };

})();