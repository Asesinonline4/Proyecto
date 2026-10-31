import "./FiltroYOrden.css"
import { useState, useEffect } from "react"

const ORDENES = [
    { id: "por defecto", label: "Por defecto" },
    { id: "nombre", label: "Nombre" },
    { id: "precio ascendente", label: "Precio ascendente" },
    { id: "precio descendente", label: "Precio descendente" },
    { id: "stock", label: "Stock" }
]

export default function FiltroYOrden({ filtros, onFiltroChange }) {
    const [categorias, setCategorias] = useState([])
    const [loadingCategorias, setLoadingCategorias] = useState(true)

    // Cargamos todas las categorías directamente de la API de DummyJSON
    useEffect(() => {
        let isMounted = true

        fetch("https://dummyjson.com/products/categories")
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener categorías")
                return res.json()
            })
            .then((data) => {
                if (!isMounted) return

                if (Array.isArray(data)) {
                    // La API devuelve un array de objetos [{ slug, name, url }]
                    // o strings según la versión; normalizamos a { slug, name }
                    const lista = data.map((item) => {
                        if (typeof item === "object" && item !== null) {
                            return {
                                slug: item.slug || item.name,
                                name: item.name || item.slug
                            }
                        }
                        return {
                            slug: String(item),
                            name: String(item).charAt(0).toUpperCase() + String(item).slice(1)
                        }
                    })
                    setCategorias(lista)
                }
            })
            .catch((error) => {
                console.error("Error cargando categorías:", error)
            })
            .finally(() => {
                if (isMounted) setLoadingCategorias(false)
            })

        return () => {
            isMounted = false
        }
    }, [])

    const handleOrdenarChange = (event) => {
        onFiltroChange("ordenarPor", event.target.value)
    }

    const handleCategoriaChange = (event) => {
        onFiltroChange("categoria", event.target.value)
    }

    const handlePrecioMinChange = (event) => {
        onFiltroChange("precioMin", event.target.value)
    }

    const handlePrecioMaxChange = (event) => {
        onFiltroChange("precioMax", event.target.value)
    }

    const handleStockChange = (event) => {
        onFiltroChange("stock", event.target.value)
    }

    return (
        <div className="filtro-orden">
            {/* Ordenamiento */}
            <div className="orden ordenar-por">
                <label htmlFor="ordenar">Ordenar por:</label>
                <select 
                    id="ordenar" 
                    value={filtros.ordenarPor} 
                    onChange={handleOrdenarChange}
                >
                    {ORDENES.map((orden) => (
                        <option key={orden.id} value={orden.id}>
                            {orden.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Filtro de categoría */}
            <div className="orden filtro-categoria">
                <label htmlFor="categoria">Filtrar por categoría:</label>
                <select 
                    id="categoria" 
                    value={filtros.categoria} 
                    onChange={handleCategoriaChange}
                >
                    <option value="">
                        {loadingCategorias ? "Cargando categorías..." : "Todas las categorías"}
                    </option>
                    {categorias.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Rango de precios */}
            <div className="orden filtro-precio">
                <input 
                    type="number" 
                    placeholder="Precio mínimo" 
                    value={filtros.precioMin} 
                    onChange={handlePrecioMinChange} 
                />
                <input 
                    type="number" 
                    placeholder="Precio máximo" 
                    value={filtros.precioMax} 
                    onChange={handlePrecioMaxChange} 
                />
            </div>

            {/* Filtro por stock */}
            <div className="orden filtro-stock">
                <label htmlFor="stock">Filtrar por stock:</label>
                <select 
                    id="stock" 
                    value={filtros.stock} 
                    onChange={handleStockChange}
                >
                    <option value="">Todos los stocks</option>
                    <option value="en stock">En stock</option>
                    <option value="sin stock">Sin stock</option>
                </select>
            </div>
        </div>
    )
}
