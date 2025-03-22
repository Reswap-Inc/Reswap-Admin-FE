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
      <div>
        {/* <img src="/hydrogen/assets/icon.8024c299.png "
        height={60} width={700}
        /> */}
         <iframe
        src="/hydrogen/index.html"
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="Hydrogen Chat"
      ></iframe>
      </div>
     
    );
 
  // return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};


export default MatrixChat;
