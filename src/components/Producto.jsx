import "./Producto.css"

export default function Producto({ nombre, precio, imagen }) {
    return (
        <div className="producto">
            <img src={imagen} alt={nombre} />
            <h2>{nombre}</h2>
            <p>${precio.toFixed(2)}</p>
        </div>
    )
}