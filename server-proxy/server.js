var proxy = require('express-http-proxy');
var os = require('os');
var express = require('express');
const bodyParser = require('body-parser');

var app = express();

// proxy name, port and route
var proxyHost = os.hostname();
var proxyPort = process.env.PORT || 8081;
var proxyRoute = '/proxy'

// target host
var targetHost = 'localhost:8080'
 
/*
 * set-up proxy so that all requests to
 * proxyhost:port/proxy will be redirected to
 * targethost
 *
 * For example requests to:
 * http://hostA/proxy/myPath
 * may be redirected to:
 * http://hostB/myPath
 */
app.use('/proxy', proxy(targetHost, {
  forwardPath: function(req, res) {
    return require('url').parse(req.url).path;
  }
}));

app.use(express.static('app'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// start our server
app.listen(proxyPort);

console.log('Proxy server started on port ' + proxyPort);
console.log('Requests to:  \'' + proxyHost + ':' + proxyPort + proxyRoute + '/my-path\'');
console.log('Re-directed to: \'' + targetHost + '/my-path\'');
