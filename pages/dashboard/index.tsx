import { generateQRCode } from "@/lib/generateQR";
import { GetServerSideProps } from "next";
import { JSX, useEffect, useState } from "react";
import nookies from "nookies";
import { verifyToken } from "@/lib/jwt";
import Image from "next/image";


interface StudentDashboardProps {
  user: {
    id: string;
    username: string;
    name: string;
    studentId: string;
    profilePicture?: string;
  };
}

interface StudentInfo {
  email: string;
  fname: string;
  lname: string;
  mname?: string;
  suffix?: string;
  major: string;
  course: string;
  program: string;
  semester: string;
  schoolyear: string;
  student_id: string;
  year_level: string;
}

// Student Dashboard Component
export default function StudentDashboard({ user }: StudentDashboardProps): JSX.Element {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<StudentInfo | null>(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const userObj: StudentInfo = JSON.parse(storedUser);
      setUserInfo(userObj);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    }
  }
}, []);


  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  }

  const downloadQRCode = async (): Promise<void> => {
    setIsDownloading(true);
    
    try {
      const qrCodeUrl = generateQRCode(user.studentId);
      
      // Create a temporary link to download the QR code
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${user.studentId}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-violet-950 to-black p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400 rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-violet-500 rounded-full opacity-15 blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-cyan-300 rounded-full opacity-5 blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
              <p className="text-gray-400">Student School Activities Attendance Monitoring System</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-xl border border-violet-800/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 p-1 shadow-lg shadow-cyan-400/25">
                    <div className="w-full h-full rounded-xl bg-black/40 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2 capitalize">{userInfo ? `${userInfo.fname} ${userInfo.mname ?? ""} ${userInfo.lname}` : "Loading..."}</h2>
                  {/* <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2> */}
                  
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <span className="text-gray-400 text-sm font-medium">Student ID:</span>
                      <span className="text-white font-mono text-lg underline">
                        {userInfo ? `${userInfo.student_id}` : "Loading..."}
                      </span>

                      <span className="text-gray-400 text-sm font-medium">Status:</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Active Student
                      </span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <span className="text-gray-400 text-sm font-medium">Department:</span>
                      <span className="text-white font-mono text-lg underline capitalize">
                        {userInfo ? `${userInfo.course}` : "Loading..."}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <span className="text-gray-400 text-sm font-medium">Program:</span>
                      <span className="text-white font-mono text-lg underline capitalize">
                        {userInfo ? `${userInfo.program}` : "Loading..."}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <span className="text-gray-400 text-sm font-medium">Year Level:</span>
                      <span className="text-white font-mono text-lg underline capitalize">
                        {userInfo ? `${userInfo.year_level}` : "Loading..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-xl border border-violet-800/50 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Student QR Code</h3>
                <p className="text-gray-400 text-sm mb-6">Use this QR code for quick attendance marking</p>
                
                {/* QR Code Display */}
                <div className="bg-white rounded-xl p-4 mb-6 mx-auto w-fit">
                  {/* <img
                    // src={generateQRCode(user.studentId)}
                    src={generateQRCode(userInfo?.student_id || "")}
                    alt="Student QR Code"
                    className="w-48 h-48 mx-auto"
                  /> */}
                  <Image
                    src={generateQRCode(userInfo?.student_id || "")}
                    alt="Student QR Code"
                    width={192}   // matches w-48
                    height={192}  // matches h-48
                    className="mx-auto"
                  />
                </div>
                
                {/* Download Button */}
                <button
                  onClick={downloadQRCode}
                  disabled={isDownloading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download QR Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 mt-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const token = cookies.authToken;

  // If no authToken, redirect to login
  if (!cookies.authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    await verifyToken(token);
    return { props: {} };
  } catch (err) {
    console.error("Token verification failed:", err);

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};