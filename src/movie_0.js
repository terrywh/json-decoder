"use strict";

const cheerio = require("cheerio"),
	kURLS = [
//	"http://www.btbtt.co/forum-index-fid-951.htm",
	"http://www.btbtt.co/forum-index-fid-951-page-2.htm",
	"http://www.btbtt.co/forum-index-fid-951-page-3.htm",
	"http://www.btbtt.co/forum-index-fid-951-page-4.htm",
	"http://www.btbtt.co/forum-index-fid-951-page-5.htm",
	"http://www.btbtt.co/forum-index-fid-951-page-6.htm",
	"http://www.btbtt.co/forum-index-fid-951-page-7.htm",
	"http://www.btbtt.co/forum-index-fid-951-page-8.htm",
	"http://www.btbtt.co/forum-index-fid-951-page-9.htm",
	"http://www.btbtt.co/forum-index-fid-951-page-10.htm",
];

exports.urls = function*() {
	for(let i=0;i<kURLS.length;++i) {
		yield {"url": kURLS[i], "refer": kURLS[i-1] || null};
	}
};

exports.parse = function*(html) {
	const $ = cheerio.load(html);
	for(let el of $("#threadlist > table > tbody > tr").toArray()) {
		// 仅采集正常的帖子（抛弃置顶帖子）
		let $icon = $(el).find("td").eq(0).find(".icon");
		if(!$icon.hasClass("icon-post-blue") && !$icon.hasClass("icon-post-grey")) {
			continue;
		}
		yield parse_item($, el);
	}
};

function parse_item($, el) {
	let score = parseInt($(el).find("td").eq(2).find("span").text()),
		title = $(el).find(".subject_link").text().trim(),
		link  = "http://btbtt.co/" + $(el).find(".subject_link").attr("href");
	if(score < 10 || title.indexOf("BD") == -1) {
		return null;
	}
	let types = [];
	$(el).find(".subject_type").each(function(index, el) {
		types.push($(el).text());
	});
	return {"title":title, "types": types, "link": link};
}
