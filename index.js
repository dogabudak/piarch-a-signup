/**
 * Created by doga on 22/10/2016.
 */


const mongojs = require('mongojs'),
    jwt = require('jsonwebtoken'),
    config = require('./resources/config.js'),
    db = mongojs(config.mongo.url, ['users']),
    connect = require('connect'),
    fs = require('fs'),
    private_key = fs.readFileSync('./keys/' + 'piarch_a'),
    koa = require('koa'),
    route = require('koa-route');

var app = koa();

app.use(route.get('/signup', newSignup));
//app.use(route.get('/update', update));


app.listen(config.server.port);
/*
 function * update() {
 console.log(this.header)
 this.body = yield updateUser(this.header);
 }
 */

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
                            console.log(err)
                        } else {
                            delete reply._id
                            reply.token = jwt.sign(data, private_key, options);
                            console.log(reply)
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

/*
 function updateUser(req) {
 return new Promise(function (fulfill, reject) {
 var username;
 var obj = JSON.parse(req.obj)
 //let tokeninfo = yield checkToken("news_yorum", es_query, self.req.auth_payload,commentOption);

 db.users.find({"username": username}, function (err, reply) {
 if (reply === null || reply === undefined || reply.length === 0) {
 db.users.update({"username": username}, {$set: obj}, function (err, reply) {
 if (err === null || err === undefined) {
 fulfill(reply)
 }
 })
 } else {
 reject()
 }
 })

 })
 }
 */
/*
 function checkToken() {
 var authorize = this.headers.authorize;
 if (!authorize) {
 this.throw(' request ip is: ' + this.req.connection.remoteAddress, 400);
 }
 if (authorize.split(' ').length !== 2) {
 this.throw(' request ip is: ' + this.req.connection.remoteAddress, 400);
 }
 var response = yield http(config.authnUrl, {json: true, headers: {'Authorize': authorize}});
 var answer = response.body;
 if (response.statusCode === 200 && answer.authenticated === true) {
 yield* next;
 } else {
 this.throw(401);
 }
 }
 */
