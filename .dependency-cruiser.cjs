/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-mongo-outside-backend',
      comment:
        'Only the backend packlet may touch MongoDB. Frontend/page code must go through Astro.locals.backend instead of importing $constants/mongo directly.',
      severity: 'error',
      from: {
        pathNot: '^src/packlets/backend',
      },
      to: {
        path: '^src/constants/mongo',
      },
    },
    {
      name: 'no-backend-outside-backend',
      comment:
        'Nothing outside the backend packlet may import from it directly (other than the Astro mount route, which needs the Elysia app instance) -- go through Astro.locals.backend / the Eden client instead.',
      severity: 'error',
      from: {
        pathNot: [
          '^src/packlets/backend',
          '^src/pages/api/backend/\\[\\.\\.\\.path\\]\\.ts$',
          '^src/functions/getBackend\\.ts$',
        ],
      },
      to: {
        path: '^src/packlets/backend',
      },
    },
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    exclude: {
      path: 'node_modules',
    },
  },
}
