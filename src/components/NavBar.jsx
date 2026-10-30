import "./NavBar.css"
import LogoCarrito from "./LogoCarrito.jsx"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../Hooks/Contextos/CartProvider.jsx"

export default function NavBar() {
    const { totalItems } = useContext(CartContext)

    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <li><Link to="/">Productos</Link></li>
            </ul>
            {/* Carrito de compras */}
            <Link to="/carrito" style={{ textDecoration: 'none', color: 'inherit' }}>
                <LogoCarrito cantidadDeProductos={totalItems} />
            </Link>
        </nav>
    )
}