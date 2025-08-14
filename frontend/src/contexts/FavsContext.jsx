import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINT } from '../config/constants';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';

export const ProductsContext = createContext();

const ShopProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [showError, setShowError] = useState(true);
    const [likedProducts, setLikedProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1); 

    useEffect(() => {
      if (currentUser) {
        fetchFavoritos();
        fetchProductos(currentPage);
      }
    }, [currentUser, currentPage]); 

    const fetchProductos = async (page = 1, limit = 9) => {
      try {
        setLoading(true);
        const token = Cookies.get('token');
        const response = await axios.get(`${ENDPOINT.productos}?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(response.data.products || []);
        setTotalPages(Math.ceil(response.data.totalCount / limit) || 1); // Ajusta el total de páginas
      } catch (error) {
        console.error("Error al cargar productos desde la API", error);
        setHasError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoritos = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(ENDPOINT.favoritos, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLikedProducts(response.data.map(fav => fav.producto_id));
      } catch (error) {
        console.error("Error al cargar favoritos", error);
      }
    };

    const handleLike = async (productId) => {
      const isLiked = likedProducts.includes(productId);

      try {
        const token = Cookies.get('token');
        if (isLiked) {
          await axios.delete(`${ENDPOINT.eliminarFavorito}/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setLikedProducts(prevLikedProducts => prevLikedProducts.filter(id => id !== productId));
        } else {
          await axios.post(ENDPOINT.registerFavorite, { producto_id: productId }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setLikedProducts(prevLikedProducts => [...prevLikedProducts, productId]);
        }
      } catch (error) {
        console.error("Error al actualizar favoritos:", error);
      }
    };

    return (
      <ProductsContext.Provider value={{
        products,
        setProducts,
        loading,
        hasError,
        showError,
        likedProducts,
        fetchProductos,
        handleLike,
        currentPage,
        setCurrentPage, 
        totalPages,
      }}>
        {children}
      </ProductsContext.Provider>
    );
}

export default ShopProvider;
