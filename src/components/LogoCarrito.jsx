import './LogoCarrito.css'

export default function LogoCarrito({ cantidadDeProductos }) {
    return (
        <div className="logo-carrito">
            <span className="cart-icon"><img src="/src/assets/carrito.png" alt="Carrito de compras" /></span>
            <span className="cart-count">{cantidadDeProductos}</span>
        </div>
    )
}