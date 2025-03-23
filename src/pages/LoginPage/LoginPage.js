import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.styles.css";
// import { userLoginValidationSchema } from "../../config/ValidationSchema";
// import { userLogin } from "../../network/AuthApi";
// import { encryptData, decryptData } from "../../config/encryption";
import { CircularProgress } from "@mui/material";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const token = sessionStorage.getItem("iptoken");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("rememberMeEmail");

    const savedPasswordEncrypted = sessionStorage.getItem("rememberMePassword");

    if (savedEmail && savedPasswordEncrypted) {
      // const savedPassword = decryptData(savedPasswordEncrypted); // Decrypt the password
      // setLoginData({
      //   identifier: savedEmail,
      //   password: savedPassword,
      // });
      setRememberMe(true);
    }
  }, []);

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
    // rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErr) => ({ ...prevErr, apiError: "", [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // await userLoginValidationSchema.validate(loginData, {
      //   abortEarly: false,
      // });
      // const response = await userLogin(loginData);

      // const userRole = response.content.role;

      // if (userRole !== "Admin") {
      //   throw Error("You are not authorized to login as Admin");
      // }

      // console.log("Login response", response);
      // sessionStorage.setItem("iptoken", response.content.token);
      // sessionStorage.setItem("userData", JSON.stringify(response.content));

      // if (response) {
      //   if (rememberMe) {
      //     sessionStorage.setItem("rememberMeEmail", loginData.identifier);
      //     sessionStorage.setItem(
      //       "rememberMePassword",
      //       encryptData(loginData.password)
      //     ); // Encrypt the password
      //   } else {
      //     sessionStorage.removeItem("rememberMeEmail");
      //     sessionStorage.removeItem("rememberMePassword");
      //   }

      navigate("/listings");

      //   return null;
      // }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    // if (error.name === "ValidationError") {
    //   handleValidationError(error);
    // } else {
    //   setErrors({ apiError: error.message });
    // }
  };

  // Process validation errors and update the state
  const handleValidationError = (error) => {
    const validationErrors = {};

    // Iterate over each validation error
    error.inner.forEach((err) => {
      console.log(`Validation Error for ${err.path}: ${err.message}`);
      validationErrors[err.path] = err.message;
    });

    setErrors(validationErrors);
  };
  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked);
  };

  return (
    <div
      className="background-wrapper"
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,

          background: "white",
          borderRadius: "1rem",
          padding: "2.5rem 5rem 2.5rem 5rem",
          width: "43%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* BigTrader Logo */}
        <div
          style={{
            textAlign: "center",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <img src="/rlogo.png" alt="BigTrader" style={{ width: "250px" }} />
        </div>

        {/* Login Text */}
        <h1
          style={{
            textAlign: "center",
            color: "#00394D",
            fontSize: "1.875rem",
            marginBottom: "30px",
            fontWeight: "700", // Added this line to make it bold
          }}
        >
          Login
        </h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#666",
                fontSize: "14px",
              }}
            >
              Email
            </label>
            <input
              name="identifier"
              value={loginData.identifier}
              onChange={handleChange}
              placeholder="john@gmail.com"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #E5E7EB",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            />
            {errors.identifier && (
              <p className="error-message">{errors.identifier}</p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#666",
                fontSize: "14px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={handleChange}
                placeholder="Password"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "5px",
                  fontSize: "14px",
                  WebkitTextSecurity: showPassword ? "none" : "disc",
                }}
                // required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d={
                      showPassword
                        ? "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        : "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {!showPassword && (
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  )}
                </svg>
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#666",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleCheckboxChange}
                style={{ width: "16px", height: "16px" }}
              />
              Remember me
            </label>
          </div>
          {errors.apiError && (
            <p className="error-message mb-5">{errors.apiError}</p>
          )}

          <button
            type="submit"
            className={`w-full p-3 border-none rounded-md text-lg mb-5 font-bold relative flex items-center justify-center h-12 text-white ${
              isLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            style={{
              backgroundColor: "#10552F", // or use "#23BB67" for the lighter green
            }}
          >
            {isLoading ? (
              <div className="absolute">
                <CircularProgress size={24} className="text-white" />
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
      <svg
        width="639"
        height="570"
        viewBox="0 0 639 570"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.3" clip-path="url(#clip0_268_1832)">
          <rect
            opacity="0.4"
            x="-336.037"
            y="-247.815"
            width="174.412"
            height="895.117"
            rx="87.2061"
            transform="rotate(-46 -336.037 -247.815)"
            fill="#D9D9D9"
          />
          <rect
            opacity="0.2"
            x="-128.688"
            y="248.627"
            width="150.697"
            height="317.688"
            rx="75.3484"
            transform="rotate(-46 -128.688 248.627)"
            fill="#D9D9D9"
          />
          <path
            d="M270.131 219.064C265.504 223.691 258.1 223.691 253.472 219.064L33.2107 -1.19818C28.5834 -5.82553 28.5834 -13.2293 33.2107 -17.8566C37.8381 -22.484 45.2418 -22.484 49.8692 -17.8566L270.131 202.405C274.758 207.032 274.758 214.436 270.131 219.064Z"
            fill="url(#paint0_linear_268_1832)"
          />
          <path
            d="M289.242 143.776C284.614 148.404 277.211 148.404 272.583 143.776L52.3216 -76.4853C47.6942 -81.1126 47.6942 -88.5164 52.3216 -93.1437C56.9489 -97.7711 64.3527 -97.7711 68.98 -93.1437L289.242 127.118C293.869 131.745 293.869 139.242 289.242 143.776Z"
            fill="url(#paint1_linear_268_1832)"
          />
          <path
            d="M336.241 135.261C334.432 137.052 331.538 137.052 329.73 135.261L243.631 49.9979C241.822 48.2067 241.822 45.3407 243.631 43.5495C245.44 41.7582 248.334 41.7582 250.143 43.5495L336.241 128.812C338.05 130.603 338.05 133.505 336.241 135.261Z"
            fill="url(#paint2_linear_268_1832)"
          />
          <path
            d="M196.88 443.628C194.289 446.22 190.032 446.22 187.348 443.628L-40.1327 216.24C-42.724 213.649 -42.724 209.392 -40.1327 206.708C-37.5414 204.117 -33.2842 204.117 -30.6003 206.708L196.88 434.189C199.471 436.78 199.471 441.037 196.88 443.628Z"
            fill="url(#paint3_linear_268_1832)"
          />
          <path
            d="M347.732 189.865C345.14 192.456 340.883 192.456 338.199 189.865L110.719 -37.5232C108.128 -40.1145 108.128 -44.3717 110.719 -47.0555C113.31 -49.6469 117.567 -49.6469 120.251 -47.0555L347.732 180.425C350.323 183.016 350.323 187.273 347.732 189.865Z"
            fill="url(#paint4_linear_268_1832)"
          />
          <path
            d="M233.39 229.891C221.914 241.367 203.312 241.367 191.836 229.891L-3.53034 34.5247C-15.0062 23.0489 -15.0062 4.44695 -3.53034 -7.02888C7.94548 -18.5047 26.5474 -18.5047 38.0232 -7.02888L233.39 188.338C244.866 199.814 244.866 218.416 233.39 229.891Z"
            fill="url(#paint5_linear_268_1832)"
          />
          <path
            d="M134.735 225.356C130.2 229.891 122.796 229.891 118.261 225.356L-102.278 4.90962C-106.813 0.374817 -106.813 -7.02894 -102.278 -11.5637C-97.7433 -16.0985 -90.3395 -16.0985 -85.8047 -11.5637L134.735 208.883C139.269 213.418 139.269 220.822 134.735 225.356Z"
            fill="url(#paint6_linear_268_1832)"
          />
          <path
            opacity="0.6"
            d="M349.074 268.483C348.333 269.223 347.13 269.223 346.39 268.483L112.153 34.1542C111.413 33.4138 111.413 32.2107 112.153 31.4703C112.894 30.7299 114.097 30.7299 114.837 31.4703L349.166 265.799C349.814 266.54 349.814 267.743 349.074 268.483Z"
            fill="white"
          />
          <path
            opacity="0.6"
            d="M210.438 344.557C209.698 345.298 208.495 345.298 207.755 344.557L-26.4818 110.228C-27.2222 109.488 -27.2222 108.285 -26.4818 107.545C-25.7415 106.804 -24.5383 106.804 -23.798 107.545L210.531 341.873C211.179 342.614 211.179 343.817 210.438 344.557Z"
            fill="white"
          />
          <path
            opacity="0.6"
            d="M155.049 42.5303L233.158 120.64"
            stroke="white"
            stroke-width="0.8875"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
          <path
            opacity="0.5"
            d="M135.429 332.387C131.912 335.904 126.267 335.904 122.75 332.387L-99.3629 110.275C-102.88 106.758 -102.88 101.112 -99.3629 97.5956C-95.8461 94.0788 -90.2008 94.0788 -86.684 97.5956L135.429 319.708C138.946 323.225 138.946 328.963 135.429 332.387Z"
            fill="url(#paint7_linear_268_1832)"
          />
          <path
            opacity="0.5"
            d="M276.054 263.856C272.537 267.373 266.892 267.373 263.375 263.856L41.2621 41.7433C37.7453 38.2265 37.7453 32.5811 41.2621 29.0643C44.7789 25.5476 50.4243 25.5476 53.941 29.0643L276.054 251.177C279.571 254.694 279.571 260.432 276.054 263.856Z"
            fill="url(#paint8_linear_268_1832)"
          />
          <path
            opacity="0.6"
            d="M186.746 191.207C186.006 191.947 184.803 191.947 184.062 191.207L-50.2665 -43.1222C-51.0069 -43.8626 -51.0069 -45.0657 -50.2665 -45.806C-49.5261 -46.5464 -48.323 -46.5464 -47.5826 -45.806L186.746 188.523C187.487 189.263 187.487 190.466 186.746 191.207Z"
            fill="white"
          />
          <path
            opacity="0.6"
            d="M-59.1514 -4.4375L18.9583 73.6721"
            stroke="white"
            stroke-width="0.8875"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
          <rect
            opacity="0.06"
            x="653.938"
            y="191.992"
            width="85.9931"
            height="174.419"
            rx="42.9966"
            transform="rotate(134 653.938 191.992)"
            fill="#D9D9D9"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_268_1832"
            x1="4.68233"
            y1="56.7599"
            x2="279.156"
            y2="138.597"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_268_1832"
            x1="23.7567"
            y1="-18.4866"
            x2="298.23"
            y2="63.3505"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_268_1832"
            x1="232.465"
            y1="72.449"
            x2="339.582"
            y2="104.7"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_268_1832"
            x1="-47.1116"
            y1="258.822"
            x2="190.319"
            y2="265.084"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_268_1832"
            x1="103.719"
            y1="5.02912"
            x2="341.15"
            y2="11.2915"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_268_1832"
            x1="-107.873"
            y1="144.447"
            x2="158.227"
            y2="315.728"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_268_1832"
            x1="-130.216"
            y1="62.4868"
            x2="143.973"
            y2="142.887"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint7_linear_268_1832"
            x1="135.457"
            y1="332.429"
            x2="-99.3386"
            y2="97.6337"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint8_linear_268_1832"
            x1="276.092"
            y1="263.9"
            x2="41.2968"
            y2="29.1049"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop
              offset="0.916667"
              stop-color="white"
              stop-opacity="0.0833333"
            />
            <stop offset="1" stop-color="#FFA018" stop-opacity="0" />
          </linearGradient>
          <clipPath id="clip0_268_1832">
            <rect width="639" height="569.775" fill="white" />
          </clipPath>
        </defs>
      </svg>{" "}
    </div>
  );
};

export default LoginPage;
