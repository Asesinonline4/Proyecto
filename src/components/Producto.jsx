import "./Producto.css"
import { useState } from "react"

export default function Producto({ nombre, precio, imagen, descripcion, stock }) {
    const [cantidad, setCantidad] = useState(0)

    const handleCantidadChange = (cambio) => {
        setCantidad((cantidadActual) => {
            const nuevaCantidad = cantidadActual + cambio

            if (nuevaCantidad < 0) return 0
            if (nuevaCantidad > stock) return stock

            return nuevaCantidad
        })
    }

    return (
        <div className={"producto" + (stock <= 0 ? " sin-stock" : "")}> 
            <img src={imagen[0]} alt={nombre} />
            <h2>{nombre}</h2>
            <p className="descripcion">{descripcion}</p>
            <p className="precio">${precio.toFixed(2)}</p>
            <p className="stock">Stock: {stock}</p>
            <div className="cantidad">
                <button
                    onClick={() => handleCantidadChange(-1)}
                    disabled={cantidad === 0}
                >-</button>
                <span>{cantidad}</span>
                <button
                    onClick={() => handleCantidadChange(1)}
                    disabled={cantidad >= stock}
                >+</button>
            </div>
        </div>
    )
}