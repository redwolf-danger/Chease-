import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  MessageSquare,
  User,
  Mail,
  Lock,
  EyeOff,
  Eye,
  Loader2,
  Circle,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const SignUpPage = () => {
  const [ShowPassword, setShowPassword] = useState(false);
  const [FormData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
    handle: "",
  });

  const [accordion, setAccordion] = useState(false);
  // all these are for "handle" field
  // const [typed,setTyped] = useState(false);
  const [empty, setEmpty] = useState(true);
  // const [debouncedQuery, setDebouncedQuery] = useState(FormData.handle);
  const [unique, setUnique] = useState(false);
  const [searching, setSearching] = useState(false);
  const [handle, setHandle] = useState("");

  // todo: define the onsearch frunciton
  const onSearch = async (query) => {
    try {
      console.log("called uniqueHandle");
      const res = await axiosInstance.post(`/auth/uniqueHandle`, {
        handle: query,
      });
      console.log("res is", res);
      setUnique(res.data.unique_handle);
    } catch (error) {
      console.log(error);
    } finally {
      setSearching(false);
    }
  };

  // todo: add useEffects here
  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("calling debounced query");
      setDebouncedQuery(handle);
    }, 500); // Delay of 500ms
    return () => clearTimeout(handler);
  }, [handle]);

  // useEffect(() => {
    const setDebouncedQuery = (debouncedQuery)=>{
    if (debouncedQuery && validateHandle()) {
      console.log("calling on search function");
      onSearch(debouncedQuery);
      // query is not empty only then call it
    }
    else{
      console.log("here...")
      setSearching(false);
    }
  }
  // , [debouncedQuery]);

  const { signup, isSigningUp ,googleSignIn} = useAuthStore();



  const validateHandle = ()=>{
    const query = FormData.handle;
    if(query.includes('/') || query.includes(' ')){
      toast.error("Handle must not contain / or spaces");
      return false;
    }
     return true;
  }
  const validateForm = () => {
    //todo: if possible use a library to do this
    if (!FormData.FullName.trim()) return toast.error("Full Name is required");
    if (!FormData.Email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(FormData.Email))
      return toast.error("Invalid email format");
    if (!FormData.Password) return toast.error("Password is required");
    if (FormData.Password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(FormData);
  };

  if(isSigningUp){
    // return a loader here
    return(<div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
  </div>)
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-5">
          {/* logo */}
          <div className="text-center mb-4">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* FORM STARTS */}
          <form onSubmit={handleSubmit} className="space-y-6">
    
          {/* INPUT FOR HANDLE */}
            <div className="form-control w-full mb-0.5">
              <label className="label flex justify-between py-1.5">
                {/* //todo: handle check */}
                <span className="label-text font-medium"> Handle </span>
                <span className={`px-1 text-center
                  `}>
                  {!empty &&
                    (searching ? (
                      <span className="min-w-15 flex items-center justify-around">
                        <Loader2  className="size-4 animate-spin text-primary" />
                      </span>
                    ) : (
                      <>
                        {unique ? (
                          <span className="text-green-500 font-semibold min-w-15">
                            Available
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold min-w-15">
                            Not Available
                          </span>
                        )}
                      </>
                    ))}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* <Mail className="size-5 text-base-content/40" /> */}
                  {/* //todo: add an icon here if time  */}
                </div>
                <input
                  type="handle"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter a unique handle"
                  value={FormData.handle}
                  onChange={(e) => {
                    setFormData({ ...FormData, handle: e.target.value });
                    setHandle(e.target.value);
                    if (e.target.value === "") {
                      setEmpty(true);
                    } else {
                      setSearching(true);
                      setEmpty(false);
                    }
                  }}
                />
              </div>
            </div>

            <div>
              {/* options buttons */}
              <div
                className={`w-full flex justify-around py-1 ${
                  accordion ? "backdrop-blur-md blur-none" : ""
                }`}
              >
                {/* Mail button */}
                <button
                  className="w-1/3 flex justify-around rounded-md 
                 border border-transparent hover:border-primary transition duration-300n-300
                py-2.5 btn-soft"
                  type="button"
                  onClick={(e) => {
                    setAccordion(!accordion);
                  }}
                  disabled={isSigningUp || (empty && !unique)}
                >
                  <Mail />
                </button>

                {/* google button */}
                <button
                  type="button"
                  disabled={isSigningUp || (empty && !unique)}
                  className="w-1/3 flex justify-around rounded-md 
                border border-transparent hover:border-primary transition duration-300
                py-2.5 btn-soft"
                onClick={(e)=>{
                  setAccordion(false);
                  googleSignIn(handle);
                }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="25"
                    height="25"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* ACCORDION */}
              <div
                className={
                `overflow-hidden transition-all duration-300 ${
                  accordion ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
              }`
              }
              >
                <div className="form-control my-2 w-full">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="John Doe"
                      value={FormData.FullName}
                      onChange={(e) =>
                        setFormData({ ...FormData, FullName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-control my-2 w-full">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="you@example.com"
                      value={FormData.Email}
                      onChange={(e) =>
                        setFormData({ ...FormData, Email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-control my-2 w-full">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={ShowPassword ? "text" : "password"}
                      className={`input input-bordered w-full pl-10`}
                      placeholder="••••••••"
                      value={FormData.Password}
                      onChange={(e) =>
                        setFormData({ ...FormData, Password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!ShowPassword)}
                    >
                      {ShowPassword ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full my-2" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
              </div>
            
            {/* sign in message */}
          <div className=" w-full text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
            </div>
            {/* <button className="btn btn-soft">Sign In with Google</button> */}
          </form>

          
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
