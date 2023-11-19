import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
  // Set up the intersection observer hook
  const { ref, inView } = useInView({
    triggerOnce: true,  // The animation will occur once
    threshold: 0.1,     // Percentage of the component's visibility before it triggers
  });

  // Animation variants
  const animationVariants = {
    hidden: { opacity: 0, y: 50 }, // Initial state of the component
    visible: {                     // State when the component is visible
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5, // Adjust the duration here. It was 0.9 previously.
        ease: [0.6, -0.05, 0.01, 0.99], // This ease array makes the transition more "springy"
      },
    },
  };


  return (
    <section
      ref={ref} // Set the reference here for the observer
      className="relative bg-cover bg-center"
      style={{ backgroundImage: 'url(https://a0.muscache.com/im/pictures/df193444-09e7-4c34-b9e1-d706166c21a2.jpg?im_w=1200)', minHeight: 'calc(100vh - 68px)' }} 
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative h-full flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8 space-y-6">
        <motion.h1
          variants={animationVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"} // animate based on whether the component is in view
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center"
        >
          Find Everything Local
        </motion.h1>
        <motion.p
          variants={animationVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-center"
        >
          Explore jobs, housing, goods, and services in your community.
        </motion.p>
        {/* Search Bar */}
        <motion.div
          variants={animationVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative w-full max-w-md mx-auto mt-6 mb-12"
        >
          <input
            type="text"
            className="w-full p-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-60"
            placeholder="Search 'Furniture', 'Part-time Jobs', etc."
          />

          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </span>
        </motion.div>
      </div>
    </section>
  );
};


export default Hero;
