import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const DashboardSigleCard = ({ label, value }) => {
    return (
        <Card
            sx={{
                textAlign: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                padding: 2,
                height: "150px",
                width: "100%",
                maxWidth: "180px",
                margin: "0 auto",
            }}
        >
            <CardContent>
                <Typography
                    variant="h4"
                    sx={{ color: "#66CAD9", fontWeight: "bold" }}
                    gutterBottom
                >
                    {value ? value : "---"}
                </Typography>
                <Typography
                    sx={{
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: 600,
                        fontSize: "12px",
                        lineHeight: "22px",
                        color: "#1C1C1C",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {label}
                </Typography>
            </CardContent>
        </Card>

    );
};


export default DashboardSigleCard;
