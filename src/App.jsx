import Navbar from './components/NavBar.jsx'
import ListProducts from './pages/ListProducts.jsx'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Compras from './pages/Compras.jsx'

export default function App() {
  return (
      <BrowserRouter>
        <div style={{ paddingTop: '4rem' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<ListProducts />} />
            <Route path="/carrito" element={<Compras />} />
          </Routes>
        </div>
      </BrowserRouter>
  )
}