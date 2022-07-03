const { init } = require('../serverless.js');

exports.handler = init({
	appDir: "_app",
	assets: new Set([".DS_Store","favicon.png","images/.DS_Store","images/cover.png","images/cover.webp","images/creatorsgarten.png","images/creatorsgarten.webp","images/hacks/.DS_Store","images/hacks/compressed/bio.webp","images/hacks/compressed/bkkjs14.webp","images/hacks/compressed/codeplearn.webp","images/hacks/compressed/graphql.webp","images/hacks/compressed/hacktoberfest2019.webp","images/hacks/compressed/hacktoberfest2020.webp","images/hacks/compressed/learn.webp","images/hacks/compressed/love.webp","images/hacks/compressed/marshmallow.webp","images/hacks/compressed/polaryz1.webp","images/hacks/compressed/sht1.webp","images/hacks/compressed/sht2.webp","images/hacks/compressed/sht3.webp","images/hacks/compressed/sht4.webp","images/hacks/compressed/sht5.webp","images/hacks/compressed/sht6.webp","images/hacks/compressed/svelte1.webp","images/hacks/compressed/wind.webp","images/hacks/compressed/ycc1.webp","images/hacks/original/.DS_Store","images/hacks/original/bio.png","images/hacks/original/bkkjs14.png","images/hacks/original/codeplearn.png","images/hacks/original/graphql.png","images/hacks/original/hacktoberfest2019.png","images/hacks/original/hacktoberfest2020.png","images/hacks/original/learn.png","images/hacks/original/love.png","images/hacks/original/marshmallow.jpg","images/hacks/original/marshmallow.png","images/hacks/original/polaryz1.png","images/hacks/original/sht1.png","images/hacks/original/sht2.png","images/hacks/original/sht3.png","images/hacks/original/sht4.png","images/hacks/original/sht5.png","images/hacks/original/sht6.png","images/hacks/original/svelte1.png","images/hacks/original/wind.png","images/hacks/original/ycc1.png"]),
	mimeTypes: {".png":"image/png",".webp":"image/webp",".jpg":"image/jpeg"},
	_: {
		entry: {"file":"start-c42717c1.js","js":["start-c42717c1.js","chunks/index-5f018314.js"],"css":[]},
		nodes: [
			() => Promise.resolve().then(() => require('../server/nodes/0.js')),
			() => Promise.resolve().then(() => require('../server/nodes/1.js')),
			() => Promise.resolve().then(() => require('../server/nodes/2.js')),
			() => Promise.resolve().then(() => require('../server/nodes/3.js')),
			() => Promise.resolve().then(() => require('../server/nodes/4.js'))
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				id: "manifesto",
				pattern: /^\/manifesto\/?$/,
				names: [],
				types: [],
				path: "/manifesto",
				shadow: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				id: "ring",
				pattern: /^\/ring\/?$/,
				names: [],
				types: [],
				path: "/ring",
				shadow: null,
				a: [0,4],
				b: [1]
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
});
