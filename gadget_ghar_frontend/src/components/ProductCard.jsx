
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { CartContext } from '../context/CartContext'; // ✅ Use CartContext
import { FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext); // ✅ Access addToCart
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    const handleIncrement = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }

        addToCart(product, quantity); // ✅ Actually add to cart

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            // Optionally navigate to cart or dashboard
            // navigate('/dashboard');
        }, 1500);
    };

    const isOutOfStock = product.stock === 0;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full transition-shadow duration-300 hover:shadow-lg relative overflow-hidden">
            <div
                className={`absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full text-white tracking-wide shadow-sm ${isOutOfStock ? 'bg-red-500' : 'bg-gray-900/80 backdrop-blur-sm'}`}
            >
                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </div>

            <div className="w-full h-52 bg-gray-50 flex items-center justify-center p-4">
                <img
                    src={product.imageUrl || '/images/placeholder.png'}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow mb-4">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-sky-600 transition-colors">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {product.stock > 0 ? `${product.stock} available` : 'Currently unavailable'}
                    </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <p className="text-xl font-extrabold text-gray-900">₹{product.price.toFixed(2)}</p>

                    {!isOutOfStock && (
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button onClick={handleDecrement} className="p-1.5 text-gray-600 hover:text-sky-600 hover:bg-white rounded-md transition-all disabled:opacity-50" disabled={quantity === 1}>
                                <FaMinus size={10} />
                            </button>
                            <span className="px-3 font-semibold text-gray-800 text-sm">{quantity}</span>
                            <button onClick={handleIncrement} className="p-1.5 text-gray-600 hover:text-sky-600 hover:bg-white rounded-md transition-all disabled:opacity-50" disabled={quantity === product.stock}>
                                <FaPlus size={10} />
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdded}
                    className={`w-full flex justify-center items-center py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed' :
                            isAdded ? 'bg-blue-600 shadow-blue-500/30' : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-500/30 transform hover:-translate-y-0.5'
                        }`}
                >
                    {isAdded ? 'Added to Cart' : isOutOfStock ? 'Out of Stock' : (
                        <>
                            <FaShoppingCart size={16} className="mr-2" /> Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;