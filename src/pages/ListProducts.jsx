import './ListProducts.css'
import Producto from "../components/Producto.jsx"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import FiltroYOrden from "../components/FiltroYOrden.jsx"

const LIMIT = 12

export default function ListProducts() {
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [offSet, setOffSet] = useState(0)
    const [hasMore, setHasMore] = useState(true)

    const [filtros, setFiltros] = useState({
        ordenarPor: "por defecto",
        categoria: "",
        precioMin: "",
        precioMax: "",
        stock: ""
    })

    const observadorRef = useRef(null)

    // Al cambiar cualquier filtro o criterio de ordenación:
    // Reiniciamos el offset a 0, vaciamos el array de productos y reactivamos hasMore
    const handleFiltroChange = useCallback((campo, valor) => {
        setFiltros((prev) => ({
            ...prev,
            [campo]: valor
        }))
        setOffSet(0)
        setProductos([])
        setHasMore(true)
        setLoading(true)
        setError(null)
    }, [])

    // Petición al backend con LIMIT y OFFSET (skip), pasando el orden directamente a la API
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true)
        setError(null)

        let baseUrl = "https://dummyjson.com/products"
        if (filtros.categoria) {
            baseUrl += `/category/${encodeURIComponent(filtros.categoria)}`
        }

        const params = new URLSearchParams({
            limit: LIMIT.toString(),
            skip: offSet.toString()
        })

        // El criterio de ordenamiento se delega al backend
        if (filtros.ordenarPor === "nombre") {
            params.append("sortBy", "title")
            params.append("order", "asc")
        } else if (filtros.ordenarPor === "precio ascendente") {
            params.append("sortBy", "price")
            params.append("order", "asc")
        } else if (filtros.ordenarPor === "precio descendente") {
            params.append("sortBy", "price")
            params.append("order", "desc")
        } else if (filtros.ordenarPor === "stock") {
            params.append("sortBy", "stock")
            params.append("order", "desc")
        }
        // Si es "por defecto", no se agrega sortBy ni order (orden natural de la API)

        const url = `${baseUrl}?${params.toString()}`

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener productos")
                return res.json()
            })
            .then((json) => {
                const nuevosProductos = json.products || []

                // NUNCA aplicamos .sort() global al array combinado.
                // Los nuevos elementos se agregan exclusivamente al final del array existente
                // usando el callback del estado: setProductos(prev => [...prev, ...nuevosProductos])
                setProductos((prev) => {
                    if (offSet === 0) {
                        return nuevosProductos
                    }
                    const idsExistentes = new Set(prev.map((p) => p.id))
                    const filtrados = nuevosProductos.filter((p) => !idsExistentes.has(p.id))
                    return [...prev, ...filtrados]
                })

                if (json.skip + nuevosProductos.length >= json.total || nuevosProductos.length === 0) {
                    setHasMore(false)
                }
            })
            .catch((err) => {
                console.error("Error fetching products:", err)
                setError(err)
            })
            .finally(() => setLoading(false))
    }, [offSet, filtros.categoria, filtros.ordenarPor])

    // Filtros locales opcionales (precio y stock) preservando estrictamente el orden que viene del backend
    const productosAMostrar = useMemo(() => {
        return productos.filter((producto) => {
            const coincidePrecioMin = filtros.precioMin === "" || producto.price >= Number(filtros.precioMin)
            const coincidePrecioMax = filtros.precioMax === "" || producto.price <= Number(filtros.precioMax)
            const coincideStock = !filtros.stock ||
                (filtros.stock === "en stock" && producto.stock > 0) ||
                (filtros.stock === "sin stock" && producto.stock <= 0)

            return coincidePrecioMin && coincidePrecioMax && coincideStock
        })
    }, [productos, filtros.precioMin, filtros.precioMax, filtros.stock])

    // IntersectionObserver para paginación por scroll infinito
    useEffect(() => {
        if (loading || !hasMore) return

        const observer = new IntersectionObserver(
            (entries) => {
                const primerElemento = entries[0]
                if (primerElemento.isIntersecting) {
                    setOffSet((prevOffset) => prevOffset + LIMIT)
                }
            },
            {
                threshold: 0.1,
                rootMargin: "150px"
            }
        )

        const elementoActual = observadorRef.current
        if (elementoActual) {
            observer.observe(elementoActual)
        }

        return () => {
            if (elementoActual) {
                observer.unobserve(elementoActual)
            }
            observer.disconnect()
        }
    }, [loading, hasMore])

    return (
      <>        
        <FiltroYOrden
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
        />

        {offSet === 0 && loading ? (
          <p className="mensaje-estado-lista">Cargando productos...</p>
        ) : error && productos.length === 0 ? (
          <p className="mensaje-estado-lista error">Error al cargar productos.</p>
        ) : (
          <>
            <div className="list-products">
              {productosAMostrar.map((producto) => (
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
              ))}
            </div>

            {productosAMostrar.length === 0 && !loading && (
              <p className="mensaje-estado-lista">No se encontraron productos con los filtros seleccionados.</p>
            )}

            {/* Elemento centinela observado por el IntersectionObserver */}
            <div ref={observadorRef} className="observador-centinela">
              {loading && <p className="mensaje-cargando-mas">Cargando más productos...</p>}
              {!hasMore && productos.length > 0 && (
                <p className="mensaje-fin-catalogo">Has llegado al final del catálogo.</p>
              )}
            </div>
          </>
        )}
      </>
    )
}
