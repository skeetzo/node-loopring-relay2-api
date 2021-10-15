https://github.com/skeetzo/node-rest-client/blob/master/readme-old.md

npm install node-rest-client-VS


Client has two ways to call a REST service: direct or using registered methods



var Client = require('node-rest-client').Client;

var client = new Client();

// direct way
client.get("http://remote.site/rest/xml/method", function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// registering remote methods
client.registerMethod("jsonMethod", "http://remote.site/rest/json/method", "GET");

client.methods.jsonMethod(function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});



POST, PUT or PATCH method invocation are configured like GET calls with the difference that you have to set "Content-Type" header in args passed to client method invocation:

//Example POST method invocation
var Client = require('node-rest-client').Client;

var client = new Client();

// set content-type header and data as json in args parameter
var args = {
	data: { test: "hello" },
	headers: { "Content-Type": "application/json" }
};

client.post("http://remote.site/rest/xml/method", args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// registering remote methods
client.registerMethod("postMethod", "http://remote.site/rest/json/method", "POST");

client.methods.postMethod(args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

If no "Content-Type" header is set as client arg POST,PUT and PATCH methods will not work properly.



You can pass diferents args to registered methods, simplifying reuse: path replace parameters, query parameters, custom headers

var Client = require('node-rest-client').Client;

// direct way
var client = new Client();

var args = {
	data: { test: "hello" }, // data passed to REST method (only useful in POST, PUT or PATCH methods)
	path: { "id": 120 }, // path substitution var
	parameters: { arg1: "hello", arg2: "world" }, // this is serialized as URL parameters
	headers: { "test-header": "client-api" } // request headers
};


client.get("http://remote.site/rest/json/${id}/method", args,
	function (data, response) {
		// parsed response body as js object
		console.log(data);
		// raw response
		console.log(response);
	});


// registering remote methods
client.registerMethod("jsonMethod", "http://remote.site/rest/json/${id}/method", "GET");


/* this would construct the following URL before invocation
 *
 * http://remote.site/rest/json/120/method?arg1=hello&arg2=world
 *
 */
client.methods.jsonMethod(args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});


You can even use path placeholders in query string in direct connection:

var Client = require('node-rest-client').Client;

// direct way
var client = new Client();

var args = {
	path: { "id": 120, "arg1": "hello", "arg2": "world" },	
	headers: { "test-header": "client-api" }
};

client.get("http://remote.site/rest/json/${id}/method?arg1=${arg1}&arg2=${arg2}", args,
	function (data, response) {
		// parsed response body as js object
		console.log(data);
		// raw response
		console.log(response);
	});





To send data to remote site using POST or PUT methods, just add a data attribute to args object:

var Client = require('node-rest-client').Client;

// direct way
var client = new Client();

var args = {
	path: { "id": 120 },
	parameters: { arg1: "hello", arg2: "world" },
	headers: { "test-header": "client-api" },
	data: "<xml><arg1>hello</arg1><arg2>world</arg2></xml>"
};

client.post("http://remote.site/rest/xml/${id}/method", args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// registering remote methods
client.registerMethod("xmlMethod", "http://remote.site/rest/xml/${id}/method", "POST");


client.methods.xmlMethod(args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// posted data can be js object
var args_js = {
	path: { "id": 120 },
	parameters: { arg1: "hello", arg2: "world" },
	headers: { "test-header": "client-api" },
	data: { "arg1": "hello", "arg2": 123 }
};

client.methods.xmlMethod(args_js, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});






It's also possible to configure each request and response, passing its configuration as an additional argument in method call.

var client = new Client();

// request and response additional configuration
var args = {
	path: { "id": 120 },
	parameters: { arg1: "hello", arg2: "world" },
	headers: { "test-header": "client-api" },
	data: "<xml><arg1>hello</arg1><arg2>world</arg2></xml>",
	requestConfig: {
		timeout: 1000, //request timeout in milliseconds
		noDelay: true, //Enable/disable the Nagle algorithm
		keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
		keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
	},
	responseConfig: {
		timeout: 1000 //response timeout
	}
};


client.post("http://remote.site/rest/xml/${id}/method", args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});





If you want to handle timeout events both in the request and in the response just add a new "requestTimeout" or "responseTimeout" event handler to clientRequest returned by method call.



var client = new Client();

// request and response additional configuration
var args = {
	path: { "id": 120 },
	parameters: { arg1: "hello", arg2: "world" },
	headers: { "test-header": "client-api" },
	data: "<xml><arg1>hello</arg1><arg2>world</arg2></xml>",
	requestConfig: {
		timeout: 1000, //request timeout in milliseconds
		noDelay: true, //Enable/disable the Nagle algorithm
		keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
		keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
	},
	responseConfig: {
		timeout: 1000 //response timeout
	}
};


var req = client.post("http://remote.site/rest/xml/${id}/method", args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

req.on('requestTimeout', function (req) {
	console.log('request has expired');
	req.abort();
});

req.on('responseTimeout', function (res) {
	console.log('response has expired');

});

//it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
req.on('error', function (err) {
	console.log('request error', err);
});





Node REST client follows redirects by default to a maximum of 21 redirects, but it's also possible to change follows redirect default config in each request done by the client


var client = new Client();

// request and response additional configuration
var args = {
	requestConfig: {
		followRedirects:true,//whether redirects should be followed(default,true) 
		maxRedirects:10//set max redirects allowed (default:21)
	},
	responseConfig: {
		timeout: 1000 //response timeout
	}
};


















// no "isDefault" attribute defined 
var invalid = {
			   "name":"invalid-parser",
			   "match":function(response){...},
			   "parse":function(byteBuffer,nrcEventEmitter,parsedCallback){...}
			 };

var validParser = {
				   "name":"valid-parser",
				   "isDefault": false,
			   	   "match":function(response){...},
			       "parse":function(byteBuffer,nrcEventEmitter,parsedCallback){...},
			       // of course any other args or methods can be added to parser
			       "otherAttr":"my value",
			       "otherMethod":function(a,b,c){...}
				  };			

function OtherParser(name){
	   this.name: name,
	   this.isDefault: false,
	   this.match=function(response){...};
	   this.parse:function(byteBuffer,nrcEventEmitter,parsedCallback){...};
		
}

var instanceParser = new OtherParser("instance-parser");

//valid parser complete example

client.parsers.add({
						"name":"valid-parser",
						"isDefault":false,
						"match":function(response){
							// only match to responses with  a test-header equal to "hello world!"
							return response.headers["test-header"]==="hello world!";
						},							
						"parse":function(byteBuffer,nrcEventEmitter,parsedCallback){
							// parsing process
							var parsedData = null;
							try{
								parsedData = JSON.parse(byteBuffer.toString());
								parsedData.parsed = true;

								// emit custom event
								nrcEventEmitter('parsed','data has been parsed ' + parsedData);

								// pass parsed data to client request method callback
								parsedCallback(parsedData);
							}catch(err){
								nrcEmitter('error',err);
							};						

						});



































// no "isDefault" attribute defined 
var invalid = {
			   "name":"invalid-serializer",
			   "match":function(request){...},
			   "serialize":function(data,nrcEventEmitter,serializedCallback){...}
			 };

var validserializer = {
				   "name":"valid-serializer",
				   "isDefault": false,
			   	   "match":function(request){...},
			       "serialize":function(data,nrcEventEmitter,serializedCallback){...},
			       // of course any other args or methods can be added to serializer
			       "otherAttr":"my value",
			       "otherMethod":function(a,b,c){...}
				  };			

function OtherSerializer(name){
	   this.name: name,
	   this.isDefault: false,
	   this.match=function(request){...};
	   this.serialize:function(data,nrcEventEmitter,serializedCallback){...};
		
}

var instanceserializer = new OtherSerializer("instance-serializer");

// valid serializer complete example

client.serializers.add({
						"name":"example-serializer",
						"isDefault":false,
						"match":function(request){
							// only match to requests with  a test-header equal to "hello world!"
							return request.headers["test-header"]==="hello world!";
						},							
						"serialize":function(data,nrcEventEmitter,serializedCallback){
							// serialization process
							var serializedData = null;

							if (typeof data === 'string'){
								serializedData = data.concat(" I'm serialized!!");
							}else if (typeof data === 'object'){
								serializedData = data;
								serializedData.state = "serialized"
								serializedData = JSON.stringify(serializedData);
							}

							nrcEventEmitter('serialized','data has been serialized ' + serializedData);
							// pass serialized data to client to be sent to remote API
							serializedCallback(serializedData);

						}
	
})


