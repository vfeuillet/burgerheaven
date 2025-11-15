export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody<{ query: string; variables?: any }>(event)

  if (!body?.query) {
    setResponseStatus(event, 400)
    return { errors: [{ message: 'Missing GraphQL query' }] }
  }

  try {
    const res = await $fetch(config.public.graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.strapiToken}`,
      },
      body,
    })
    return res
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { errors: [{ message: err?.message || 'Proxy error' }] }
  }
})
