// var a = require("./greet");
// var util = require("util");
// console.log(">>> ", a);

// import * as greeter from "greet"

// greeter.greet();


// var name = "suresh";
// var greetOlder = "Hello : " + name;
// var greetEs6 = `Hello : ${name}`;	//	can be multi line
// console.log(greetOlder);
// console.log(greetEs6);

// var alphanumeric = new Buffer("H", "utf8");
// var alphanumericJap = new Buffer("ぁ", "utf8");

// console.log(alphanumeric);
// console.log(alphanumericJap)


// var fs = require('fs');
// var readable = fs.createReadStream(__dirname + '/greet.txt', { encoding: 'utf8', highWaterMark: 16 * 1024 });
// var writable = fs.createWriteStream(__dirname + '/greetcopy.txt');

// readable.on('data', function(chunk) {
// 	writable.write(chunk);
// });


var http = require('http');
var fs = require("fs");
http.createServer(function(req, res){
    res.writeHead(200, {"Content-Type": "text/html"});
    // var content = fs.readFileSync(__dirname + "/test.html");
    // res.end(content);

    // fs.readFile(__dirname + "/test.html", function(err, data){
    //     res.end(data);
    // });

    fs.createReadStream(__dirname + "/test.html").pipe(res);  
    
}).listen(1234, '127.0.0.1');
