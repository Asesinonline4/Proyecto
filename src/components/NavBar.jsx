import "./NavBar.css"
import LogoCarrito from "./LogoCarrito.jsx"

export default function NavBar() {
    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <li><a href="/">Productos</a></li>
            </ul>
            {/*Carrito de compras*/}
            <LogoCarrito cantidadDeProductos={0} />
        </nav>
    )
}