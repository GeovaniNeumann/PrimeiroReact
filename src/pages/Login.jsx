import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaLock, FaShieldAlt, FaUserCircle, FaExclamationTriangle } from 'react-icons/fa';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('admin@admin.com');
    const [password, setPassword] = useState('123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'E-mail ou senha inválidos');
        }
        
        setLoading(false);
    };

    const fillAdmin = () => {
        setEmail('admin@admin.com');
        setPassword('123');
        setError('');
    };

    const fillUser = () => {
        setEmail('usuario@teste.com');
        setPassword('123');
        setError('');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo">
                    <img 
                        src="https://i.ibb.co/MdtYrsZ/Captura-de-tela-2025-10-14-173640-removebg-preview.png" 
                        alt="Curitiba Esterilização" 
                    />
                </div>

                <h1>SEJA BEM VINDO</h1>
                <p>Faça login para acessar sua carteira de clientes</p>

                {error && (
                    <div className="error-message">
                        <FaExclamationTriangle /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            <FaUser /> E-mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <FaLock /> Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar no Dashboard'}
                    </button>
                </form>

                <div className="demo-credentials">
                    <p>Credenciais de teste:</p>
                    <div className="credential-buttons">
                        <button 
                            type="button" 
                            onClick={fillAdmin}
                            className="btn-credential admin"
                        >
                            <FaShieldAlt /> Admin: admin@admin.com / 123
                        </button>
                        <button 
                            type="button" 
                            onClick={fillUser}
                            className="btn-credential user"
                        >
                            <FaUserCircle /> Usuário: usuario@teste.com / 123
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;