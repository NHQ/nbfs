var getFileSystem = require('./getFileSystem');
var fs = null;
var buf = new Float32Array(1024 * 1024);
for(var x = 0; x < buf.length; x++){
	buf[x] = Math.sin((x / 1024 * 1024) * Math.PI * 2)
}
getFileSystem(function(err, fs){
	if(err) console.log(err);
	else{
		
		var ws = fs.createWriteStream('tempeth3')
		for(var y = 0; y < 5; y++){
			ws.write(new Blob([buf]))			
		}
		
		setTimeout(function(){
			
			var rs = fs.createReadStream('tempeth3')
			rs.on('data', function(data){
				console.log(data)
			})
/*					
			fs.root.getFile('tempeth3', {}, function(fileEntry) {

			  fileEntry.file(function(file) {
			     var reader = new FileReader();

			     reader.onloadend = function(e) {

			       console.log(this.result);

			     };

			     reader.readAsText(file);
			  }, errorHandler);

			}, errorHandler);
*/
		}, 1000)
	}
})


function errorHandler(err){
	console.log(err)
}
