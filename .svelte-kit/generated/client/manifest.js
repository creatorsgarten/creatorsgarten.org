export { matchers } from './matchers.js';

export const nodes = [() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7')];

export const server_loads = [];

export const dictionary = {
	"/": [2],
	"/events": [3],
	"/ideas": [~4],
	"/ideas/[number]": [~5],
	"/ring": [6],
	"/wiki/[...slug]": [~7]
};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};