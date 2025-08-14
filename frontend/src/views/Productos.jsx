import { CartContext } from "../contexts/CartContext";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductsContext } from "../contexts/FavsContext";
import { URLBASE } from "../config/constants";
import Cookies from 'js-cookie';

const Productos = () => {
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const { products, setProducts, loading, hasError, showError, likedProducts, handleLike, fetchProductos, currentPage, setCurrentPage, totalPages } = useContext(ProductsContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);


    useEffect(() => {
        fetchProductos(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (hasError) {
            setShowErrorAlert(true);
            setTimeout(() => setShowErrorAlert(false), 5000);
        }
    }, [hasError]);

    useEffect(() => {
        if (showError) {
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 5000);
        }
    }, [showError]);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const filteredProducts = (products || []).filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    return (
        <div className="container mt-4">
            {showErrorAlert && (
                <div className="alert alert-danger">
                    Error al cargar productos desde el servidor. 
                    {!Cookies.get('token') && " No se encontró el token de autenticación. Por favor, inicie sesión nuevamente."}
                </div>
            )}
            {showSuccessAlert && !loading && products.length > 0 && (
                <div className="alert alert-success">Productos cargados correctamente</div>
            )}

            {/* Campo de búsqueda */}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="row">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((producto) => (
                        <div key={producto.id} className="col-md-4 mb-4">
                            <div className="card" style={{ width: '18rem' }}>
                                <img src={`${URLBASE}${producto.imagen}`} alt={producto.nombre} className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">{producto.nombre}</h5>
                                    <p>${formatPrice(producto.precio)}</p>
                                    <button 
                                        className="btn btn-warning me-3" 
                                        onClick={() => navigate(`/producto/${producto.id}`)}> 
                                        Ver Detalle
                                    </button>
                                    <button 
                                        className={`btn ${likedProducts.includes(producto.id) ? "btn-danger" : "btn-outline-danger"}`}
                                        onClick={() => handleLike(producto.id)}
                                    >
                                        {likedProducts.includes(producto.id) ? "❤️" : "🤍"}
                                    </button>
                                    <button 
                                        className="btn btn-success mt-3"
                                        onClick={() => addToCart(producto)}
                                    >
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center">No se encontraron productos que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>

            {/* Controles de Paginación */}
            <div className="d-flex justify-content-between mt-4">
                <button 
                    className="btn btn-primary"
                    onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Página Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button 
                    className="btn btn-primary"
                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Página Siguiente
                </button>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <button 
                    className="btn btn-warning"
                    onClick={() => navigate('/mis-productos')}
                >
                    Agregar producto +
                </button>
            </div>
        </div>
    );
};

export default Productos;
