import { PaperClipIcon } from "@/app/components/Svgs";
import React, { useEffect, useRef, useState } from "react";

const SendMessageFormAttachment = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileCount, setFileCount] = useState(0);
  useEffect(() => {
    fileInputRef.current?.addEventListener("change", (e: any) => {
      setFileCount(e?.target?.files?.length || 0);
    });
  }, []);
  return (
    <div className="w-6 h-6 relative">
      <input
        multiple
        ref={fileInputRef}
        name="attachments"
        type="file"
        hidden
      />
      {fileCount > 0 && (
        <span className="absolute bg-red-600 text-white rounded-full w-4 h-4 text-xs flex justify-center items-center -top-2 -right-2">
          {fileCount}
        </span>
      )}
      <PaperClipIcon
        onClick={() => fileInputRef.current?.click()}
        className="w-6 h-6 absolute inset-0"
      />
    </div>
  );
};

export default SendMessageFormAttachment;
