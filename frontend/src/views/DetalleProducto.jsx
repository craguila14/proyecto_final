import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';
import { ProductsContext } from '../contexts/FavsContext';
import { ENDPOINT, URLBASE } from "../config/constants"; 
import { useAuth } from '../contexts/AuthContext';

const DetalleProducto = () => {
  const { currentUser } = useAuth()
  const { id } = useParams(); 
  const { likedProducts, handleLike } = useContext(ProductsContext);
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState(""); 
  const { addToCart } = useContext(CartContext);
  const [vendedor, setVendedor] = useState(null);
  const [errorVendedor, setErrorVendedor] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const token = currentUser?.token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const respuesta = await axios.get(`${ENDPOINT.producto}/${id}`, {headers});
        setProducto(respuesta.data); 
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        setError('No se pudo cargar el producto');
      }
    };

    cargarProducto();
  }, [id, currentUser?.token]);

  const handleIncrementarCantidad = () => {
    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1);
      setError(""); 
    } else {
      setError("No se puede agregar más del stock disponible.");
    }
  };

  const handleReducirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
      setError(""); 
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...producto, quantity: cantidad });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000); // La confirmación desaparecerá después de 2 segundos
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (!producto) {
    return <div>Cargando producto...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 d-flex flex-column align-items-center">
          <img
            src={ producto.imagen.startsWith("http") 
                    ? producto.imagen 
                    : `${URLBASE}${producto.imagen}`}
            alt={producto.nombre}
            className="img-fluid mb-4"
            style={{ maxHeight: "400px" }}
          />
          <button
            className={`btn ${likedProducts.includes(producto.id) ? "btn-danger" : "btn-outline-danger"} mt-3`}
            onClick={() => handleLike(producto.id)}
          >
            {likedProducts.includes(producto.id) ? "❤️ Agregado a Favoritos" : "🤍 Agregar a Favoritos"}
          </button>
        </div>

        <div className="col-md-6">
          <small className="text-muted">Vendedor: {producto.usuario_nombre} {producto.usuario_apellido}</small>
          <h2>{producto.nombre}</h2>
          <h4>${formatPrice(producto.precio)}</h4>
          <p>{producto.descripcion}</p>
          
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary"
              onClick={handleReducirCantidad}
            >
              -
            </button>
            
            <input
              type="number"
              value={cantidad}
              className="form-control mx-2"
              style={{ width: "60px", textAlign: "center" }}
              readOnly
            />
            <button
              className="btn btn-outline-secondary"
              onClick={handleIncrementarCantidad}
            >
              +
            </button>
            <button className="btn btn-warning m-3" onClick={handleAddToCart}>Agregar al Carrito</button>
            {addedToCart && <span className="text-success ms-2">¡Producto añadido al carrito!</span>}
          </div>
          <p>Stock disponible: {producto.stock}</p>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
