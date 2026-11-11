import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { CartContext } from "../Hooks/Contextos/CartProvider.jsx"
import './Producto.css'

export default function Producto() {
    const { id } = useParams()
    const { addToCart } = useContext(CartContext)

    const [resultado, setResultado] = useState({ id: null, producto: null, error: null })
    const loading = resultado.id !== id
    const producto = loading ? null : resultado.producto
    const error = loading ? null : resultado.error
    const [imagenActual, setImagenActual] = useState(0)
    const [cantidad, setCantidad] = useState(1)
    const [agregadoMensaje, setAgregadoMensaje] = useState(false)

    useEffect(() => {
        const controller = new AbortController()

        fetch(`https://dummyjson.com/products/${id}`, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("No se pudo cargar el producto.")
                }
                return res.json()
            })
            .then((json) => {
                setResultado({ id, producto: json, error: null })
                setImagenActual(0)
                setCantidad(1)
            })
            .catch((err) => {
                if (err.name === "AbortError") return
                console.error("Error fetching product:", err)
                setResultado({ id, producto: null, error: err.message || "Error al cargar el producto." })
            })

        return () => controller.abort()
    }, [id])

    // Garantizamos la lista de imágenes reuniendo images y thumbnail (sin duplicados)
    const listaImagenes = []
    if (Array.isArray(producto?.images)) {
        listaImagenes.push(...producto.images)
    }
    if (producto?.thumbnail && !listaImagenes.includes(producto.thumbnail)) {
        listaImagenes.push(producto.thumbnail)
    }
    const imagenes = listaImagenes.length > 0 
        ? listaImagenes 
        : (producto?.thumbnail ? [producto.thumbnail] : [])

    const anteriorImagen = () => {
        if (imagenes.length <= 1) return
        setImagenActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))
    }

    const siguienteImagen = () => {
        if (imagenes.length <= 1) return
        setImagenActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
    }

    const handleCantidadChange = (cambio) => {
        const stockDisponible = producto?.stock || 0
        setCantidad((prev) => {
            const nueva = prev + cambio
            if (nueva < 1) return 1
            if (nueva > stockDisponible) return stockDisponible
            return nueva
        })
    }

    const handleAgregarCarrito = () => {
        if (!producto || producto.stock <= 0) return
        addToCart(producto, cantidad)
        setAgregadoMensaje(true)
        setTimeout(() => setAgregadoMensaje(false), 3000)
    }

    if (loading) {
        return (
            <div className="detalle-estado-contenedor">
                <div className="spinner"></div>
                <p>Cargando información del producto...</p>
            </div>
        )
    }

    if (error || !producto) {
        return (
            <div className="detalle-estado-contenedor">
                <h2>Ocurrió un error</h2>
                <p>{error || "Producto no encontrado."}</p>
                <Link to="/" className="btn-volver">← Volver al catálogo</Link>
            </div>
        )
    }

    const precioOriginal = producto.discountPercentage 
        ? (producto.price / (1 - producto.discountPercentage / 100)).toFixed(2)
        : null

    return (
        <div className="detalle-pagina">
            <Link to="/" className="btn-volver">← Volver al catálogo</Link>

            <div className="producto-detalle">
                {/* SECCIÓN DEL CARRUSEL */}
                <div className="carrusel-contenedor">
                    <div className="carrusel-visor">
                        {/* Botón Imagen Anterior (Siempre visible con SVG nítido) */}
                        <button 
                            className="carrusel-btn prev" 
                            onClick={anteriorImagen}
                            disabled={imagenes.length <= 1}
                            aria-label="Imagen anterior"
                            type="button"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>

                        <img 
                            src={imagenes[imagenActual] || producto.thumbnail} 
                            alt={`${producto.title} - imagen ${imagenActual + 1}`} 
                            className="carrusel-imagen-principal"
                        />

                        {/* Botón Siguiente Imagen (Siempre visible con SVG nítido) */}
                        <button 
                            className="carrusel-btn next" 
                            onClick={siguienteImagen}
                            disabled={imagenes.length <= 1}
                            aria-label="Siguiente imagen"
                            type="button"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        {/* Badge Contador */}
                        {imagenes.length > 0 && (
                            <div className="carrusel-badge-contador">
                                {imagenActual + 1} / {imagenes.length}
                            </div>
                        )}
                    </div>

                    {/* MINIATURAS */}
                    {imagenes.length > 0 && (
                        <div className="carrusel-miniaturas">
                            {imagenes.map((imgUrl, index) => (
                                <button
                                    key={index}
                                    className={`miniatura-item ${index === imagenActual ? "activa" : ""}`}
                                    onClick={() => setImagenActual(index)}
                                    type="button"
                                    aria-label={`Ver imagen ${index + 1}`}
                                >
                                    <img src={imgUrl} alt={`Miniatura ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* INFORMACIÓN DEL PRODUCTO */}
                <div className="producto-info">
                    <div className="producto-tags">
                        <span className="tag-categoria">{producto.category}</span>
                        {producto.brand && <span className="tag-marca">{producto.brand}</span>}
                    </div>

                    <h1 className="producto-titulo">{producto.title}</h1>

                    {producto.rating && (
                        <div className="producto-rating">
                            <span className="estrellas">★</span>
                            <span className="rating-valor">{producto.rating}</span>
                            <span className="rating-max">/ 5</span>
                        </div>
                    )}

                    <div className="producto-precio-seccion">
                        <span className="precio-actual">${producto.price.toFixed(2)}</span>
                        {precioOriginal && (
                            <>
                                <span className="precio-anterior">${precioOriginal}</span>
                                <span className="badge-descuento">-{Math.round(producto.discountPercentage)}% OFF</span>
                            </>
                        )}
                    </div>

                    <p className="producto-descripcion">{producto.description}</p>

                    <div className="producto-stock-seccion">
                        <span className="label-stock">Disponibilidad:</span>
                        {producto.stock > 0 ? (
                            <span className="stock-disponible">En stock ({producto.stock} disponibles)</span>
                        ) : (
                            <span className="stock-agotado">Agotado</span>
                        )}
                    </div>

                    {/* SELECTOR DE CANTIDAD Y AGREGAR AL CARRITO */}
                    <div className="producto-acciones">
                        <div className="cantidad-selector">
                            <button 
                                onClick={() => handleCantidadChange(-1)} 
                                disabled={cantidad <= 1 || producto.stock <= 0}
                                type="button"
                                aria-label="Restar unidad"
                            >
                                -
                            </button>
                            <span>{producto.stock > 0 ? cantidad : 0}</span>
                            <button 
                                onClick={() => handleCantidadChange(1)} 
                                disabled={cantidad >= producto.stock || producto.stock <= 0}
                                type="button"
                                aria-label="Sumar unidad"
                            >
                                +
                            </button>
                        </div>

                        <button 
                            className="btn-agregar-carrito"
                            disabled={producto.stock <= 0}
                            onClick={handleAgregarCarrito}
                            type="button"
                        >
                            {producto.stock > 0 ? "Agregar al Carrito" : "Sin Stock"}
                        </button>
                    </div>

                    {agregadoMensaje && (
                        <div className="alerta-agregado">
                            ¡Agregaste {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'} al carrito!
                        </div>
                    )}

                    {/* CARACTERÍSTICAS ADICIONALES */}
                    <div className="detalles-extras">
                        {producto.warrantyInformation && (
                            <div className="extra-item">
                                <span className="extra-icono">🛡️</span>
                                <div>
                                    <strong>Garantía</strong>
                                    <p>{producto.warrantyInformation}</p>
                                </div>
                            </div>
                        )}
                        {producto.shippingInformation && (
                            <div className="extra-item">
                                <span className="extra-icono">🚚</span>
                                <div>
                                    <strong>Envío</strong>
                                    <p>{producto.shippingInformation}</p>
                                </div>
                            </div>
                        )}
                        {producto.returnPolicy && (
                            <div className="extra-item">
                                <span className="extra-icono">🔄</span>
                                <div>
                                    <strong>Devoluciones</strong>
                                    <p>{producto.returnPolicy}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
