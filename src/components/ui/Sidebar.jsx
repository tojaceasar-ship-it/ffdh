import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { client } from '../../lib/sanity';

const Sidebar = () => {
  const [navigationSections, setNavigationSections] = useState([]);

  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        const data = await client.fetch('*[_type == "navigationMenu"]');
        const sections = {
          discover: data.find(menu => menu.category === 'Discover')?.items.filter(item => item.status === 'active') || [],
          experience: data.find(menu => menu.category === 'Experience')?.items.filter(item => item.status === 'active') || [],
          personal: data.find(menu => menu.category === 'Personal')?.items.filter(item => item.status === 'active') || [],
          admin: data.find(menu => menu.category === 'Admin')?.items.filter(item => item.status === 'active') || [],
        };
        setNavigationSections([
          { title: 'Discover', items: sections.discover },
          { title: 'Experience', items: sections.experience },
          { title: 'Personal', items: sections.personal },
          { title: 'Admin', items: sections.admin },
        ]);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };

    fetchNavigationData();
  }, []);

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-black bg-opacity-90 backdrop-blur-md text-white w-64 h-full fixed top-0 left-0 pt-20 pb-8 px-6 overflow-y-auto shadow-lg border-r border-neon-pink"
    >
      <div className="space-y-8">
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <motion.h3 
              className="text-neon-pink font-graffiti font-bold text-lg mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.3 }}
            >
              {section.title}
            </motion.h3>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <motion.li
                  key={itemIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05), duration: 0.3 }}
                >
                  <a
                    href={item.url}
                    className="block px-3 py-2 rounded-md text-sm hover:bg-neon-pink hover:text-black transition-colors duration-200 font-graffiti"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.aside>
  );
};

export default Sidebar;