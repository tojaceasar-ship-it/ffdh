import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'default', size = 'md', className = '', onClick, disabled, type = 'button', href }) => {
  const baseStyles = 'font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-pink';
  
  const variantStyles = {
    default: 'bg-neon-pink text-white hover:bg-neon-pink-dark',
    outline: 'border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white',
    ghost: 'text-neon-pink hover:bg-gray-100',
    dark: 'bg-gray-800 text-white hover:bg-gray-700'
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-3 text-lg'
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const motionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={combinedStyles}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;