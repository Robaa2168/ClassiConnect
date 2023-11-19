// pages/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineMail, AiOutlineEye, AiOutlinePhone, AiOutlineEyeInvisible, AiOutlineLock } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';

const SignupPage = () => {
    const router = useRouter();
    const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '', phoneNumber: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setSignupData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');  // Clear any prior errors

        // Check if passwords match
        if (signupData.password !== signupData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        // Constructing the user data to send
        const userData = {
            email: signupData.email,
            password: signupData.password,
            phoneNumber: signupData.phoneNumber,
        };

        try {
            // Making an API request to the server-side endpoint
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                // Check if the response is in JSON format
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    // Handle JSON response
                    const responseData = await response.json();
                    throw new Error(responseData.message || 'Something went wrong!');
                } else {
                    // Handle non-JSON response
                    throw new Error('Server error, please try again later');
                }
            }

            // Process a valid response
            const responseData = await response.json();
            setSignupData({ email: '', password: '', phoneNumber: '', confirmPassword: '' });  // Clear the form
            router.push('/users/dashboard');  // Redirect to a success page or home, etc.

        } catch (error) {
            // If there's a known error, display it, otherwise display a generic error message
            setError(error.message || 'Failed to sign up. Please try again.');
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign Up for an Account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {/* Error Icon */}
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        There were one or more errors with your submission
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>
                                                {error}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4 relative">
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <AiOutlineMail className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Email address"
                                value={signupData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="phone-number" className="sr-only">Phone Number</label>
                            <AiOutlinePhone className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                            <input
                                id="phone-number"
                                name="phoneNumber"
                                type="tel"
                                autoComplete="tel"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Phone Number"
                                value={signupData.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="h-5"></div>
                        <div className="mb-4 relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <AiOutlineLock className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Password"
                                value={signupData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-3 text-emerald-500"
                            >
                                {showPassword ? <AiOutlineEyeInvisible size="1.25em" /> : <AiOutlineEye size="1.25em" />}
                            </button>
                        </div>
                        <div className="h-5"></div>

                        <div className="mt-4 mb-4 relative"> {/* Modified margin for separation */}
                            <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                            <AiOutlineLock className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                                autoComplete="new-password"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Confirm Password"
                                value={signupData.confirmPassword}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button" // Ensure this doesn't submit the form
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-3 text-emerald-500" // Adjust positioning as needed
                            >
                                {showPassword ? <AiOutlineEyeInvisible size="1.25em" /> : <AiOutlineEye size="1.25em" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {loading ? <FaSpinner className="h-5 w-5 text-white animate-spin" /> : null}
                            </span>
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default SignupPage;
