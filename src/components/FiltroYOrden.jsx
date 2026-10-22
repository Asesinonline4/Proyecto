export default function FiltroYOrden({ ordenarPor, setOrdenarPor, filtroCategoria, setFiltroCategoria, categorias, ordenes }) {
    const handleOrdenarChange = (event) => {
        setOrdenarPor(event.target.value)
    }

    const handleFiltroChange = (event) => {
        setFiltroCategoria(event.target.value)
    }
    return (
        <div className="filtro-orden">
            <div className="ordenar">
                <label htmlFor="ordenar">Ordenar por:</label>
                <select id="ordenar" value={ordenarPor} onChange={handleOrdenarChange}>
                    {Array.from(Object.keys(ordenes)).map((orden) => (
                        <option key={orden} value={orden}>
                            {orden.charAt(0).toUpperCase() + orden.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="filtro">
                <label htmlFor="categoria">Filtrar por categoría:</label>
                <select id="categoria" value={filtroCategoria} onChange={handleFiltroChange}>
                    <option value="">Todas las categorías</option>
                    {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                            {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}