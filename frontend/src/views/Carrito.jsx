import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { ProductsContext } from '../contexts/FavsContext';
import { Link } from 'react-router-dom';
import { URLBASE } from '../config/constants';

const Carrito = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { products } = useContext(ProductsContext);

  const getStock = (id) => {
    const producto = products.find((prod) => prod.id === id);
    return producto ? producto.stock : 0;
  };

  const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  const handleIncrementarCantidad = (item) => {
    const stock = getStock(item.id);
    if (item.quantity < stock) {
      updateQuantity(item.id, item.quantity + 1);
    } 
  };

  const handleReducirCantidad = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="container mt-4">
      <h2>Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div className="row">
            {cart.map((item) => {
              const stock = getStock(item.id);
              return (
                <div key={item.id} className="col-md-4 mb-4">
                  <div className="card" style={{ width: '18rem' }}>
                    <img src={ item.imagen.startsWith("http") 
                                  ? item.imagen 
                                  : `${URLBASE}${item.imagen}`} className="card-img-top" alt={item.nombre} />
                    <div className="card-body">
                      <h5 className="card-title">{item.nombre}</h5>
                      <p className="card-text">Precio: ${formatPrice(item.precio)}</p>
                      <p className="card-text">
                        Cantidad:
                        <button
                          onClick={() => handleReducirCantidad(item)}
                          className="btn btn-sm btn-secondary mx-2"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        {item.quantity}
                        <button
                          onClick={() => handleIncrementarCantidad(item)}
                          className="btn btn-sm btn-secondary mx-2"
                          disabled={item.quantity >= stock}
                        >
                          +
                        </button>
                      </p>
                      <p className="card-text">Subtotal: ${formatPrice(item.precio * item.quantity)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-danger"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-right mt-3">
            <h4>Total: ${formatPrice(total)}</h4>
            <Link to="/checkout" className="btn btn-success">Proceder al pago</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
