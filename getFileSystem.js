var through = require('through');

window._fs = null;

module.exports = function(cb){
	if(window._fs) cb(null, window._fs)
	else{
		
		getFileSystem(function(err, fs){
			
			fs.createWriteStream = createWriteStream
			fs.readdir = readdir
			fs.mkdir = mkdir
			fs.rmdir = rmdir
			fs.createReadStream = createReadStream
			
			if(err) cb(err, null);
			else{
				window._fs = fs;
				cb(null, fs)
			}
		})	
	}
}

function write(){
	
}

function readdir(path, cb){
	this.root.getDirectory(path, {create: false}, success, error)
	
	function success(dir){
		var reader = dir.createReader();
		reader.readEntries(function(results){
			cb(null, results)
		}, error)
	}
	
	function error(err){
		cb(err, null)
	}

}

function mkdir(path, cb){

	this.root.getDirectory(path, {create: true}, success, error);

	function success(dir){
		cb(null, dir)
	}

	function error(err){
		cb(err, null)
	}

}

function rmdir(path, cb){
		
	this.root.getDirectory(path, {create: false}, success, error);

	function success(dir){
		dir.remove(function(){
			cb(null)
		}, error)
	}

	function error(err){
		cb(err, null)
	}
	
}

function createReadStream(path, opts){
	
	var encoding = null;
	if(typeof opts == 'string'){
		encoding = String(opts).toLowerCase();
		opts = Object.create(null)
	}
	
	opts = opts || Object.create(null)

	var stream = through()
	
	stream.pause()
	
	this.root.getFile(path, {create: opts.create || false}, success, error)
	
	return stream
	
	function success(fileEntry){
		stream.url = fileEntry.toURL()

		var readType = 'readAsText';
		var type = {type: ''};
		
		fileEntry.file(function(file){
			switch(encoding){
				case 'base64':
				case 'base-64':
					type.type = 'application/base64'
					break;
				case 'utf8':
				case 'utf-8':
				  type.type = 'text/plain;charset=UTF-8'
					break;
				case 'uri':
				case 'url':
					readType = 'readAsDataURL'
					break;
				case null:
				case 'arraybuffer':
					readType = 'readAsArrayBuffer'
					break;
			}

			var reader = new FileReader();
			var loaded = 0;
			var fileSize = 0;
			reader.onloadstart = function(evt){
				if(evt.lengthComputable) fileSize = evt.total;
				stream.emit('loadstart')
				stream.emit('open')
			}
			reader.onprogress = function(evt){
				var chunkSize = evt.loaded - loaded;
				stream.emit('data', this.result.slice(loaded, loaded + chunkSize))
				loaded += evt.loaded;
			}
			reader.onloadend = function(evt){
				stream.emit('end')
			}
			reader[readType](file, type)
		})
	}

	function error(err){
		stream.emit('error', err)
	}
}

function createWriteStream(filePath, opts){
		
    var stream = through()
  
    stream.pause()

    opts = opts || {}
		
    this.root.getFile(filePath, {create: opts.create || true}, success, error)

    return stream

    function error(err){ stream.emit('error', err) }

		function success(fileEntry){
			
      stream.url = fileEntry.toURL()
      stream.emit('open')

      fileEntry.createWriter(function(fileWriter) {

        stream.on('end', function(){
          process.nextTick(function(){
            if (fileWriter.readyState !== fileWriter.DONE){
                fileWriter.onwriteend = function(){
                stream.emit('close')
              }
            } else {
              stream.emit('close')
            }
          })
        })

        if (opts.start){
          fileWriter.seek(opts.start)
        } else if (opts.flags == 'r+') {
          fileWriter.seek(fileWriter.length)
        }

				fileWriter.onerror = function(err){
					stream.emit('error', err)
				}
				
				fileWriter.onwriteend = function(evt){
					console.log(evt,fileWriter.readyState )
					if(fileWriter.readyState = fileWriter.DONE) stream.resume()
				}

        stream.on('data', function(data){
          var blob = new Blob([data])
          fileWriter.write(blob);
					if(fileWriter.readyState == fileWriter.WRITING) stream.pause()
        })

        stream.resume()
      }, error)

    }

}



function getFileSystem(cb){	
	
	var reqFileSystem = window.requestFileSystem || window.webkitRequestFileSystem

  if (reqFileSystem){
    reqFileSystem(window.PERMANENT, 1024 * 1024 * 1024, function(fs){
      cb(null, fs)
    }, function(err){cb(err, null)})
  }

	else{
		cb(new Error('no file system', null))
	}
}
