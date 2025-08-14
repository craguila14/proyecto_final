import React, {useContext} from "react"
import { ProductsContext } from "../contexts/FavsContext"
import productoImg from "../assets/imagenNoDisponible.png";
import { CartContext } from '../contexts/CartContext';
import { ENDPOINT, URLBASE } from "../config/constants";

const ProductosFavoritos = () => {

    const { products, likedProducts, handleLike } = useContext(ProductsContext)
    const { addToCart } = useContext(CartContext)

    const likedProductsList = products.filter(product => likedProducts.includes(product.id))

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };

    return (
      <div className="container mt-4">
      <h2>Mis productos favoritos</h2>
      <div className="row">
        {likedProductsList.map(producto => (
          <div key={producto.id} className="col-md-4 mb-4">
            <div className="card" style={{ width: '18rem' }}>
            <img
              className="card-img-top"
              src={`${URLBASE}${producto.imagen}`}
              alt={producto.nombre}
            />
            <div className="card-body">
              <h5 className="card-title">{producto.nombre}</h5>
              <p className="card-text">${formatPrice(producto.precio)}</p>
              
              <div className="d-flex justify-content-between ">
              <button 
                className={`btn ${likedProducts.includes(producto.id) ? "btn-danger" : "btn-outline-danger"} mt-3`}
                onClick={() => handleLike(producto.id)}
              >
                  {likedProducts.includes(producto.id) ? "❤️" : "🤍"}
              </button>
              <button 
                className="btn btn-warning mt-3"
                onClick={() => addToCart(producto)}
              >
                 🛒
              </button>
              </div>
              </div> 
            </div>
          </div>
        ))}
          </div>
      </div>
  );
};

export default ProductosFavoritos