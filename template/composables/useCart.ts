export type CartItem = {
  id: string
  nom: string
  prix: number
  image?: string | null
  qty: number
}

const CART_KEY = 'cart_v1'

export function useCart() {
  // Charger directement depuis localStorage si côté client
  const cart = useState<CartItem[]>('cart', () => {
    if (process.client) {
      try {
        const raw = localStorage.getItem(CART_KEY)
        if (raw) {
          const saved = JSON.parse(raw) as CartItem[]
          console.log('🔄 Panier rechargé depuis localStorage:', saved)
          return saved
        }
      } catch (e) {
        console.error('Erreur lecture localStorage:', e)
      }
    }
    return []
  })

  const totalItems = computed(() => cart.value.reduce((n, i) => n + i.qty, 0))
  const subtotal = computed(() => cart.value.reduce((s, i) => s + i.prix * i.qty, 0))
  const delivery = ref(2.5)
  const total = computed(() => subtotal.value + delivery.value)

  function persist() {
    if (process.client) {
      try {
        const plainCart = [...cart.value]
        localStorage.setItem(CART_KEY, JSON.stringify(plainCart))
        console.log('💾 Panier sauvegardé:', plainCart)
      } catch (e) {
        console.error('Erreur sauvegarde localStorage:', e)
      }
    }
  }

  function add(item: CartItem) {
    console.log('➕ Ajout au panier:', item)
    const found = cart.value.find(i => i.id === item.id)
    if (found) {
      found.qty += item.qty
    } else {
      cart.value.push({ ...item })
    }
    persist()
  }

  function inc(id: string) {
    const it = cart.value.find(i => i.id === id)
    if (it) {
      it.qty++
      persist()
    }
  }

  function dec(id: string) {
    const it = cart.value.find(i => i.id === id)
    if (!it) return
    it.qty--
    if (it.qty <= 0) remove(id)
    else persist()
  }

  function remove(id: string) {
    cart.value = cart.value.filter(i => i.id !== id)
    persist()
  }

  function clear() {
    cart.value = []
    persist()
  }

  return {
    cart,
    add,
    inc,
    dec,
    remove,
    clear,
    totalItems,
    subtotal,
    delivery,
    total
  }
}