import { useAuth } from "../contexts/AuthContext";
import React, { useState, useContext, useEffect } from "react";
import { ProductsContext } from "../contexts/FavsContext";
import axios from 'axios';
import '../styles/misProductos.css';
import { ENDPOINT, URLBASE } from "../config/constants";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const MisProductos = () => {
  const { currentUser } = useAuth();
  const { products, setProducts } = useContext(ProductsContext);
  const [nuevoProducto, setNuevoProducto] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    marca: "",
    categoria: "Perro",
    precio: "",
    stock: "",
    imagen: "",
    user_id: currentUser?.id || 1,
  });
  const [imagenPreview, setImagenPreview] = useState("");
  const [misProductos, setMisProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (currentUser?.id) {
        try {
          const token = Cookies.get('token');
          const headers = {
            'Authorization': `Bearer ${token}`,
          };
          const response = await axios.get(`${ENDPOINT.uproductos}`, { headers });
          const productos = response.data;
          console.log(productos);
          setMisProductos(productos);
        } catch (error) {
          console.error("Error al obtener productos:", error);
          setMisProductos([]);
        }
      }
    };

    fetchProducts();
  }, [currentUser, setProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "precio" || name === "stock") {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) && numericValue >= 0) {
        setNuevoProducto(prevState => ({
          ...prevState,
          [name]: numericValue,
        }));
      }
    } else {
      setNuevoProducto(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      setImagenPreview(URL.createObjectURL(file));
      setNuevoProducto(prevState => ({
        ...prevState,
        imagen: file,
      }));
    }
  };

  const agregarProducto = async () => {
    try {
      const token = Cookies.get('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const formData = new FormData();
      for (const key in nuevoProducto) {
        if (key === 'imagen' && nuevoProducto[key] instanceof File) {
          formData.append('image', nuevoProducto[key]);
        } else if (nuevoProducto[key] !== null && nuevoProducto[key] !== undefined) {
          formData.append(key, nuevoProducto[key]);
        }
      }

      let response;
      if (nuevoProducto.id) {
        response = await axios.put(`${ENDPOINT.actualizarProducto}/${nuevoProducto.id}`, formData, { 
          headers: { ...headers, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post(ENDPOINT.registrarProducto, formData, { 
          headers: { ...headers, 'Content-Type': 'multipart/form-data' }
        });
      }

      const productoActualizado = response.data;
      if (nuevoProducto.id) {
        setMisProductos(prevProductos => prevProductos.map(producto =>
          producto.id === productoActualizado.id ? productoActualizado : producto
        ));
        setProducts(prevProducts => prevProducts.map(producto =>
          producto.id === productoActualizado.id ? productoActualizado : producto
        ));
      } else {
        setMisProductos(prevProductos => [...prevProductos, productoActualizado]);
        setProducts(prevProducts => [...prevProducts, productoActualizado]);
      }

      setNuevoProducto({
        id: null,
        nombre: "",
        descripcion: "",
        marca: "",
        categoria: "Perro",
        precio: "",
        stock: "",
        imagen: "",
        user_id: currentUser?.id,
      });
      setImagenPreview("");
      navigate(0); // Esto recargará la página actual
    } catch (error) {
      console.error("Error al agregar o actualizar el producto:", error.response?.data || error.message);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const token = Cookies.get('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      await axios.delete(`${ENDPOINT.eliminarProducto}/${id}`, { headers });
      setMisProductos(prevProductos => prevProductos.filter(producto => producto.id !== id));
      setProducts(prevProducts => prevProducts.filter(producto => producto.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const editarProducto = (id) => {
    const productoAEditar = misProductos.find(producto => producto.id === id);
    if (productoAEditar) {
      setNuevoProducto(productoAEditar);
      setImagenPreview(productoAEditar.imagen);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Mis Productos</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Marca</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {misProductos.length > 0 ? (
            misProductos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.marca}</td>
                <td>{producto.categoria}</td>
                <td>{producto.precio}</td>
                <td>{producto.stock}</td>
                <td className="td-style">
                  <img src={`${URLBASE}${producto.imagen}`} alt={producto.nombre} className="img-style" />
                </td>
                <td>
                  <button className="btn btn-outline-info me-4" onClick={() => editarProducto(producto.id)}>Editar</button>
                  <button className="btn btn-outline-danger" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No hay productos para mostrar</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="form-group">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          value={nuevoProducto.marca}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <select
          name="categoria"
          value={nuevoProducto.categoria}
          onChange={handleInputChange}
          className="form-control mb-2"
        >
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={nuevoProducto.stock}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="form-control mb-2"
        />
        {imagenPreview && <img src={`${URLBASE}${nuevoProducto.imagen}`} alt={nuevoProducto.nombre} className="img-style" />      }
        <button className="btn btn-warning mt-2" onClick={agregarProducto}>
          {nuevoProducto.id ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </div>
    </div>
  );
};

export default MisProductos;
