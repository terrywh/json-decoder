"use strict";

const InputStream = require("../src/input_stream.js"),
	stream = require("stream"),
	moment = require("moment");

let ss = [];

process.stdout.write(moment().format("YYYY-MM-DD HH:mm:ss") + "\n");
process.stdout.write("------------------------------------------------------------------------------------\n");

for(let i=0; i<1; ++i) {
	ss[i] = new InputStream(require("../src/"+process.argv[2]+"_"+i+".js"));
	ss[i].pipe(new stream.Transform({objectMode:true, transform: function(data, encoding, callback) {
		callback(null,`${data.title}\t${data.types ? data.types.join(",") : "-"}\t${data.link}\n`);
	}})).pipe(process.stdout);
}
process.on("exit", function() {
	process.stdout.write("------------------------------------------------------------------------------------\n");
});
