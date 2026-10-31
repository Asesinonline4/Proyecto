import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../Hooks/Contextos/CartProvider.jsx"
import "./Checkout.css"

export default function Checkout() {
    const { cart, totalPrice, totalItems, clearCart } = useContext(CartContext)

    // Formulario de datos
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        confirmEmail: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        metodoPago: "tarjeta",
        numeroTarjeta: "",
        vencimiento: "",
        cvv: "",
        titular: ""
    })

    const [errores, setErrores] = useState({})
    const [ordenConfirmada, setOrdenConfirmada] = useState(null)
    const [procesando, setProcesando] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        // Limpiamos el error de este campo al tipear
        if (errores[name]) {
            setErrores((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const validarFormulario = () => {
        const nuevosErrores = {}

        if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio."
        if (!formData.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio."
        
        if (!formData.email.trim()) {
            nuevosErrores.email = "El correo electrónico es obligatorio."
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            nuevosErrores.email = "Ingresa un correo electrónico válido."
        }

        if (formData.email !== formData.confirmEmail) {
            nuevosErrores.confirmEmail = "Los correos electrónicos no coinciden."
        }

        if (!formData.telefono.trim()) {
            nuevosErrores.telefono = "El teléfono es obligatorio."
        } else if (!/^\+?[0-9\s-]{6,15}$/.test(formData.telefono.trim())) {
            nuevosErrores.telefono = "Ingresa un número de teléfono válido."
        }

        if (!formData.direccion.trim()) nuevosErrores.direccion = "La dirección de entrega es obligatoria."
        if (!formData.ciudad.trim()) nuevosErrores.ciudad = "La ciudad es obligatoria."
        if (!formData.codigoPostal.trim()) nuevosErrores.codigoPostal = "El código postal es obligatorio."

        if (formData.metodoPago === "tarjeta") {
            const numeroLimpio = formData.numeroTarjeta.replace(/\s+/g, '')
            if (!numeroLimpio || numeroLimpio.length < 13 || isNaN(numeroLimpio)) {
                nuevosErrores.numeroTarjeta = "Ingresa los 16 dígitos de tu tarjeta."
            }
            if (!formData.titular.trim()) {
                nuevosErrores.titular = "Ingresa el nombre del titular."
            }
            if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.vencimiento.trim())) {
                nuevosErrores.vencimiento = "Formato MM/AA requerido."
            }
            if (!/^[0-9]{3,4}$/.test(formData.cvv.trim())) {
                nuevosErrores.cvv = "CVV inválido (3 o 4 dígitos)."
            }
        }

        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validarFormulario()) {
            return
        }

        setProcesando(true)

        // Simulamos un procesamiento de pago de 1.2 segundos
        setTimeout(() => {
            const idOrden = "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000)

            const nuevaOrden = {
                id: idOrden,
                fecha: new Date().toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }),
                cliente: { ...formData },
                items: [...cart],
                total: totalPrice,
                totalItems
            }

            setOrdenConfirmada(nuevaOrden)
            clearCart()
            setProcesando(false)
        }, 1200)
    }

    // PANTALLA: COMPRA CONFIRMADA CON ÉXITO
    if (ordenConfirmada) {
        return (
            <div className="checkout-exito-pagina">
                <div className="checkout-exito-card">
                    <div className="exito-icono">🎉</div>
                    <span className="badge-completado">¡Pago Confirmado!</span>
                    <h1>¡Muchas gracias por tu compra!</h1>
                    <p className="exito-subtitulo">
                        Tu pedido ha sido procesado con éxito y ya está en preparación.
                    </p>

                    <div className="orden-detalles-box">
                        <div className="orden-id-banner">
                            <span>Código de Orden:</span>
                            <strong>#{ordenConfirmada.id}</strong>
                        </div>

                        <div className="orden-info-grid">
                            <div>
                                <h4>Datos del Comprador</h4>
                                <p>{ordenConfirmada.cliente.nombre} {ordenConfirmada.cliente.apellido}</p>
                                <p>{ordenConfirmada.cliente.email}</p>
                                <p>Tel: {ordenConfirmada.cliente.telefono}</p>
                            </div>
                            <div>
                                <h4>Destino de Entrega</h4>
                                <p>{ordenConfirmada.cliente.direccion}</p>
                                <p>{ordenConfirmada.cliente.ciudad} (CP {ordenConfirmada.cliente.codigoPostal})</p>
                                <p>Método de pago: <span className="capitalizar">{ordenConfirmada.cliente.metodoPago}</span></p>
                            </div>
                        </div>

                        <div className="orden-items-resumen">
                            <h4>Resumen del Pedido ({ordenConfirmada.totalItems} artículos)</h4>
                            <div className="orden-items-lista">
                                {ordenConfirmada.items.map((item) => {
                                    const precio = Number(item.precio ?? item.price ?? 0)
                                    const imagen = item.imagen ?? item.images?.[0] ?? item.thumbnail
                                    return (
                                        <div key={item.id} className="orden-item-fila">
                                            <img src={imagen} alt={item.nombre ?? item.title} />
                                            <div className="orden-item-datos">
                                                <p className="nombre">{item.nombre ?? item.title}</p>
                                                <p className="cantidad-precio">{item.quantity} x ${precio.toFixed(2)}</p>
                                            </div>
                                            <span className="subtotal">${(precio * item.quantity).toFixed(2)}</span>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="orden-total-fila">
                                <span>Total Pagado:</span>
                                <strong>${ordenConfirmada.total.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>

                    <p className="nota-email">
                        ✉️ Te enviamos los detalles del envío y la factura a <strong>{ordenConfirmada.cliente.email}</strong>.
                    </p>

                    <Link to="/" className="btn-volver-tienda">
                        ← Volver a la Tienda
                    </Link>
                </div>
            </div>
        )
    }

    // PANTALLA: CARRITO VACÍO
    if (!cart || cart.length === 0) {
        return (
            <div className="checkout-vacio-contenedor">
                <div className="vacio-icono">🛒</div>
                <h2>No hay artículos en tu carrito</h2>
                <p>Agrega productos antes de realizar el checkout.</p>
                <Link to="/" className="btn-ir-catalogo">Ir al catálogo de productos</Link>
            </div>
        )
    }

    // PANTALLA: FORMULARIO DE CHECKOUT
    return (
        <div className="checkout-pagina">
            <div className="checkout-header">
                <Link to="/carrito" className="checkout-volver">← Volver al carrito</Link>
                <h1>Finalizar Compra</h1>
                <p>Completa tus datos para confirmar tu pedido.</p>
            </div>

            <div className="checkout-grid">
                {/* COLUMNA IZQUIERDA: FORMULARIO */}
                <form className="checkout-form" onSubmit={handleSubmit} noValidate>
                    {/* SECCIÓN 1: DATOS PERSONALES */}
                    <div className="form-seccion">
                        <h2>1. Datos Personales</h2>
                        <div className="form-row">
                            <div className="form-grupo">
                                <label htmlFor="nombre">Nombre *</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Juan"
                                    className={errores.nombre ? "input-error" : ""}
                                />
                                {errores.nombre && <span className="error-msg">{errores.nombre}</span>}
                            </div>
                            <div className="form-grupo">
                                <label htmlFor="apellido">Apellido *</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    placeholder="Pérez"
                                    className={errores.apellido ? "input-error" : ""}
                                />
                                {errores.apellido && <span className="error-msg">{errores.apellido}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-grupo">
                                <label htmlFor="email">Correo Electrónico *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="tuemail@ejemplo.com"
                                    className={errores.email ? "input-error" : ""}
                                />
                                {errores.email && <span className="error-msg">{errores.email}</span>}
                            </div>
                            <div className="form-grupo">
                                <label htmlFor="confirmEmail">Confirmar Correo *</label>
                                <input
                                    type="email"
                                    id="confirmEmail"
                                    name="confirmEmail"
                                    value={formData.confirmEmail}
                                    onChange={handleChange}
                                    placeholder="tuemail@ejemplo.com"
                                    className={errores.confirmEmail ? "input-error" : ""}
                                />
                                {errores.confirmEmail && <span className="error-msg">{errores.confirmEmail}</span>}
                            </div>
                        </div>

                        <div className="form-grupo">
                            <label htmlFor="telefono">Teléfono de contacto *</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="11 2345-6789"
                                className={errores.telefono ? "input-error" : ""}
                            />
                            {errores.telefono && <span className="error-msg">{errores.telefono}</span>}
                        </div>
                    </div>

                    {/* SECCIÓN 2: DIRECCIÓN DE ENTREGA */}
                    <div className="form-seccion">
                        <h2>2. Dirección de Entrega</h2>
                        <div className="form-grupo">
                            <label htmlFor="direccion">Calle y número (piso, dpto) *</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                placeholder="Av. Corrientes 1234, 4B"
                                className={errores.direccion ? "input-error" : ""}
                            />
                            {errores.direccion && <span className="error-msg">{errores.direccion}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-grupo">
                                <label htmlFor="ciudad">Ciudad / Localidad *</label>
                                <input
                                    type="text"
                                    id="ciudad"
                                    name="ciudad"
                                    value={formData.ciudad}
                                    onChange={handleChange}
                                    placeholder="Buenos Aires"
                                    className={errores.ciudad ? "input-error" : ""}
                                />
                                {errores.ciudad && <span className="error-msg">{errores.ciudad}</span>}
                            </div>
                            <div className="form-grupo">
                                <label htmlFor="codigoPostal">Código Postal *</label>
                                <input
                                    type="text"
                                    id="codigoPostal"
                                    name="codigoPostal"
                                    value={formData.codigoPostal}
                                    onChange={handleChange}
                                    placeholder="1414"
                                    className={errores.codigoPostal ? "input-error" : ""}
                                />
                                {errores.codigoPostal && <span className="error-msg">{errores.codigoPostal}</span>}
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 3: MÉTODO DE PAGO */}
                    <div className="form-seccion">
                        <h2>3. Método de Pago</h2>
                        <div className="metodos-pago-opciones">
                            <label className={`metodo-pago-card ${formData.metodoPago === "tarjeta" ? "activo" : ""}`}>
                                <input
                                    type="radio"
                                    name="metodoPago"
                                    value="tarjeta"
                                    checked={formData.metodoPago === "tarjeta"}
                                    onChange={handleChange}
                                />
                                <span className="icono">💳</span>
                                <div>
                                    <strong>Tarjeta de Crédito / Débito</strong>
                                    <p>Acreditación instantánea</p>
                                </div>
                            </label>

                            <label className={`metodo-pago-card ${formData.metodoPago === "transferencia" ? "activo" : ""}`}>
                                <input
                                    type="radio"
                                    name="metodoPago"
                                    value="transferencia"
                                    checked={formData.metodoPago === "transferencia"}
                                    onChange={handleChange}
                                />
                                <span className="icono">🏦</span>
                                <div>
                                    <strong>Transferencia Bancaria</strong>
                                    <p>Datos bancarios al finalizar</p>
                                </div>
                            </label>

                            <label className={`metodo-pago-card ${formData.metodoPago === "efectivo" ? "activo" : ""}`}>
                                <input
                                    type="radio"
                                    name="metodoPago"
                                    value="efectivo"
                                    checked={formData.metodoPago === "efectivo"}
                                    onChange={handleChange}
                                />
                                <span className="icono">💵</span>
                                <div>
                                    <strong>Efectivo contra entrega</strong>
                                    <p>Pagas al recibir en tu domicilio</p>
                                </div>
                            </label>
                        </div>

                        {formData.metodoPago === "tarjeta" && (
                            <div className="campos-tarjeta">
                                <div className="form-grupo">
                                    <label htmlFor="titular">Nombre impreso en la tarjeta *</label>
                                    <input
                                        type="text"
                                        id="titular"
                                        name="titular"
                                        value={formData.titular}
                                        onChange={handleChange}
                                        placeholder="JUAN PEREZ"
                                        className={errores.titular ? "input-error" : ""}
                                    />
                                    {errores.titular && <span className="error-msg">{errores.titular}</span>}
                                </div>

                                <div className="form-grupo">
                                    <label htmlFor="numeroTarjeta">Número de Tarjeta *</label>
                                    <input
                                        type="text"
                                        id="numeroTarjeta"
                                        name="numeroTarjeta"
                                        maxLength="19"
                                        value={formData.numeroTarjeta}
                                        onChange={handleChange}
                                        placeholder="4500 1234 5678 9010"
                                        className={errores.numeroTarjeta ? "input-error" : ""}
                                    />
                                    {errores.numeroTarjeta && <span className="error-msg">{errores.numeroTarjeta}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="form-grupo">
                                        <label htmlFor="vencimiento">Vencimiento *</label>
                                        <input
                                            type="text"
                                            id="vencimiento"
                                            name="vencimiento"
                                            maxLength="5"
                                            value={formData.vencimiento}
                                            onChange={handleChange}
                                            placeholder="MM/AA"
                                            className={errores.vencimiento ? "input-error" : ""}
                                        />
                                        {errores.vencimiento && <span className="error-msg">{errores.vencimiento}</span>}
                                    </div>

                                    <div className="form-grupo">
                                        <label htmlFor="cvv">Código de Seguridad (CVV) *</label>
                                        <input
                                            type="password"
                                            id="cvv"
                                            name="cvv"
                                            maxLength="4"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            placeholder="123"
                                            className={errores.cvv ? "input-error" : ""}
                                        />
                                        {errores.cvv && <span className="error-msg">{errores.cvv}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {formData.metodoPago === "transferencia" && (
                            <div className="info-transferencia">
                                <p>💡 Al confirmar tu pedido te brindaremos el CBU/Alias para transferir con un <strong>10% de descuento adicional</strong>.</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-confirmar-compra"
                        disabled={procesando}
                    >
                        {procesando ? (
                            <span className="cargando-texto">
                                <span className="mini-spinner"></span> Procesando pago...
                            </span>
                        ) : (
                            `Pagar $${totalPrice.toFixed(2)}`
                        )}
                    </button>
                </form>

                {/* COLUMNA DERECHA: RESUMEN DE COMPRA */}
                <aside className="checkout-resumen-sidebar">
                    <div className="resumen-card">
                        <h3>Resumen del Pedido</h3>
                        <p className="resumen-articulos-badge">{totalItems} {totalItems === 1 ? "artículo" : "artículos"}</p>

                        <div className="resumen-articulos-scroll">
                            {cart.map((item) => {
                                const precio = Number(item.precio ?? item.price ?? 0)
                                const imagen = item.imagen ?? item.images?.[0] ?? item.thumbnail
                                return (
                                    <div key={item.id} className="articulo-mini">
                                        <img src={imagen} alt={item.nombre ?? item.title} />
                                        <div className="articulo-mini-info">
                                            <p className="nombre">{item.nombre ?? item.title}</p>
                                            <p className="cant">Cant: {item.quantity}</p>
                                        </div>
                                        <span className="precio">${(precio * item.quantity).toFixed(2)}</span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="resumen-desglose">
                            <div className="desglose-linea">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="desglose-linea">
                                <span>Costo de envío</span>
                                <span className="envio-gratis">GRATIS</span>
                            </div>
                            <div className="desglose-linea total-final">
                                <span>Total Final</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="garantia-segura">
                            <span>🔒 Compra 100% segura y protegida</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

