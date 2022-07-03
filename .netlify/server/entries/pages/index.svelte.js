var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  default: () => Routes
});
module.exports = __toCommonJS(stdin_exports);
var import_index_be283951 = require("../../chunks/index-be283951.js");
const hacks = [
  {
    name: "Stupid Hackathon Bangkok",
    link: "https://stupidhackth.github.io/1",
    img: "hacks/compressed/sht1.webp"
  },
  {
    name: "Stupid Hackathon Thailand #2",
    link: "https://stupidhackth.github.io/2",
    img: "hacks/compressed/sht2.webp"
  },
  {
    name: "Code Plearn: Code Play & Learn!",
    link: "",
    img: "hacks/compressed/codeplearn.webp"
  },
  {
    name: "Data Driven Love",
    link: "",
    img: "hacks/compressed/love.webp"
  },
  {
    name: "Young Creators' Camp",
    link: "",
    img: "hacks/compressed/ycc1.webp"
  },
  {
    name: "Stupid Hackathon Thailand #3",
    link: "https://stupidhackth.github.io/3",
    img: "hacks/compressed/sht3.webp"
  },
  {
    name: "Hacktoberfest Thailand 2019",
    link: "",
    img: "hacks/compressed/hacktoberfest2019.webp"
  },
  {
    name: "stupid hackathon thailand the fourth",
    link: "https://stupidhackth.github.io/4",
    img: "hacks/compressed/sht4.webp"
  },
  {
    name: "BKK.JS #14: The Return of BKK.JS",
    link: "",
    img: "hacks/compressed/bkkjs14.webp"
  },
  {
    name: "Hacktoberfest Thailand 2020",
    link: "",
    img: "hacks/compressed/hacktoberfest2020.webp"
  },
  {
    name: "The 5th StuP1d H@CK THaIL@Nd",
    link: "https://stupidhackth.github.io/5",
    img: "hacks/compressed/sht5.webp"
  },
  {
    name: "GraphQL Meetup 10.0",
    link: "",
    img: "hacks/compressed/graphql.webp"
  },
  {
    name: "How to Learn (Almost) Anything",
    link: "",
    img: "hacks/compressed/learn.webp"
  },
  {
    name: "Biological Aesthetic of Nature",
    link: "",
    img: "hacks/compressed/bio.webp"
  },
  {
    name: "Polaryz Camp #1",
    link: "",
    img: "hacks/compressed/polaryz1.webp"
  },
  {
    name: "Marshmallow Campfire",
    link: "",
    img: "hacks/compressed/marshmallow.webp"
  },
  {
    name: "Code in the Wind",
    link: "",
    img: "hacks/compressed/wind.webp"
  },
  {
    name: "Svelte Meetup Bangkok #1",
    link: "",
    img: "hacks/compressed/svelte1.webp"
  },
  {
    name: "The 6th Stupid Hackathon Thailand",
    link: "",
    img: "hacks/compressed/sht6.webp"
  }
];
const Routes = (0, import_index_be283951.c)(($$result, $$props, $$bindings, slots) => {
  return `<section><img src="${"images/cover.webp"}" class="${"border-2 border-black"}" alt="${""}"></section>

<section class="${"w-full xl:w-3/4 py-4"}"><h1 class="${"text-3xl font-medium py-4"}">creatorsgarten = garden of creators</h1>
    <p class="${"text-xl pb-2"}">We are a diverse group of people who are united by our love for creating things. We believe that through the lens of creation and technology, we can discover the fun and beauty in everything around us. We stand for:</p>
    <p class="${"text-xl pb-2"}"><span class="${"font-semibold"}">Creativity</span>: We believe that creativity is a fundamental human quality that should be nurtured and encouraged. We believe that everyone has the potential to be creative, and that the world is a better place when we all express our creativity.</p>
    <p class="${"text-xl pb-2"}"><span class="${"font-semibold"}">Empathy</span>: We believe in putting ourselves in others&#39; shoes, and using our skills to make a positive impact on the world.</p>
    <p class="${"text-xl pb-4"}"><span class="${"font-semibold"}">Fun</span>: We believe that work should be enjoyable, and that every day is an opportunity to learn something new and have some fun.</p>
    <button class="${"border-2 border-black px-2 py-1 rounded-md hover:bg-gray-100"}"><a href="${"/manifesto"}">Manifesto</a></button></section>

<section><h1 class="${"text-3xl font-medium py-4"}">Hacks</h1></section>
<section class="${"pb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-4"}">${(0, import_index_be283951.a)([...hacks].reverse(), (hack) => {
    return `<div class="${"aspect-square w-full hover:scale-[1.003] hover:shadow-sm hover:transition-all border-2 border-black"}"><img${(0, import_index_be283951.b)("src", "images/" + hack.img, 0)} class="${""}" alt="${""}">
        </div>`;
  })}</section>`;
});
