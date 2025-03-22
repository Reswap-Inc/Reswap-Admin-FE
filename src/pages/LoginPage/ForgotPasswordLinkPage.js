import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.styles.css";
import { userLoginValidationSchema } from "../../config/ValidationSchema";
import { userLogin } from "../../network/AuthApi";
import { encryptData, decryptData } from "../../config/encryption";
import { CircularProgress } from "@mui/material";

const ForgotPasswordLinkPage = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);




    return (
        <div
            className="background-wrapper"
            style={{
                // marginTop: "33px",
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
                    top: "45%",
                    left: "50%",

                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    background: "white",
                    borderRadius: "1rem",
                    padding: "3rem",

                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* BigTrader Logo */}
                <div
                    style={{
                        textAlign: "center",
                        padding: "1em",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {" "}
                    <img src="/iprocureLoginlogo.svg" alt="BigTrader" style={{ width: "250px" }} />
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
                    Forgot Password
                </h1>

                {/* Login Form */}
                <p style={{ fontSize: "14px", lineHeight: "22px", fontWeight: "400", color: "#6A6A6A", padding: "5px" }}>A password reset link will be sent to your registered admin email address.</p>
                <button
                    type="submit"
                    onClick={() => navigate("/forgot-password-link")}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#5CBA47",
                        color: "#1C1C1C",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "18px",
                        fontWeight: "700",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        marginBottom: "20px",
                        marginTop: "2em",
                        position: "relative", // Needed to position the loader
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "48px", // Explicit height ensures consistency
                    }}
                    disabled={isLoading} // Disable button while loading
                >
                    {isLoading ? (
                        <CircularProgress
                            size={24}
                            style={{
                                color: "white",
                                position: "absolute",
                            }}
                        />
                    ) : (
                        "Send Reset Link"
                    )}
                </button>
            </div>


        </div>
    );
};

export default ForgotPasswordLinkPage;
