// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Define server port
var port = 3000;

//Instaniate server
var httpServer = http.createServer(function(req,res) {

  // Parse URL and get the path needed
  var parseUrl = url.parse(req.url, true);
  var path = parseUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');
  // Get the query string as an object
  var queryStringObject = parseUrl.query;
  // Get HTTP method
  var method = req.method.toLowerCase()
  // Get header as an object
  var headers = req.headers;
  // Get the payload
  var decoder = new StringDecoder('utf-8')
  var buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();
    // Route the request to the right chosenHandler
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    // Construct object to handlers
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    }
    // Route the request to the handler specifed in the router
    chosenHandler(data, function(statusCode, payload) {
      statusCode = typeof(statusCode) == 'number' ? statusCode: 200;
      payload = typeof(payload) == 'object' ? payload : {}

      payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log('returning response', statusCode, payloadString)
    })
  })
})

// Start the server

httpServer.listen(port, function() {
  console.log("The server is listening on port 3000")
})

// Define handlers

var handlers = {};

handlers.hello = function (data, callback) {
  callback(200, {'Welcome Message': 'Happy 2019!'});
};

handlers.notFound = function (data, callback) {
  callback(404);
};

var router = {
  'hello': handlers.hello
};
