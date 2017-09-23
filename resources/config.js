/**
 * Created by doga on 13/11/2016.
 */

module.exports = {
    'mongo': {
        url: 'mongodb://localhost:27017/users'
    },
    'server': {
        'port': 3016,
        'path': '/signup'
    },
    'redis': {
        'redis_ip': '127.0.0.1',
        'redis_port':6379,
        'db':4
    },
    'authnUrl': '127.0.0.1:3018'
}

