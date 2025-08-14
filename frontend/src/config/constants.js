// Obtener solo la dirección IP del host actual
const getHostIP = () => {
  const hostname = window.location.hostname;
  const ipRegex = /\d+\.\d+\.\d+\.\d+/;
  const match = hostname.match(ipRegex);
  return match ? match[0] : hostname;
}

export const URLBASE = 'https://proyecto-final-7ttv.onrender.com'
//export const URLBASE = 'https://shortenqr.com/api' // ruta del backend

export const ENDPOINT = {
  login: `${URLBASE}/login`,
  users: `${URLBASE}/usuarios`,
  uproductos: `${URLBASE}/user-productos`,
  productos: `${URLBASE}/all-productos`,
  producto: `${URLBASE}/producto`,
  usuario: `${URLBASE}/usuario`,
  favoritos: `${URLBASE}/favoritos`,
  eliminarFavorito: `${URLBASE}/favoritos`,
  registerFavorite: `${URLBASE}/favoritos`,
  registrarProducto: `${URLBASE}/productos`,
  eliminarProducto: `${URLBASE}/user-productos`,
  actualizarProducto: `${URLBASE}/productos`,
}
