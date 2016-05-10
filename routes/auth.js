var express = require('express');
var router = express.Router();

var qs = require('querystring');
var request = require('request');
var User = require('../models/user');


router.post('/github', (req, res) => {
    console.log('req.body: ', req.body);

    var accessTokenUrl = 'https://github.com/login/oauth/access_token';
    var userApiUrl = 'https://api.github.com/user';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: process.env.GITHUB_SECRET
    };

    // use code to request access token
    request.get({
        url: accessTokenUrl,
        qs: params
    }, (err, response, accessToken) => {
        if (err) return res.status(400).send(err);

        var accessToken = qs.parse(accessToken);
        console.log('accessToken: ', accessToken);
        var headers = {
            'User-Agent': 'Satellizer'
        };

        // use access token to request user's information
        request.get({
            url: userApiUrl,
            qs: accessToken,
            headers: headers,
            json: true
        }, (err, response, profile) => {
            if (err) return res.status(400).send(err);
            console.log('profile: ', profile);
                User.findOne({
                    github: profile.id
                }, (err, existingUser) => {
                    if (err) return res.status(400).send(err);
                    if (existingUser) {
                        var token = existingUser.makeToken();
                        console.log('token: ', token);
                        res.send({
                            token: token
                        });
                    } else {
                        var user = new User();
                        user.github = profile.id;
                        // user.picture = profile.avatar_url;
                        user.save((err, savedUser) => {
                            var token = savedUser.makeToken();
                            console.log('token: ', token);
                            res.send({
                                token: token
                            });
                        });
                    }
                });
        })
    })
});
router.post('/facebook', (req, res) => {
    console.log('req.body: ', req.body);

    var accessTokenUrl = 'https://github.com/login/oauth/access_token';
    var userApiUrl = 'https://api.github.com/user';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: process.env.GITHUB_SECRET
    };

    // use code to request access token
    request.get({
        url: accessTokenUrl,
        qs: params
    }, (err, response, accessToken) => {
        if (err) return res.status(400).send(err);

        var accessToken = qs.parse(accessToken);
        console.log('accessToken: ', accessToken);
        var headers = {
            'User-Agent': 'Satellizer'
        };

        // use access token to request user's information
        request.get({
            url: userApiUrl,
            qs: accessToken,
            headers: headers,
            json: true
        }, (err, response, profile) => {
            if (err) return res.status(400).send(err);
            console.log('profile: ', profile);
                User.findOne({
                    github: profile.id
                }, (err, existingUser) => {
                    if (err) return res.status(400).send(err);
                    if (existingUser) {
                        var token = existingUser.makeToken();
                        console.log('token: ', token);
                        res.send({
                            token: token
                        });
                    } else {
                        var user = new User();
                        user.github = profile.id;
                        // user.picture = profile.avatar_url;
                        user.save((err, savedUser) => {
                            var token = savedUser.makeToken();
                            console.log('token: ', token);
                            res.send({
                                token: token
                            });
                        });
                    }
                });
        })
    })
});

module.exports = router;
