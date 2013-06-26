# Nota Bene

A partial clone of Node.j's fs module (including streams) for the browser File System API. Currently, only asynchronous methods are provided, per the File System API (sync is in the spec but not supported yet). All methods copy Node's FS module. Use with browserify.

__Nota Bene__ uses [through](https://github.com/dominictarr/through) to expose read and write streams.

## Methods
* createWriteStream
* createReadStream
* writeFile
* write
* unlink
* rename (aka mv)
* read
* readdir
* mkdir
* rmdir
* stat

There is also a helper method for the File System API.
* setStorage(type, size) 

Calling this method with reinit he fs for you in private. The defaults are 
```js
type = window.PERMANENT // otherwise window.TEMPORARY
size = 1024 * 1024 * 1024 // in bytes
```

## usage
```
npm install nota-bene
```
Then use it as you would the FS module
```js
var fs = require('nota-bene')
fs.createWriteStream('/tmp/audio.raw')
fs.write(data)
```

## Tests

Currently the test is an example with some logging.
It can be run like so:

First install browserify and opa
```
npm install -g browserify opa
```
Then:
```
git clone https://github.com/NHQ/nbfs
cd nbfs
opa -n -e test.js
```
you can pass a port number:
```
opa -n -e test.js -p 5000
```

