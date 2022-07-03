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
  default: () => Manifesto
});
module.exports = __toCommonJS(stdin_exports);
var import_index_be283951 = require("../../chunks/index-be283951.js");
var manifesto_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => "p.svelte-1crddx7{padding-bottom:1rem;font-size:1.25rem;line-height:1.75rem\n}")();
const css = {
  code: "p.svelte-1crddx7{padding-bottom:1rem;font-size:1.25rem;line-height:1.75rem\n}",
  map: null
};
const Manifesto = (0, import_index_be283951.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<section class="${"pb-2"}"><h1 class="${"font-bold text-4xl pb-4"}">Who are we?</h1>
    <p class="${"svelte-1crddx7"}">creatorsgarten = garden of creators</p>
    <p class="${"svelte-1crddx7"}"><span class="${"font-semibold"}">We</span> are a diverse group of people who are united by our love for creating things. We believe that through the lens of creation and technology, we can discover the fun and beauty in everything around us.</p>
    <p class="${"svelte-1crddx7"}"><span class="${"font-semibold"}">We</span> don&#39;t believe in disciplinary boundaries. As we think that all knowledge is connected, and that by breaking down barriers we can learn more and create more interesting things.</p>
    <p class="${"svelte-1crddx7"}"><span class="${"font-semibold"}">We</span> connect people through events, meetups, hackathons, and much more. We strive to create an environment where creators can come together to collaborate, share ideas, and learn from each other. </p>
    <p class="${"svelte-1crddx7"}"><span class="${"font-semibold"}">We stand for:</span></p>
    <p class="${"svelte-1crddx7"}">Creativity: We believe that creativity is a fundamental human quality that should be nurtured and encouraged. We believe that everyone has the potential to be creative, and that the world is a better place when we all express our creativity.</p>
    <p class="${"svelte-1crddx7"}">Empathy: We believe in putting ourselves in others&#39; shoes, and using our skills to make a positive impact on the world.</p>
    <p class="${"svelte-1crddx7"}">Fun: We believe that work should be enjoyable, and that every day is an opportunity to learn something new and have some fun.</p>
    <p class="${"svelte-1crddx7"}">The name <span class="${"font-semibold"}">Creatorsgarten</span> comes from the word creators and garten, as in Kindergarten, which means garden of children in German. We chose this name because we want to create a garden for all creators where they can come to create, learn, and share.</p>
    <p class="${"svelte-1crddx7"}">We invite you to join us on this journey of exploration and creation. Together, let\u2019s create things.</p>
    <img class="${"py-4"}" src="${"images/cover.webp"}" alt="${""}">
</section>`;
});
