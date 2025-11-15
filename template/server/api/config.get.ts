export default defineEventHandler((event) => {
  const c = useRuntimeConfig(event)
  return {
    endpoint: c.public.graphqlEndpoint ?? null,
    hasToken: Boolean(c.strapiToken),
    nodeEnv: process.env.NODE_ENV || null,
  }
})
