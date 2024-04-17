import React, { useEffect } from 'react';
import NavBar from './NavBar';
import Hero from './Hero';
import Features from './Features';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HomeMain() {
    const { isLoggedIn } = UserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard');
        }
    }, [isLoggedIn, navigate]);
    return (
        <div>
            <NavBar />
            <Hero />
            <Features />
        </div>
    );
}
