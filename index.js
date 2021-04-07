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

const app = new koa();
app.use(route.get('/signup', async (ctx) => {
    const result = await signUp(ctx.header).catch((err) => {
        console.log(err)
    });
    ctx.body = result.token
}));

app.listen(config.server.port);

function signUp(header) {
    return new Promise(function (fulfill, reject) {
        client.connect(err => {
            if (err || header === undefined) {
                reject({message: err})
            }
            let username = header.username;
            let password = header.password;
            if (username.length < 3 || password.length < 3) {
                reject({message: 'username or password too short'})
            }
            const collection = client.db("piarka").collection("users");
            collection.find({"username": username}).toArray(function (err, reply) {
                if (reply[0] === undefined && (err === null || err === undefined)) {
                    const data = {sub: username, iss: 'piarch_a'};
                    const options = {algorithm: 'RS256', expiresIn: (10 * 60 * 60)};
                    collection.insertMany([{"username": username, "password": password}],  (err, reply) => {
                        if (err) {
                            reject({message: err})
                        } else {
                            delete reply._id
                            reply.token = jwt.sign(data, private_key, options);
                            fulfill(reply)
                        }
                    });
                } else {
                    reject({message: 'This user already exist'})
                }
            })
        })

    })
}
