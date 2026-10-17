import Navbar from './components/NavBar.jsx'
import ListProducts from './pages/ListProducts.jsx'

export default function App() {
  return (
      <div style={{ paddingTop: '4rem' }}>
        <Navbar />
        <ListProducts />
      </div>
  )
}