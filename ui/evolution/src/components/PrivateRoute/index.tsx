// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth';

interface PrivateRouteProps {
    component: React.ComponentType<any>;
    [key: string]: any; // Permite outras props adicionais
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return isAuthenticated ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/signin" state={{ from: location }} />
    );
};

export default PrivateRoute;
