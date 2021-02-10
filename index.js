/**
 * Created by doga on 22/10/2016.
 */


const jwt = require('jsonwebtoken');
const config = require('./resources/config.js');
const fs = require('fs');
const private_key = fs.readFileSync('./keys/' + 'piarch_a');
const koa = require('koa');
const route = require('koa-route');

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(config.mongo.url, {useNewUrlParser: true});

const app = koa();
app.use(route.get('/signup', newSignup));

app.listen(config.server.port);

function* newSignup() {
    this.body = yield signUp(this.header);
}

function signUp(req) {
  return new Promise(function (fulfill, reject) {
    client.connect(err => {
      var username = req.username;
      var password = req.password;
      console.log(username, password)
      if (username.length < 3 || password.length < 3) {
        fulfill(null)
      }
      const collection = client.db("piarka").collection("users");
        collection.find({"username": username}).toArray(function (err, reply) {
        if (reply[0] === undefined) {
          if ((err === null || err === undefined)) {
          var data = {sub: username, iss: 'piarch_a'}, options = {algorithm: 'RS256', expiresIn: (10 * 60 * 60)};
            collection.insertMany([{"username": username, "password": password} ], function (err, reply) {
              if (err) {
                reject({})
                //TODO handle errors
                } else {
                  delete reply._id
                  reply.token = jwt.sign(data, private_key, options);
                  fulfill(reply)
                }
              });
              } else {
                reject({})
              }
              } else {
                reject({})
              }
            })
        })

    })
}
