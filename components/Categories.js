import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IconContext } from "react-icons";
import { FaBriefcase, FaTags, FaHammer, FaUsers, FaHome } from 'react-icons/fa';

// components/Categories.js
function Categories() {
    const categories = [
        { name: 'Jobs', icon: FaBriefcase },
        { name: 'For Sale', icon: FaTags },
        { name: 'Services', icon: FaHammer },
        { name: 'Community', icon: FaUsers },
        { name: 'Housing', icon: FaHome },
    ];

    const [isMobile, setIsMobile] = useState(false);
    // Check screen size to adjust view for mobile screens
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Invoke the handler immediately to determine screen size

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Animation variants for category items
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // Handle category click - this can be used to redirect users, open a modal, etc.
    const handleCategoryClick = (category) => {
        console.log(`Clicked on ${category.name}`);
        // Implement what happens when category is clicked, e.g., navigation, modal opening, etc.
    };

    return (
        <section className="my-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-center text-gray-800 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Explore by category
                </motion.h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col items-center cursor-pointer"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {/* Category icon */}
                            <div
                                className="w-16 h-16 mb-2 flex items-center justify-center text-emerald-500 bg-emerald-50 shadow hover:shadow-lg transition-shadow duration-300 rounded-full" // added background color and rounded the div
                                style={{ border: '2px solid transparent' }}
                                onMouseEnter={e => e.currentTarget.style.border = '1px solid currentColor'}
                                onMouseLeave={e => e.currentTarget.style.border = '2px solid transparent'} >
                                <category.icon />
                            </div>
                            <p className="mt-2 text-center text-gray-600">{category.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );

}

export default Categories;