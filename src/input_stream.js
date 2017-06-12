"use strict";

const stream = require("stream"),
	source = require("./source.js"),
	kUrl   = Symbol("url"),
	kRefer = Symbol("refer"),
	kCache = Symbol("cache"),
	kUrls  = Symbol("urls"),
	kParse = Symbol("parser");

function fetchNext(self) {
	source.fetchUrl(self[kUrl], self[kRefer]).then((html) => {
		for(let item of self[kParse](html)) {
			item && self[kCache].push(item);
		}
		self._read();
	}, (err) => {
		self.emit("error", err);
	});
}

class InputStream extends stream.Readable {
	constructor(src) {
		super({objectMode: true});
		this[kUrls]  = src.urls();
		this[kParse] = src.parse;
		this[kCache] = [];
		this[kUrl]   = null;
	}
	_read() {
		if(this[kCache].length > 0) {
			let data;
			while((data = this[kCache].shift()) != null && this.push(data));
		}else{
			let rv = this[kUrls].next();
			if(rv.done) {
				this.push(null); // end of file
			}else{
				this[kUrl]   = rv.value.url;
				this[kRefer] = rv.value.refer;
				setTimeout(fetchNext, 1000, this); // 加载数据适当间隔等待
			}
		}
	}
}
module.exports = InputStream;
