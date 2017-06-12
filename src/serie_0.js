"use strict";

const cheerio = require("cheerio"),
	series = require("../etc/serie.js"),
	kURLS = [
		"http://www.btbtt.co/thread-index-fid-950-tid-4353843.htm",
		"http://www.btbtt.co/thread-index-fid-981-tid-4353787.htm",
		"http://www.btbtt.co/thread-index-fid-950-tid-4353842.htm",
	];

exports.urls = function*() {
	for(let i=0;i<kURLS.length;++i) {
		yield {
			"url":  kURLS[i],
			"refer":"http://www.btbtt.co/"
		};
	}
};

exports.parse = function*(html) {
	const $ = cheerio.load(html);
	let cache = {};
	for(let el of $("td.post_td table tr > td:nth-child(2) > a").toArray()) {
		let text = $(el).text(),
			link = $(el).attr("href");
		if(!!cache[link]) continue;
		cache[link] = text;
	}
	for(let link in cache) {
		let text = cache[link];
		for(let i=0;i<series.length;++i) {
			if(text.indexOf(series[i])>-1) {
				yield {"title": text, "link": link};
			}
		}
	}
};
