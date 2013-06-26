var fs = require('./nota-bene');

var buf = new Float32Array(1024 * 1024);
for(var x = 0; x < buf.length; x++){
	buf[x] = Math.sin((x / 1024 * 1024) * Math.PI * 2)
}
fs.mkdir('/tmp', function(err){
	if(err) console.log(err)
	else{
		fs.writeFile('/tmp/pipeTest', buf, function(err){
			if(err) console.log(err)
			var ws = fs.createWriteStream('/tmp/pip')
			var rs = fs.createReadStream('/tmp/pipeTest')
			rs.pipe(ws)
			ws.on('data', function(data){
				console.log(data)
			})
			setTimeout(function(){
				fs.readFile('/tmp/pip', 'arraybuffer', function(err, file){
					console.log('pipetest', err, file)
				})
			}, 1000)
		})		
	}
})


var ws = fs.createWriteStream('tempeth3')
ws.on('error', function(err){console.log(err)})

for(var y = 0; y < 5; y++){
	ws.write(new Blob([buf]))
	console.log('write!')			
}

fs.write('testbed', 'a string is the thing', 0, 8, null, function(err, written, buf){
	console.log(err, written, buf)
	fs.readFile('testbed', 'utf8', function(err, file){
		console.log(file) // should be "a string"
		fs.rename("testbed", '/tmp/test.txt', function(err){
			console.log(err || 'success')
		})
	})
})

fs.writeFile('testbed2', 'a string is the thing', function(err, written, buf){
	console.log(err, written, buf)
	fs.readFile('testbed2', 'utf8', function(err, file){
		console.log(file) // should be "a string is the thing"
		fs.unlink('testbed2', function(err){
			console.log(err) // null
		})
	})
})


setTimeout(function(){
	
	var rs = fs.createReadStream('tempeth3')
	rs.on('data', function(data){
		console.log('read!')
	})

}, 1000)


function errorHandler(err){
	console.log(err)
}
