"use client";

import { socketClient } from "@/lib/socket-client";
import { useEffect } from "react";
import { revalidate } from "./actions";

const SocketListener = () => {
  useEffect(() => {
    socketClient.on("NEW_MESSAGE", revalidate);
    return () => {
      socketClient.off("NEW_MESSAGE", revalidate);
    };
  }, []);
  return null;
};

export default SocketListener;
