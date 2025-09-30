import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppContext } from '../../context/AppContext';

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('/api/seller/login', { email, password });
      if (data.success) {
        // Store seller token in localStorage for Render subdomain compatibility
        if (data.token) {
          localStorage.setItem('sellerToken', data.token);
        }
        setIsSeller(true);
        navigate('/seller');
        toast.success("Seller login successful!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate('/seller');
    }
  }, [isSeller, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center text-sm text-gray-600">
      <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Seller</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Enter your password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md cursor-pointer">Login</button>
        
        {/* Back to Customer Login */}
        <div className="w-full mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center mb-3">Not a seller?</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 hover:bg-gray-200 transition-all text-gray-700 py-2 rounded-md text-sm font-medium"
          >
            Back to Customer Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default SellerLogin;
