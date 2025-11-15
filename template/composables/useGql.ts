// kebab-front/composables/useGql.ts
export async function useGql<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  // Appel du proxy Nuxt /api/gql (le token reste côté serveur)
  return await $fetch<T>('/api/gql', {
    method: 'POST',
    body: { query, variables },
  })
}

// Si TypeScript râle sur $fetch, décommente la ligne ci-dessous :
// import { $fetch } from 'ofetch'
