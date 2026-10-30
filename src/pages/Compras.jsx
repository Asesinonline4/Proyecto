import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../Hooks/Contextos/CartProvider.jsx"
import "./Compras.css"

export default function Compras() {
    const { cart, addToCart, decreaseFromCart, removeFromCart, clearCart, totalItems, totalPrice } = useContext(CartContext)

    if (!cart || cart.length === 0) {
        return (
            <div className="carrito-vacio-contenedor">
                <div className="carrito-vacio-icono">🛒</div>
                <h2>Tu carrito está vacío</h2>
                <p>Parece que todavía no agregaste ningún producto a tu carrito.</p>
                <Link to="/" className="btn-volver-catalogo">Ir a explorar productos</Link>
            </div>
        )
    }

    return (
        <div className="carrito-pagina">
            <h1 className="carrito-titulo">Carrito de Compras ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})</h1>
            
            <div className="carrito-grid">
                <div className="carrito-lista">
                    {cart.map((item) => {
                        const precio = Number(item.precio ?? item.price ?? 0)
                        const nombre = item.nombre ?? item.title ?? "Producto"
                        const imagen = item.imagen ?? item.images?.[0] ?? item.thumbnail

                        return (
                            <div key={item.id} className="carrito-card">
                                <Link to={`/producto/${item.id}`} className="carrito-item-img-enlace">
                                    <img src={imagen} alt={nombre} className="carrito-item-img" />
                                </Link>

                                <div className="carrito-item-info">
                                    <Link to={`/producto/${item.id}`} className="carrito-item-titulo">
                                        <h3>{nombre}</h3>
                                    </Link>
                                    <p className="carrito-item-precio-unitario">Precio unitario: ${precio.toFixed(2)}</p>
                                    {item.stock && <p className="carrito-item-stock">Stock disp: {item.stock}</p>}
                                </div>

                                <div className="carrito-item-acciones">
                                    <div className="carrito-stepper">
                                        <button 
                                            onClick={() => decreaseFromCart(item.id)} 
                                            type="button"
                                            aria-label="Restar uno"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button 
                                            onClick={() => addToCart(item, 1)} 
                                            disabled={item.stock && item.quantity >= item.stock}
                                            type="button"
                                            aria-label="Sumar uno"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="carrito-item-subtotal">
                                        ${(precio * item.quantity).toFixed(2)}
                                    </div>

                                    <button 
                                        onClick={() => removeFromCart(item.id)} 
                                        className="btn-eliminar"
                                        title="Eliminar del carrito"
                                        type="button"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="carrito-resumen">
                    <h2>Resumen de Compra</h2>
                    
                    <div className="resumen-linea">
                        <span>Total de artículos:</span>
                        <span>{totalItems}</span>
                    </div>

                    <div className="resumen-linea total">
                        <span>Total a pagar:</span>
                        <span className="total-monto">${totalPrice.toFixed(2)}</span>
                    </div>

                    <button 
                        className="btn-checkout" 
                        onClick={() => alert("¡Gracias por tu compra simulada!")}
                        type="button"
                    >
                        Iniciar Compra
                    </button>

                    <button 
                        className="btn-vaciar" 
                        onClick={clearCart}
                        type="button"
                    >
                        Vaciar carrito
                    </button>

                    <Link to="/" className="link-seguir-comprando">
                        ← Continuar comprando
                    </Link>
                </div>
            </div>
        </div>
    )
}
