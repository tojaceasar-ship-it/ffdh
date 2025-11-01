'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { client } from '../../lib/sanity';

const Header = () => {
  const [primaryNavItems, setPrimaryNavItems] = useState([]);
  const [secondaryNavItems, setSecondaryNavItems] = useState([]);

  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        const data = await client.fetch('*[_type == "navigationMenu"]');
        const primaryItems = data
          .filter(menu => ['Discover', 'Experience'].includes(menu.category))
          .flatMap(menu => menu.items.filter(item => item.status === 'active'));
        const secondaryItems = data
          .filter(menu => ['Personal', 'Admin'].includes(menu.category))
          .flatMap(menu => menu.items.filter(item => item.status === 'active'));
        setPrimaryNavItems(primaryItems);
        setSecondaryNavItems(secondaryItems);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };

    fetchNavigationData();
  }, []);

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-black bg-opacity-80 backdrop-blur-md text-white py-4 px-6 sticky top-0 z-50 shadow-lg border-b border-neon-pink"
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="text-2xl font-bold text-neon-pink"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <a href="/homepage">Fruits From Da Hood</a>
        </motion.div>
        <nav className="hidden md:flex space-x-8 items-center">
          <div className="flex space-x-6">
            {primaryNavItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.url}
                className="hover:text-neon-pink transition-colors duration-200 font-graffiti"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>
          <div className="flex space-x-4">
            {secondaryNavItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.url}
                className="text-sm bg-neon-pink text-black px-3 py-1 rounded-md hover:bg-neon-pink-dark transition-colors duration-200 font-graffiti"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>
        </nav>
        <motion.a
          href="/shop"
          className="bg-neon-pink text-black px-4 py-2 rounded-md font-bold hover:bg-neon-pink-dark transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          Shop Now
        </motion.a>
      </div>
    </motion.header>
  );
};

export default Header;