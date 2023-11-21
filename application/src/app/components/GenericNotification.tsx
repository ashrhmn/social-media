"use client";

import { socketClient } from "@/lib/socket-client";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

const GenericNotification = () => {
  useEffect(() => {
    socketClient.on("__GenericSuccessNotification__", (msg) => {
      console.log("__GenericSuccessNotification__", msg);
      toast.success(msg);
    });
    socketClient.on("__GenericErrorNotification__", (msg) => {
      console.log("__GenericErrorNotification__", msg);
      toast.error(msg);
    });
    return () => {
      socketClient.off("__GenericSuccessNotification__");
      socketClient.off("__GenericErrorNotification__");
    };
  }, []);
  return <Toaster richColors />;
};

export default GenericNotification;
