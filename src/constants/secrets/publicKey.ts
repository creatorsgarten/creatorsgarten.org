export const privateKey =
  import.meta.env.JWT_PUBLIC_KEY?.replaceAll(/\\n/g, '\n') ??
  process.env.JWT_PUBLIC_KEY?.replaceAll(/\\n/g, '\n')
