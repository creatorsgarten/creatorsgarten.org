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
  default: () => Error2,
  load: () => load
});
module.exports = __toCommonJS(stdin_exports);
var import_index_be283951 = require("../../chunks/index-be283951.js");
function load({ error, status }) {
  return { props: { error, status } };
}
const Error2 = (0, import_index_be283951.c)(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error !== void 0)
    $$bindings.error(error);
  return `<h1>${(0, import_index_be283951.e)(status)}</h1>

<pre>${(0, import_index_be283951.e)(error.message)}</pre>



${error.frame ? `<pre>${(0, import_index_be283951.e)(error.frame)}</pre>` : ``}
${error.stack ? `<pre>${(0, import_index_be283951.e)(error.stack)}</pre>` : ``}`;
});
