export const privateKey =
  import.meta.env.JWT_PRIVATE_KEY?.replaceAll(/\\n/g, '\n') ??
  process.env.JWT_PRIVATE_KEY?.replaceAll(/\\n/g, '\n')
