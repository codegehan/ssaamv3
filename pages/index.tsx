import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, ChangeEvent, JSX } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface FormData {
  username: string;
  password: string;
  userType: 'student' | 'admin';
}

export default function LoginPage(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    userType: 'student'
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeChange = (userType: 'student' | 'admin'): void => {
    setFormData(prev => ({
      ...prev,
      userType
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    
    try {

      const response = await fetch('/api/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: formData.username, password: formData.password }),
      })
      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData.user[0])
        localStorage.setItem("user", JSON.stringify(responseData.user[0]));
        toast.success("Login successfull!");
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500); 
      } else {
        toast.error(responseData.message || 'Login failed.')
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-violet-950 to-black flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400 rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-violet-500 rounded-full opacity-15 blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-cyan-300 rounded-full opacity-5 blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main login card */}
        <div className="bg-black/40 backdrop-blur-xl border border-violet-800/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-400 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-400/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Student School Activities Attendance Monitoring System (SSAAM)</h1>
            <p className="text-gray-400">College of Computing Studies</p>
          </div>

          {/* Login form */}
          <div className="space-y-6">
            {/* User type selector */}
            <div className="flex bg-black/30 rounded-lg p-1 border border-violet-800/30">
              <button
                type="button"
                onClick={() => handleUserTypeChange('student')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  formData.userType === 'student'
                    ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-600/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('admin')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  formData.userType === 'admin'
                    ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-600/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Username field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Student ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 focus:shadow-lg focus:shadow-cyan-400/25"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 focus:shadow-lg focus:shadow-cyan-400/25"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-semibold rounded-lg shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Support links */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                No account?{' '}
                <Link
                  href="/register"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 underline"
                  target='_blank'
                  rel="noopener noreferrer" 
                >
                  Register here
                </Link>

              </p>
              <p className="text-sm text-gray-400">
                Having trouble signing in?{' '}
                <Link
                  href="https://www.facebook.com/profile.php?id=100095351062233"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 underline"
                  target='_blank'
                  rel="noopener noreferrer" 
                >
                  Contact Support
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                Protected by advanced security measures
              </p>
              <p className='text-sm text-gray-400'>
                Developed by:{' '}
                <Link
                  href="https://www.facebook.com/codeGehan"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 underline"
                  target='_blank'
                  rel="noopener noreferrer" 
                >
                codeGehan
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Glowing border effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-400/20 to-violet-600/20 rounded-2xl blur-xl"></div>
      </div>
      <Toaster />
    </div>
  );
}