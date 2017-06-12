"use strict";
const url = require("url"),
	http = {
		"http:" : require("http"),
		"https:": require("https"),
	};

exports.fetchUrl = async function(uri, refer) {
	uri = url.parse(uri);
	uri.headers = {
		"Referer": refer,
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36",
		"Cookie": "__cfduid=d340097e537121c4330e1764ccb0c95791489378695; bbs_sid=2244b6139a2825e5; UM_distinctid=15c48cf820ba7-0720183cd1c8f4-5393662-1fa400-15c48cf820c107b; bbs_lastday=1496823081; bbs_lastonlineupdate=1496823550; bbs_page=1; timeoffset=%2B08; CNZZDATA1260924983=723731748-1495864464-%7C1496820484; a3989_pages=5; a3989_times=2",
		"Connection": "keep-alive"
	};
	uri.timeout = 5000;
	let req = http[uri.protocol].request(uri), prm = new Promise(function(resolve, reject) {
		let data = "";
		req.on("response", function(res) {
			res.setEncoding("utf-8");
			res.on("data", function(chunk) {
				data += chunk;
			}).on("end", function() {
				resolve(data);
			});
		}).on("error", function(err) {
			reject(err);
		}).on("timeout", function() {
			req.abort();
		});
		req.end();
	});
	return prm;
}