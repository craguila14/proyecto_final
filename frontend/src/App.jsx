import './App.css'
import {Routes, Route } from 'react-router-dom'
import Context from './contexts/Context'
import useAuth from './hooks/useUser'
import { AuthProvider } from './contexts/AuthContext'
import ShopProvider from './contexts/FavsContext'
import Navbar from './components/Navbar'
import Home from './views/Home'
import Footer from './components/Footer'
import InicioSesion from './views/InicioSesion'
import Registrarse from './views/Registrarse'
import Perfil from './views/Perfil'
import Productos from './views/Productos'
import DetalleProducto from './views/DetalleProducto'
import Favoritos from './views/Favoritos'
import MisProductos from './views/MisProductos'


function App() {

  const globalState = useAuth()

  return (
    <>
      <AuthProvider>
      <ShopProvider>
        <Context.Provider value={globalState}>
      <div className='app-container'>
        <Navbar/>
          <main style={{backgroundColor: '#faf4d3'}}>
           
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/login' element={<InicioSesion/>}/>
              <Route path='/registrarse' element={<Registrarse/>}/>
              <Route path='/perfil' element={<Perfil/>}/>
              <Route path='/productos' element={<Productos/>}/>
              <Route path='/mis-productos' element={<MisProductos/>}/>
              <Route path='/producto/:id' element={<DetalleProducto/>}/>
              <Route path='/favoritos' element={<Favoritos/>}/> 
            </Routes>
          
          </main>
          <Footer/>
        </div>
        </Context.Provider>
        </ShopProvider>
      </AuthProvider>
    </>
  );
}

export default App;
