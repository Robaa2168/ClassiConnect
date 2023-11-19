// Header.js
import React, { useState } from 'react';
import { FiSearch, FiMenu, FiUser, FiLogIn } from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

function Header() {
    const { user } = useAuth(); // Accessing the user state from context
    const [searchInput, setSearchInput] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleNavigation = () => {
        setIsLoading(true);
        router.push('/');
    }

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="bg-emerald-500 shadow-md p-4 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="flex items-center cursor-pointer" onClick={handleNavigation}>
                                <FaHome className="text-lg mr-2" />
                                <span className="text-xl font-bold">ClassiConnect</span>
                            </div>
                        </div>

                        {/* Search for medium and larger screens */}
                        <div className="hidden md:flex md:ml-6 items-center">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-300" />
                                </span>
                                <input
                                    className="py-2 pl-10 pr-4 rounded-full text-sm flex-1 border border-gray-300 focus:outline-none focus:border-white"
                                    type="text"
                                    placeholder="Search"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Conditional Navigation links */}
                    <nav className="hidden md:flex space-x-4">
                        {/* Other links can also be conditional based on user authentication status */}
                        <Link href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">
                            Become a host
                        </Link>
                        <Link href="/create-listing" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">
                            Create
                        </Link>
                        <Link href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">
                            Help
                        </Link>
                        {user ? (
                            // If the user is logged in, show a dashboard link or other user-specific links
                            <Link href="/users/dashboard" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">
                                Dashboard
                            </Link>
                        ) : (
                            // If the user is not logged in, show the signup and login links
                            <>
                                <Link href="/users/signup" className="flex items-center text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">
                                    <FiUser className="mr-1" /> Sign up
                                </Link>
                                <Link href="/users/login" className="flex items-center text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">
                                    <FiLogIn className="mr-1" /> Log in
                                </Link>
                            </>
                        )}
                    </nav>


                    {/* Hamburger menu on small screens */}
                    <div className="flex items-center md:hidden"> {/* Adjusted to hide on 'md' and larger screens */}
                        {/* Hamburger button */}
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-emerald-700 focus:outline-none"
                            onClick={toggleMobileMenu}
                        >
                            <FiMenu className="block h-6 w-6" />
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link href="/create-listing" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">
                                Create
                            </Link>
                            <Link href="/" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">
                                Become a host
                            </Link>
                            <Link href="/" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">
                                Help
                            </Link>

                            {user ? (
                                <Link href="/dashboard" className="flex items-center text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">
                                    {/* You can replace the icon here as necessary */}
                                    <FiUser className="mr-1 h-5 w-5" /> Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/users/signup" className="flex items-center text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">
                                        <FiUser className="mr-1 h-5 w-5" /> Sign up
                                    </Link>
                                    <Link href="/users/login" className="flex items-center text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">
                                        <FiLogIn className="mr-1 h-5 w-5" /> Log in
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
