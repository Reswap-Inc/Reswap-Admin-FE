import { dividerClasses } from "@mui/material";
import { useEffect, useRef } from "react";


const MatrixChat = () => {
  // const containerRef = useRef(null);

  // useEffect(() => {
  //   const loadHydrogen = async () => {
  //     try {
  //       // Dynamically import Hydrogen
  //       const { Client, createHydrogenApp } = await import(
  //         "/hydrogen/dist/sw.js"
  //       );

  //       // Initialize Hydrogen client
  //       const client = new Client({
  //         homeserver: "https://reswap.tmithun.com/", // Change to your homeserver
  //       });

  //       // Create the Hydrogen app
  //       const app = createHydrogenApp({
  //         client,
  //         container: containerRef.current,
  //       });

  //       app.start();

  //       return () => app.stop(); // Cleanup on unmount
  //     } catch (error) {
  //       console.error("Hydrogen loading failed", error);
  //     }
  //   };

  //   loadHydrogen();
  // }, []);
 
    return (
      <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="/hydrogen/index.html"
        style={{ width: "100%", height: "100%", overflow: "auto" }}
        scrolling="auto"
        title="Hydrogen Chat"
      />
    </div>
    


    
     
    );
 
  // return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};


export default MatrixChat;
