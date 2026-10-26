import "./Producto.css"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Producto({ id, nombre, precio, imagen, descripcion, stock }) {
    const [cantidad, setCantidad] = useState(0)

    const handleCantidadChange = (cambio) => {
        setCantidad((cantidadActual) => {
            const nuevaCantidad = cantidadActual + cambio

            if (nuevaCantidad < 0) return 0
            if (nuevaCantidad > stock) return stock

            return nuevaCantidad
        })
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
                    onClick={() => handleCantidadChange(-1)}
                    disabled={cantidad === 0}
                    type="button"
                >-</button>
                <span>{cantidad}</span>
                <button
                    onClick={() => handleCantidadChange(1)}
                    disabled={cantidad >= stock}
                    type="button"
                >+</button>
            </div>
        </div>
    )
}
