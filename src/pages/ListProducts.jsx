import './ListProducts.css'
import Producto from "../components/Producto.jsx"
import { useState, useEffect } from "react"

export default function ListProducts() {
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // llamamos a la api para obtener los productos //
        
        fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())            
            .then(json=>setProductos(json))
            .catch(error => {
                console.error('Error fetching products:', error)
                setError(error)
            })
            .finally(() => setLoading(false))
    }, [])

    return (
      <div className="list-products">
        {loading ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <p>Error al cargar productos.</p>
        ) : (
          productos.map((producto) => (
            <Producto 
                key={producto.id}
                nombre={producto.title}
                precio={producto.price}
                // imagen={producto.image} //
                descripcion={producto.description}
                // stock={producto.stock} //
            />
          ))
        )}
      </div>
    )
}