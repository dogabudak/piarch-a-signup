/**
 * Created by doga on 22/10/2016.
 */


const mongojs = require('mongojs'),
    jwt = require('jsonwebtoken'),
    config = require('./resources/config.js'),
    db = mongojs(config.mongo.url, ['users']),
    fs = require('fs'),
    private_key = fs.readFileSync('./keys/' + 'piarch_a'),
    koa = require('koa'),
    route = require('koa-route');

var app = koa();

app.use(route.get('/signup', newSignup));

app.listen(config.server.port);

function * newSignup() {
    this.body = yield signUp(this.header);
}
function signUp(req) {
    return new Promise(function (fulfill, reject) {
        var username = req.username;
        var password = req.password;
        if (username.length < 3 || password.length < 3) {
            fulfill(null)
        }

        db.users.find({"username": username}, function (err, reply) {
            if (reply[0] === undefined) {
                if ((err === null || err === undefined)) {
                    var data = {
                            sub: username,
                            iss: 'piarch_a'
                        },
                        options = {
                            algorithm: 'RS256',
                            expiresIn: (10 * 60 * 60),
                        };
                    db.users.insert({"username": username, "password": password}, function (err, reply) {
                        if (err) {
                          reject({})
                          //TODO handle errors
                        } else {
                            delete reply._id
                            reply.token = jwt.sign(data, private_key, options);
                            fulfill(reply)
                        }
                    })
                } else {
                    reject({})
                }
            }
            else {
                reject({})
            }
        })
    })
}
