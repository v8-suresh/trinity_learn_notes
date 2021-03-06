* nodejs << v8-javascript engine << written in C++
* javascript is synchronous - only one line of code can run @ any time - single threaded
* v8 - also single threaded
* node js is asynchronous - multi threaded - libuv helps to achieve that. libuv is the EventLoop implementation of nodejs
* io.js is community  - more frequesnt updates based on v8 releases.
* nodejs 4.x.x is merge of io.js 3.x + nodejs 0.12

* CommonJS  - standards for javascript module system
* require argument - file path (absolute or relative)
	* .js in file name can be ignored

* every module have access to some local variaoble this, require, module, exports, \_\_dirname, \_\_filename

* \_\_proto\_\_  -  property which refers to prototype of every object in v8

# Prototypes in Javascript
```javascript
var Person = function(name){
  this.name = name;
}
Person.prototype.greet = function(){
	console.log("Hello..", this.name);
}
var suresh = new Person("Suresh");
var sadhana = new Person("Sadhana");
suresh.greet();	//	Hello.. Suresh
sadhana.greet();	//Hello.. Sadhana
console.log(suresh.__proto__ === sadhana.__proto__);	//	true
```

# Classical Inheritance in Javascript
```javascript
var Phone = function(number){
	this.number = number;
}
Phone.prototype.makeCall = function(){
	console.log("Making a call from # : ", this.number);
}
var SmartPhone = function(number){
	Phone.apply(this, arguments);
}

SmartPhone.prototype = new Phone();
SmartPhone.prototype.constructor = SmartPhone;

SmartPhone.prototype.sendMMS = function(){
	console.log('Sending MMS from # :  ', this.number);
}
var phone = new Phone(123);
var smartPhone = new SmartPhone(456);
var anotherSmartPhone = new SmartPhone(789);
phone.makeCall();
smartPhone.makeCall();
smartPhone.sendMMS();
anotherSmartPhone.makeCall();
anotherSmartPhone.sendMMS();
```
# extending javascript object another way - similar util.inherits
```javascript
var Phone = function(number){
	this.number = number;
}
Phone.prototype.makeCall = function(){
	console.log("Making a call from # : ", this.number);
}
var SmartPhone = function(number){
	Phone.apply(this, arguments);
}

SmartPhone.prototype = Object.create(Phone.prototype, {constructor: {value: SmartPhone}});

SmartPhone.prototype.sendMMS = function(){
	console.log('Sending MMS from # :  ', this.number);
}
var phone = new Phone(123);
var smartPhone = new SmartPhone(456);
var anotherSmartPhone = new SmartPhone(789);
phone.makeCall();
smartPhone.makeCall();
smartPhone.sendMMS();
anotherSmartPhone.makeCall();
anotherSmartPhone.sendMMS();
```
* SCOPE - wher in code we have access to particular object (function or object or any var)

# require - module - exports 
* no need to put .js - file extension
* require('./greet') does below things
	1. find and load "./greet.js" file
	2. if above not found - fin "./greet" folder and load "index.js" file under that folder
	3. If not found throw error.
* require function does below (for js file)
	1. reads our file and wraps it a immediately invoking function
	2. execute it and return the module.export object where module is one of the argument to the generated wrapper function.
```javascript
var summa = function(){
	console.log("Summa");
}
```
* translated to 
```javascript
function(exports, require, module, __dirname, __filename){
	var summa = function(){
		console.log("Summa");
	}
});
```
* execute the above function through "apply"
* returns module.exports
* __REVEALING MODULE PATTERN__ is revealing only the few properties/functions from module.exports - achieved through returning an object with limited properties	
* Use module.exports instead of assigning something to exports. mutation exports work but asgning a new object to exports does not work
```javascript
// its a javascript quirk
export = function(){
	console.log("test");
}
console.log(exports === module.exports);	//	false

export.test = "test";
console.log(exports === module.exports);	//	true 
```
* If a util named as same as core library (util for ex) - make  sure to use the relative path in require

# Node and ES6
* use node --harmony <js file> - to run in es6 mode
```javascript
// file greet.js
export function greet(){
    console.log("Greeting from ES6");
}
export function greet1(){
    console.log("Greeting 1 from ES6");
}
// file index.ja
import * as greeter from "greet"
greeter.greet();
greeter.greet1();
```
* babel.js  - shim for ES6 (ES 2015) - only for browser
## server side nodejs support can be achieved through __jsconfig.json__ file
```json
{
    "compilerOptions": {
        "target": "ES6"
    }
}
```
## Template Literal
```javascript
var name = "suresh";
var greetOlder = "Hello : " + name;
var greetEs6 = `Hello : ${name}`;	//	can be multi line
console.log(greetOlder);
console.log(greetEs6);
```
## ES6 classes
```javascript
'use strict';
module.exports = class Person {
	constructor(firstname, lastname) {
		this.firstname = firstname;
		this.lastname = lastname;
	}
	
	greet() {
		console.log('Hello, ' + this.firstname + ' ' + this.lastname);
	}
}

var john = new Person('John', 'Doe');
john.greet();

var jane = new Person('Jane', 'Doe');
jane.greet();

console.log(john.__proto__);
console.log(jane.__proto__);
console.log(john.__proto__ === jane.__proto__);
```
## ES6 typed arrays

## this on literals - always refers to the enclosing object literal - __call__ and __apply__ methods
```javascript
var xx = {
  name: "outer",
  outerPrint: function(){
    console.log("Outer Print : ", this.name);
	//console.log(this);
  },
  inner: {
    name: "Inner",
    innerPrint: function(){
      console.log("Inner Print : ", this.name);
    }
  }
};
xx.outerPrint();	//	outer
xx.inner.innerPrint();	//	inner

xx.outerPrint.call();	//	prints nothing	-	this refers to global here
xx.outerPrint.call({name: "External"});	// External
xx.inner.innerPrint.call();	//	prints nothing	-	this refers to global here 
xx.inner.innerPrint.call({name: "External for Inner call"});	// External for Inner call

xx.outerPrint.apply();	//	prints nothing	-	this refers to global here
xx.outerPrint.apply({name: "External"});	// External
xx.inner.innerPrint.apply();	//	prints nothing	-	this refers to global here 
xx.inner.innerPrint.apply({name: "External for Inner call"});	// External for Inner call

```
* apply expects arguments to passed as array - like XX.apply({}, [arg1, arg2, arg3...])
* call expects arguments to passed as additional arguments - like XX.call({}, arg1, arg2, arg3...)

# Events and EventEmitter
* Systems events(file read, file open and more - from C++, libuv),  Custom Events - as part of javascrpt code (Event Emitter)
* __MAgic Strings__ - using hard coded strings for event names - use externalized string constants for event names
* Object.create(null) - object creation without prototype = Object.create({}) - create object with prototype
## Event Emitter example 1
```javascript
var EventEmitter = require("events");
var util = require("util");
function MyConstructor(){
	EventEmitter.call(this);	//	to make sure properties added by EventEmitter to this object available for my object as well
	// blah blah blah
}
util.inherits(MyCOnstructor, EventEmitter);

var obj = new MyConstructor();
// obj.on, obj.emit - works

```
* Buffer COnstructor is available globally in nodejs- no need to do "require("buffer")"
```javascript
var buf = new Buffer('Hello', 'utf8');
console.log(buf);
console.log(buf.toString());
console.log(buf.toJSON());
console.log(buf[2]);

buf.write('wo');
console.log(buf.toString());
```
## File Read (streams and pipes)
```javascript
var fs = require('fs');
fs.readFileSync(<filepath>, <encoding>);
// if enconing is not passed data arg will be a buffer
fs.readFile(<filepath>, <encoding>, function(err, data{
})); // callback is error first callback

```
* above code eats memory because buffer is in heap
* Stream classes in node are nearly abstract
* Streams inherits from EventEmitter
* Many types of streams(implementations) available like readable, writable, duple, transform, passthrough streams
	1.	Readable Stream- only allows reading the stream bu cannot write
	2.	Writable Stream - Opposite of Readable stream - can write but cannot read
	3.	Duplex Stream - can do read and write both
	4.	Transform Stream - Changing the data as is passes through stream
	5.	passthrough stream - 
### read write through stream example	
```javascript
var fs = require('fs');
var readable = fs.createReadStream(__dirname + '/greet.txt', { encoding: 'utf8', highWaterMark: 16 * 1024 });
var writable = fs.createWriteStream(__dirname + '/greetcopy.txt');
readable.on('data', function(chunk) {
	writable.write(chunk);
});
```
* pipes are way to connect 2 streams - pipes can be chained - pipes are chaining methods mostly
```javascript
var fs = require('fs');
var zlib = require('zlib');
var readable = fs.createReadStream(__dirname + '/greet.txt');
var writable = fs.createWriteStream(__dirname + '/greetcopy.txt');
var compressed = fs.createWriteStream(__dirname + '/greet.txt.gz');
var gzip = zlib.createGzip();
readable.pipe(writable);
```

# http
* node internally ises "http-parser" - C library for http handling
```javascript
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
```

# NPM 
* package manager for NodeJS


# Express
```javascript
var express = require('express');
var app = express();
app.get("/", function(req, res){
	res.json({test: "test"});
})
app.listen(3000);
```
## route and mire
```javascript
app.get('/', function(req, res) {
	res.send('<html><head></head><body><h1>Hello world!</h1></body></html>');
});

app.get('/person/:id', function(req, res) {
	res.send('<html><head></head><body><h1>Person: ' + req.params.id + '</h1></body></html>');
});

app.get('/api', function(req, res) {
	res.json({ firstname: 'John', lastname: 'Doe' });
});

var mymiddleware = function(req, res. next){
	console.log("Middleware hit");
	next();
}
//app.get('/', mymiddleware);
app.use(mymiddleware);	//	for all the requests

```

# Templates

