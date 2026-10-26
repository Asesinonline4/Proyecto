import './ListProducts.css'
import Producto from "../components/Producto.jsx"
import { useState, useEffect } from "react"
import FiltroYOrden from "../components/FiltroYOrden.jsx"

export default function ListProducts() {
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [productosFiltrados, setProductosFiltrados] = useState([])

    useEffect(() => {
        // llamamos a la api para obtener los productos //
        
        fetch('https://dummyjson.com/products')
            .then(res=>res.json())            
            .then(json=>setProductos(json.products))
            .catch(error => {
                console.error('Error fetching products:', error)
                setError(error)
            })
            .finally(() => setLoading(false))
    }, [])

    return (
      <>        
        <FiltroYOrden
            productos={productos}
            setProductos={setProductosFiltrados}
        />
        <div className="list-products">
          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p>Error al cargar productos.</p>
          ) : (
            productosFiltrados.map((producto) => (
              <Producto 
                key={producto.id}
                id={producto.id}
                nombre={producto.title}
                precio={producto.price}
                imagen={producto.images}
                descripcion={producto.description}
                stock={producto.stock}
                categoria={producto.category}
              />
            ))
          )}
        </div>
      </>
    )
}