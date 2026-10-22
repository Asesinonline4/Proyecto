import './ListProducts.css'
import Producto from "../components/Producto.jsx"
import { useState, useEffect, useMemo } from "react"
import FiltroYOrden from "../components/FiltroYOrden.jsx"

const CATEGORIAS = ["beauty", "fragrances", "furniture", "groceries"]
const ORDENES = {
  "nombre": (a, b) => a.title.localeCompare(b.title),
  "precio": (a, b) => a.price - b.price,
  "stock": (a, b) => a.stock - b.stock
}

export default function ListProducts() {
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [ordenarPor, setOrdenarPor] = useState("nombre") // Estado para el criterio de ordenamiento
    const [filtroCategoria, setFiltroCategoria] = useState("") // Estado para el filtro de categoría

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

    const productosOrdenados = useMemo(() => {
        const productosFiltrados = filtroCategoria
            ? productos.filter(producto => producto.category === filtroCategoria)
            : productos;
        const comparador = ORDENES[ordenarPor] ?? ORDENES.nombre;
        return [...productosFiltrados].sort(comparador);
    }, [productos, ordenarPor, filtroCategoria]);

    return (
      <>        
        <FiltroYOrden
            ordenarPor={ordenarPor}
            setOrdenarPor={setOrdenarPor}
            filtroCategoria={filtroCategoria}
            setFiltroCategoria={setFiltroCategoria}
            categorias={CATEGORIAS}
            ordenes={ORDENES}
        />
        <div className="list-products">
          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p>Error al cargar productos.</p>
          ) : (
            productosOrdenados.map((producto) => (
              <Producto 
                key={producto.id}
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