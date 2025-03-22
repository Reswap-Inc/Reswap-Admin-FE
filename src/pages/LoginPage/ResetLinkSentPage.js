import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.styles.css";

import { CircularProgress } from "@mui/material";

const ResetLinkSentPage = () => {
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
                    // zIndex: 2,
                    background: "white",
                    borderRadius: "1rem",
                    padding: "5rem",
                    width: "45%",
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
                        marginBottom: "20px",
                        fontWeight: "700", // Added this line to make it bold
                    }}
                >
                    Reset Link Sent
                </h1>

                {/* Login Form */}
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        fontWeight: "400",
                        color: "#6A6A6A",
                        padding: "5px",
                        textAlign: "justify", // Updated here
                    }}
                >
                    A password reset link has been sent to the registered admin email address.
                    Please check your inbox (and spam folder).
                </p>


            </div>


        </div>
    );
};

export default ResetLinkSentPage;
