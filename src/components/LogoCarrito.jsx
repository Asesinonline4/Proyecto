import './LogoCarrito.css'

export default function LogoCarrito({ cantidadDeProductos }) {
    return (
        <div className="logo-carrito">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cantidadDeProductos}</span>
        </div>
    )
}