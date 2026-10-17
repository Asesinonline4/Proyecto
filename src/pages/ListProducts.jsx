import './ListProducts.css'
import productos from "../data/products.json"
import Producto from "../components/Producto.jsx"

export default function ListProducts() {
    return (
      <div className="list-products">
        {productos.map((producto) => (
            <Producto 
                key={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
                imagen={producto.imagen}
            />
        ))}
      </div>
    )
}