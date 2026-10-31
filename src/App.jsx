import Navbar from './components/NavBar.jsx'
import ListProducts from './pages/ListProducts.jsx'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Compras from './pages/Compras.jsx'
import Producto from './pages/Producto.jsx'
import Checkout from './pages/Checkout.jsx'
import CartProvider from './Hooks/Contextos/CartProvider.jsx'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div style={{ paddingTop: '4rem' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<ListProducts />} />
            <Route path="/carrito" element={<Compras />} />
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<h1 style={{ textAlign: "center", marginTop: "3rem" }}>404 - Página no encontrada</h1>} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}
