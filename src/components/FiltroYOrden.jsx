import "./FiltroYOrden.css"
import { useEffect, useMemo, useState } from "react"

const CATEGORIAS = ["beauty", "fragrances", "furniture", "groceries"]
const ORDENES = {
    "nombre": (a, b) => a.title.localeCompare(b.title),
    "precio ascendente": (a, b) => a.price - b.price,
    "precio descendente": (a, b) => b.price - a.price,
    "stock": (a, b) => b.stock - a.stock
}

export default function FiltroYOrden({ productos, setProductos }) {
    const [ordenarPor, setOrdenarPor] = useState("nombre") // Estado para el criterio de ordenamiento
    const [filtroCategoria, setFiltroCategoria] = useState("") // Estado para el filtro de categoría
    const [filtroPrecioMin, setFiltroPrecioMin] = useState("") // Estado para el filtro de precio mínimo
    const [filtroPrecioMax, setFiltroPrecioMax] = useState("") // Estado para el filtro de precio máximo
    const [filtroStock, setFiltroStock] = useState("") // Estado para el filtro de stock

    const productosFiltrados = useMemo(() => {
        return productos.filter(producto => {
            const coincideCategoria = !filtroCategoria || producto.category === filtroCategoria;
            const coincidePrecioMinimo = filtroPrecioMin === "" || producto.price >= Number(filtroPrecioMin);
            const coincidePrecioMaximo = filtroPrecioMax === "" || producto.price <= Number(filtroPrecioMax);
            const coincideStock = !filtroStock ||
                (filtroStock === "en stock" && producto.stock > 0) ||
                (filtroStock === "sin stock" && producto.stock <= 0);

            return coincideCategoria && coincidePrecioMinimo && coincidePrecioMaximo && coincideStock;
        });
    }, [productos, filtroCategoria, filtroPrecioMin, filtroPrecioMax, filtroStock]);

    const productosOrdenados = useMemo(() => {
        const comparador = ORDENES[ordenarPor] || ORDENES.nombre;
        return [...productosFiltrados].sort(comparador);
    }, [productosFiltrados, ordenarPor]);

    useEffect(() => {
        const sinCambios = productos.length === productosOrdenados.length &&
            productos.every((producto, indice) => producto === productosOrdenados[indice]);

        if (!sinCambios) {
            setProductos(productosOrdenados);
        }
    }, [productos, productosOrdenados, setProductos]);

    const handlePrecioMinChange = (event) => {
        setFiltroPrecioMin(event.target.value)
    }

    const handlePrecioMaxChange = (event) => {
        setFiltroPrecioMax(event.target.value)
    }

    const handleStockChange = (event) => {
        setFiltroStock(event.target.value)
    }
    
    const handleOrdenarChange = (event) => {
        setOrdenarPor(event.target.value)
    }

    const handleFiltroChange = (event) => {
        setFiltroCategoria(event.target.value)
    }
    return (
        <div className="filtro-orden">
            {/* ordenamiento */}
            <div className="orden ordenar-por">
                <label htmlFor="ordenar">Ordenar por:</label>
                <select id="ordenar" value={ordenarPor} onChange={handleOrdenarChange}>
                    {Array.from(Object.keys(ORDENES)).map((orden) => (
                        <option key={orden} value={orden}>
                            {orden.charAt(0).toUpperCase() + orden.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            {/* Filtro de categoría */}
            <div className="orden filtro-categoria">
                <label htmlFor="categoria">Filtrar por categoría:</label>
                <select id="categoria" value={filtroCategoria} onChange={handleFiltroChange}>
                    <option value="">Todas las categorías</option>
                    {CATEGORIAS.map((categoria) => (
                        <option key={categoria} value={categoria}>
                            {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            {/* rango de precios */}
            <div className="orden filtro-precio">
                <input type="number" placeholder="Precio mínimo" value={filtroPrecioMin} onChange={handlePrecioMinChange} />
                <input type="number" placeholder="Precio máximo" value={filtroPrecioMax} onChange={handlePrecioMaxChange} />
            </div>
            {/* Filtro por stock */}
            <div className="orden filtro-stock">
                <label htmlFor="stock">Filtrar por stock:</label>
                <select id="stock" value={filtroStock} onChange={handleStockChange}>
                    <option value="">Todos los stocks</option>
                    <option value="en stock">En stock</option>
                    <option value="sin stock">Sin stock</option>
                </select>
            </div>
        </div>
    )
}