import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/registrarse_iniciar_sesion.css';
import { useAuth } from "../contexts/AuthContext";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const initialForm = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmedPassword: '',
  direccion: '',
  telefono: ''
};

const Registrarse = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [user, setUser] = useState(initialForm);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validaciones
    if (
      !user.nombre.trim() ||
      !user.apellido.trim() ||
      !user.email.trim() ||
      !user.password.trim()
    ) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (user.password !== user.confirmedPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!emailRegex.test(user.email)) {
      setError('El formato del email no es correcto!');
      return;
    }

    try {
      const { success, message } = await registerUser({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        password: user.password,
        direccion: user.direccion,
        telefono: user.telefono
      });
      
      alert(message);
      if (success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError('Error al registrar usuario. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Registrar nuevo usuario</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <input
            type="text"
            name="nombre"
            value={user.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="apellido"
            value={user.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmedPassword"
            value={user.confirmedPassword}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="direccion"
            value={user.direccion}
            onChange={handleChange}
            placeholder="Dirección (opcional)"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="telefono"
            value={user.telefono}
            onChange={handleChange}
            placeholder="Teléfono (opcional)"
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">Registrarse</button>
      </form>
    </div>
  );
};

export default Registrarse;