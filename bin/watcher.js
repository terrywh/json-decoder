"use strict";

const InputStream = require("../src/input_stream.js"),
	stream = require("stream");

let ss = [];
if(process.argv[3] === "html") {
	console.log(`<!doctype html>
	<html>
		<head>
			<meta charset="UTF-8" />
			<title>'+process.argv[2]+' watcher</title>
			<link href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" rel="styleSheet" />
		</head>
	<body>
		<table class="table table-striped">
			<thead><tr><th>标题</th><th>类型</th><th>链接</th></tr></thead>
			<tbody>`);
}else{
	console.log("标题\t类型\t链接\n");
	console.log("------------------------------------------------------------------------------------\n");
}
for(let i=0; i<1; ++i) {
	ss[i] = new InputStream(require("../src/"+process.argv[2]+"_"+i+".js"));
	ss[i].pipe(new stream.Transform({objectMode:true, transform: function(data, encoding, callback) {
		if(process.argv[3] === "html") {
			callback(null,`
				<tr>
					<td>${data.title}</td>
					<td>${data.types ? data.types.join(",") : "-"}</td>
					<td><a href="{data.link}"">${data.link}</a></td>
				</tr>`);
		}else{
			callback(null,`${data.title}\t${data.types ? data.types.join(",") : "-"}\t${data.link}\n`);
		}
	}})).pipe(process.stdout);
}
process.on("exit", function() {
	if(process.argv[3] === "html") {
		console.log(`
			</tbody>
		</table>
	</body>
</html>`);
	}else{
		console.log("------------------------------------------------------------------------------------\n");
	}
});
