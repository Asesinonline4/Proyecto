import "./Producto.css"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../Hooks/Contextos/CartProvider.jsx"

export default function Producto({ id, nombre, precio, imagen, descripcion, stock }) {
    const { cart, addToCart, decreaseFromCart } = useContext(CartContext)

    // Obtenemos la cantidad de este producto directamente del estado global del carrito
    const itemEnCarrito = cart.find((item) => item.id === id)
    const cantidad = itemEnCarrito ? itemEnCarrito.quantity : 0

    const agregarAlCarrito = () => {
        addToCart({ id, nombre, precio, imagen, descripcion, stock }, 1)
    }

    const sacarDelCarrito = () => {
        decreaseFromCart(id)
    }

    const imagenSrc = Array.isArray(imagen) ? imagen[0] : imagen

    return (
        <div className={"producto" + (stock <= 0 ? " sin-stock" : "")}> 
            <Link to={`/producto/${id}`} className="producto-enlace">
                <img src={imagenSrc} alt={nombre} />
            </Link>
            <h2>{nombre}</h2>
            <p className="descripcion">{descripcion}</p>
            <p className="precio">${precio.toFixed(2)}</p>
            <p className="stock">Stock: {stock}</p>
            <div className="cantidad">
                <button
                    onClick={sacarDelCarrito}
                    disabled={cantidad === 0}
                    type="button"
                    aria-label="Disminuir cantidad"
                >-</button>
                <span>{cantidad}</span>
                <button
                    onClick={agregarAlCarrito}
                    disabled={cantidad >= stock || stock <= 0}
                    type="button"
                    aria-label="Aumentar cantidad"
                >+</button>
            </div>
        </div>
    )
}
