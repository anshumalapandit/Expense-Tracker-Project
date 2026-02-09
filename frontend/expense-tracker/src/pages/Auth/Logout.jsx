import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Token delete karo
        localStorage.removeItem('token');

        // Toast dikhana
        toast.success("Logout successful!");

        // 1.5 sec baad login pe bhejna
        setTimeout(() => {
            navigate('/login');
        }, 2500);
    }, [navigate]);

    return <p>Logging out...</p>;
};

export default Logout;
