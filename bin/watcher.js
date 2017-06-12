"use strict";

const InputStream = require("../src/input_stream.js"),
	stream = require("stream");
let ss = [];
for(let i=0; i<1; ++i) {
	ss[i] = new InputStream(require("../src/"+process.argv[2]+"_"+i+".js"));
	ss[i].pipe(new stream.Transform({objectMode:true, transform: function(chunk, encoding, callback) {
		callback(null, JSON.stringify(chunk) + "\n");
	}})).pipe(process.stdout);
}
