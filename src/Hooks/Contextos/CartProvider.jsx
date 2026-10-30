import { createContext, useState, useEffect } from "react"

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext()

const STORAGE_KEY = "carrito_compras"

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem(STORAGE_KEY)
            return storedCart ? JSON.parse(storedCart) : []
        } catch (error) {
            console.error("Error al recuperar el carrito de localStorage:", error)
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
        } catch (error) {
            console.error("Error al guardar el carrito en localStorage:", error)
        }
    }, [cart])

    const addToCart = (product, quantityToAdd = 1) => {
        const id = product.id
        const price = Number(product.price ?? product.precio ?? 0)
        const nombre = product.nombre ?? product.title ?? "Producto"
        const imagen = product.imagen 
            ? (Array.isArray(product.imagen) ? product.imagen[0] : product.imagen)
            : (product.images ? (Array.isArray(product.images) ? product.images[0] : product.images) : product.thumbnail)
        const stock = product.stock ?? Infinity

        setCart((prevCart) => {
            const productExists = prevCart.find((item) => item.id === id)

            if (productExists) {
                const nuevaCantidad = Math.min(productExists.quantity + quantityToAdd, stock)
                return prevCart.map((item) =>
                    item.id === id ? { ...item, quantity: nuevaCantidad } : item
                )
            }

            const initialQuantity = Math.min(quantityToAdd, stock)
            return [
                ...prevCart,
                {
                    ...product,
                    id,
                    nombre,
                    price,
                    precio: price,
                    imagen,
                    stock,
                    quantity: initialQuantity
                }
            ]
        })
    }

    const decreaseFromCart = (productId) => {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === productId)
            if (!existing) return prevCart

            if (existing.quantity > 1) {
                return prevCart.map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
            }

            return prevCart.filter((item) => item.id !== productId)
        })
    }

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
    }

    const clearCart = () => {
        setCart([])
    }

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
    const totalPrice = cart.reduce((total, item) => {
        const precio = Number(item.price ?? item.precio ?? 0)
        return total + item.quantity * precio
    }, 0)

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                decreaseFromCart,
                removeFromCart,
                clearCart,
                totalItems,
                totalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider
