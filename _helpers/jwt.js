const expressJwt = require('express-jwt');
const config = require('config.json');

module.exports = jwt;

function jwt() {

    // const secret = fs.readFileSync('/path/to/public.pub');
    const secret = config.secret;

    // public routes
    return expressJwt({ secret }).unless({
        path: [
            '/users/authenticate',
            '/users/register'
        ]                                                     
    });
}