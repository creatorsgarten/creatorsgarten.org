var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  manifest: () => manifest
});
module.exports = __toCommonJS(stdin_exports);
const manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set([".DS_Store", "favicon.png", "images/.DS_Store", "images/cover.png", "images/cover.webp", "images/creatorsgarten.png", "images/creatorsgarten.webp", "images/hacks/.DS_Store", "images/hacks/compressed/bio.webp", "images/hacks/compressed/bkkjs14.webp", "images/hacks/compressed/codeplearn.webp", "images/hacks/compressed/graphql.webp", "images/hacks/compressed/hacktoberfest2019.webp", "images/hacks/compressed/hacktoberfest2020.webp", "images/hacks/compressed/learn.webp", "images/hacks/compressed/love.webp", "images/hacks/compressed/marshmallow.webp", "images/hacks/compressed/polaryz1.webp", "images/hacks/compressed/sht1.webp", "images/hacks/compressed/sht2.webp", "images/hacks/compressed/sht3.webp", "images/hacks/compressed/sht4.webp", "images/hacks/compressed/sht5.webp", "images/hacks/compressed/sht6.webp", "images/hacks/compressed/svelte1.webp", "images/hacks/compressed/wind.webp", "images/hacks/compressed/ycc1.webp", "images/hacks/original/.DS_Store", "images/hacks/original/bio.png", "images/hacks/original/bkkjs14.png", "images/hacks/original/codeplearn.png", "images/hacks/original/graphql.png", "images/hacks/original/hacktoberfest2019.png", "images/hacks/original/hacktoberfest2020.png", "images/hacks/original/learn.png", "images/hacks/original/love.png", "images/hacks/original/marshmallow.jpg", "images/hacks/original/marshmallow.png", "images/hacks/original/polaryz1.png", "images/hacks/original/sht1.png", "images/hacks/original/sht2.png", "images/hacks/original/sht3.png", "images/hacks/original/sht4.png", "images/hacks/original/sht5.png", "images/hacks/original/sht6.png", "images/hacks/original/svelte1.png", "images/hacks/original/wind.png", "images/hacks/original/ycc1.png"]),
  mimeTypes: { ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg" },
  _: {
    entry: { "file": "start-c42717c1.js", "js": ["start-c42717c1.js", "chunks/index-5f018314.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => __toESM(require("./nodes/0.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/1.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/2.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/3.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/4.js")))
    ],
    routes: [
      {
        type: "page",
        id: "",
        pattern: /^\/$/,
        names: [],
        types: [],
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      },
      {
        type: "page",
        id: "manifesto",
        pattern: /^\/manifesto\/?$/,
        names: [],
        types: [],
        path: "/manifesto",
        shadow: null,
        a: [0, 3],
        b: [1]
      },
      {
        type: "page",
        id: "ring",
        pattern: /^\/ring\/?$/,
        names: [],
        types: [],
        path: "/ring",
        shadow: null,
        a: [0, 4],
        b: [1]
      }
    ],
    matchers: async () => {
      return {};
    }
  }
};
