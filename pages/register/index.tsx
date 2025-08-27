// pages/register.tsx
import { useState, ChangeEvent, JSX } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

interface RegisterData {
  studentid: string;
  fname: string;
  mname: string;
  lname: string;
  suffix: string;
  email: string;
  yearlevel: string;
  course: string;
  program: string;
  major: string;
  semester: string;
  schoolyear: string;
}

export default function RegisterPage(): JSX.Element {
  const [ loading, setLoading ] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    studentid: "",
    fname: "",
    mname: "",
    lname: "",
    suffix: "",
    email: "",
    yearlevel: "",
    course: "",
    program: "",
    major: "",
    semester: "",
    schoolyear: ""
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleStudentIdBlur = async () => {
    if (formData.studentid.trim() !== "") {
      setLoading(true); // show loader
      try {
        const response = await fetch("/api/checkStudent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData.studentid.trim()),
        });
        const responseData = await response.json();
        if (response.ok) {
          if (responseData.message.code ===0) {
            toast.error(responseData.message.data)
            formData.fname = "";
          } else {
            const userDetails = responseData.message.data[0];
            formData.fname = userDetails.fname;
            formData.mname = userDetails.mname;
            formData.lname = userDetails.lname;
            formData.email = userDetails.email;
            formData.yearlevel = userDetails.year_level;
            formData.course = userDetails.course_code;
            formData.program = userDetails.program_code;
            formData.major = userDetails.major_code;
            formData.schoolyear = userDetails.schoolyear;
            formData.semester = userDetails.semester;
          }
        } else {
          toast.error('Data', responseData.message.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error checking student ID:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      studentid: "",
      fname: "",
      mname: "",
      lname: "",
      suffix: "",
      email: "",
      yearlevel: "",
      course: "",
      program: "",
      major: "",
      semester: "",
      schoolyear: ""
    });
  }

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/updateStudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData.message)
        if (responseData.message.code === 0) {
          toast.error(responseData.message.data);
        } else {
          toast.success(responseData.message.data);
          resetForm();
          router.push("/");
        }
      } else {
        toast.error(responseData.message.data);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-violet-950 to-black flex items-center justify-center p-4">

      {loading && (
           <div className="fixed inset-0 bg-black opacity-70 flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
              <div className="text-white text-lg">Loading...</div>
            </div>
          </div>
          )}

      <div className="relative w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-xl border border-violet-800/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-white mb-2">
              Student School Activities Attendance Monitoring System (SSAAM)
            </h1>
            <p className="text-gray-400">Create your account</p>
          </div>
          <div className="space-y-6">
            {/* Full name */}
            <div className="h-[400px] overflow-scroll scrollbar-hide">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Student ID {loading ? "Checking...": ''}
                </label>
                <input
                  name="studentid"
                  type="text"
                  value={formData.studentid}
                  onChange={handleInputChange}
                  onBlur={handleStudentIdBlur}
                  placeholder="Enter your student id"
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  First name
                </label>
                <input
                  name="fname"
                  type="text"
                  value={formData.fname}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Middle name
                </label>
                <input
                  name="mname"
                  type="text"
                  value={formData.mname}
                  onChange={handleInputChange}
                  placeholder="Enter your middle name"
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Last name
                </label>
                <input
                  name="lname"
                  type="text"
                  value={formData.lname}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Year Level
                </label>
                <select
                  name="yearlevel"
                  value={formData.yearlevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                >
                  <option value="">Select Year Level</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Department
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                >
                  <option value="">Select Department</option>
                  <option value="101">CCS</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Program
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                >
                  <option value="">Select Program</option>
                  <option value="10101">BSCS</option>
                  <option value="10102">BSIS</option>
                  <option value="10103">BSIT</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Major
                </label>
                <select
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                >
                  <option value="">Select Major</option>
                  {/* <option value="CCS">CCS</option> */}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                >
                  <option value="">Select Semester</option>
                  <option value="1st semester">1st semester</option>
                  <option value="2nd semester">2nd semester</option>
                </select>
              </div>


              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  School Year
                </label>
                <select
                  name="schoolyear"
                  value={formData.schoolyear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 mt-1 bg-black/30 border border-violet-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                >
                  <option value="">Select School Year</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
              </div>
            </div>

            {/* Register button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white font-semibold rounded-lg shadow-lg shadow-violet-600/25 hover:from-violet-700 hover:to-violet-800 transition-all disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            {/* Link to login */}
            <p className="text-sm text-gray-400 text-center">
              Already have an account?{" "}
              <Link
                  href="/"
                  className="text-cyan-400 hover:text-cyan-300"
                  target='_blank'
                  rel="noopener noreferrer" 
                >
                Login here
                </Link>
            </p>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-400/20 to-violet-600/20 rounded-2xl blur-xl"></div>
      </div>
      <Toaster />
    </div>
  );
}
