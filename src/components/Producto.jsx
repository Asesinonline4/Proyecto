import "./Producto.css"
import { useState } from "react"

export default function Producto({ nombre, precio, imagen, descripcion, stock }) {
    const [cantidad, setCantidad] = useState(0)

    return (
        <div className={"producto" + (stock <= 0 ? " sin-stock" : "")}> 
            <img src={imagen} alt={nombre} />
            <h2>{nombre}</h2>
            <p className="descripcion">{descripcion}</p>
            <p className="precio">${precio.toFixed(2)}</p>
            <p className="stock">Stock: {stock}</p>
            <div className="cantidad">
                <button
                    onClick={() => setCantidad(cantidad - 1)}
                    disabled={cantidad === 0}
                >-</button>
                <span>{cantidad}</span>
                <button
                    onClick={() => setCantidad(cantidad + 1)}
                    disabled={stock <= 0}
                >+</button>
            </div>
        </div>
    )
}