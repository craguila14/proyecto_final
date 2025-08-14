import bcrypt from 'bcryptjs';
import { model } from '../models/tiendaModel.js';
import jwt from "jsonwebtoken";
import "dotenv/config";

const home = (req, res) => {
    res.send('Home');
};

const notFound = (req, res) => {
    res.status(404).send('Not Found');
};

const registerUser = async (req, res) => {
    const { nombre, apellido, email, password, direccion, telefono } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await model.createUser(nombre, apellido, email, hashedPassword, direccion, telefono);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await model.getUserByEmail(email);
        console.log("Usuario encontrado:", user);

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta : ' + password });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: 'Error en el login', details: error.message });
    }
};

const getUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await model.getUserByEmail(decoded.email);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

// Obtiene el nombre del usuario por su ID
const getUserName = async (req, res) => {
    const usuario_id = req.params.usuario_id;

    try {
        const usuario = await model.getUserById(usuario_id);
        if (usuario) {
            res.json({ nombre: usuario.nombre, apellido: usuario.apellido });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
        res.status(500).json({ error: 'Error al obtener el nombre del usuario' });
    }
};


const registerProduct = async (req, res) => {
  const { nombre, marca, descripcion, precio, categoria, stock } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;
  const usuario_id = req.user.id;
  try {
    const newProduct = await model.createProduct(nombre, marca, descripcion, precio, imagen, categoria, stock, usuario_id);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto', details: error.message });
  }
};

const eliminarProducto = async (req, res) => {
    const producto_id = req.params.producto_id;
    const usuario_id = req.user.id;

    try {
        const resultado = await model.eliminarProducto(producto_id, usuario_id);
        if (resultado.success) {
            res.json(resultado);
        } else {
            res.status(404).json(resultado);
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

const actualizarProducto = async (req, res) => {
  const producto_id = req.params.producto_id;
  const usuario_id = req.user.id;
  const datosActualizados = req.body;
  if (req.file) {
    datosActualizados.imagen = `/uploads/${req.file.filename}`;
  }

  try {
    const resultado = await model.actualizarProducto(producto_id, usuario_id, datosActualizados);
    if (resultado.success) {
      res.json(resultado);
    } else {
      res.status(404).json(resultado);
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};


const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const productos = await model.listarProduct({ page, limit });
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const getDetallesProductById = async (req, res) => {
    const producto_id = req.params.producto_id;
    console.log(producto_id);
    try {
        const producto = await model.detalleProductById(producto_id);
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener detalles del producto' });
    }
};

const getProductByUser = async (req, res) => {
    const usuario_id = req.user.id;
    console.log(usuario_id);

    try {
        const productos = await model.listarProductByUser(usuario_id);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
}

const registerFavorite = async (req, res) => {
    const { producto_id } = req.body;
    const usuario_id = req.user.id;

    try {
        const newFavorite = await model.createFavorite(usuario_id, producto_id);
        res.status(201).json(newFavorite);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear favorito' });
    }
};

const getFavoriteByUser = async (req, res) => {
    const usuario_id = req.user.id;

    try {
        const favoritos = await model.listarFavoritos(usuario_id);
        res.json(favoritos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener favoritos' });
    }
};

const eliminarFavoritosById = async (req, res) => {
    const product_id = req.params.product_id;
    const usuario_id = req.user.id;

    try {
        const deletedFavorite = await model.borrarFavorito(product_id, usuario_id);
        res.json(deletedFavorite);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar favorito' });
    }
};

export const controller = {
    home,
    registerUser,
    loginUser,
    getUser,
    getUserName,
    registerProduct,
    eliminarProducto,
    actualizarProducto,
    getProducts,
    getDetallesProductById,
    getProductByUser,
    registerFavorite,
    getFavoriteByUser,
    eliminarFavoritosById,
    notFound
}