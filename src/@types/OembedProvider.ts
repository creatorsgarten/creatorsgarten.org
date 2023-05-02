export interface OembedProvider {
  provider_name: string
  provider_url: string
  endpoints: {
    // glob
    schemes: string[]
    // api
    url: string
  }[]
}
