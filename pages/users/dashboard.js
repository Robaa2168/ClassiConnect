// pages/dashboard.js
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../../contexts/AuthContext'; // <-- Make sure this path is correct
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CircleLoader } from 'react-spinners';

const Dashboard = () => {
    const { user, loading: authLoading, signOut } = useAuth();

    
    const handleLogout = () => {
      signOut(); // Clears user session and redirects to login page
  };
  

    useEffect(() => {
      if (!user && !authLoading) {
          handleLogout();
      }
  }, [user, authLoading]);
  

    if (authLoading || !user) {
        // If authentication is still in progress, or there's no user data,
        // display a loading indicator.
        return (
            <div className="flex h-screen">
                <div className="m-auto">
                <CircleLoader color={"#50C878"} loading={true} size={150} />
                </div>
            </div>
        );
    }

        // This function returns a string that matches the user's role.
        const getDashboardTitle = () => {
            switch (user.role) {
                case 'agent':
                    return 'Agent Dashboard';
                case 'customer':
                    return 'Customer Dashboard';
                case 'superAdmin':
                    return 'Admin Dashboard';
                default:
                    return 'User Dashboard'; // This is a fallback in case the role doesn't match the above cases.
            }
        };


    return (
        <div className="flex flex-col min-h-screen py-2">
          <Head>
            <title>ViewNyumba</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          {/* Header component, assuming it is a navigation bar or similar */}
          <Header />
    
          {/* Main dashboard container */}
          <div className="flex items-center justify-center flex-1 px-4 sm:px-6 lg:px-8">
            {/* Centered box */}
            <div className="w-full space-y-8 ">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md mx-auto sm:w-full sm:max-w-2xl">
                {/* Header section */}
                <div className="bg-emerald-500 px-6 py-4 border-b border-emerald-600">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                    {getDashboardTitle()} 
                  </h2>
                </div>
                {/* User greeting */}
                <div className="px-6 py-4">
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg">
                    Welcome back, <span className="text-gray-900 font-semibold">{user.username}</span>!
                  </p>
                </div>
                {/* User details with thematic spacing and styles */}
                <div className="bg-emerald-50 px-6 py-4 space-y-3">
                  <div className="space-y-1">
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Role:</p>
                    <p className="text-gray-900 font-semibold">{user.role}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Phone Number:</p>
                    <p className="text-gray-900 font-semibold">{user.phoneNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Email:</p>
                    <p className="text-gray-900 font-semibold">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Referral:</p>
                    <p className="text-gray-900 font-semibold">{user.referralCode}</p>
                  </div>
                </div>
                
                {/* Action buttons for improved interactivity */}
                <div className="px-6 py-4 bg-emerald-100 flex justify-end space-x-2">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base">
                    Edit Profile
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default Dashboard;