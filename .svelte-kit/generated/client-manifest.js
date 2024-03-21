export { matchers } from './client-matchers.js';

export const components = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/manifesto.svelte"),
	() => import("../../src/routes/ring.svelte")
];

export const dictionary = {
	"": [[0, 2], [1]],
	"manifesto": [[0, 3], [1]],
	"ring": [[0, 4], [1]]
};