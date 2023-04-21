import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { download, uploadFiles } from "./../services/api";
import ViewFile from "./viewFile";

const PostFiles = () => {
  const [file, setFile] = useState();

  const fileInputRef = useRef();

  const onUploadClick = () => {
    fileInputRef.current.click();
    // console.log("clicked");
  };

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        let response = await uploadFiles(data);
        console.log("response", response);
      }
    };
    getImage();
  }, [file]);

  // console.log("uploaded files >>>> ", file);
  return (
    <>
      {" "}
      <div className="bg-black h-screen overflow-hidden flex m-0 p-0">
        <Image
          src="/as.jpg"
          alt="banner"
          width={300}
          height={300}
          className="w-2/6"
        />
        <div
          className="w-2/6 h-96 m-auto bg-white flex flex-col items-center text-black
         "
        >
          <h1 className="text-3xl m-10 text-orange-600 text-center">
            inShare! <br />{" "}
            <span className="text-2xl text-amber-300">Simple File Sharing</span>
          </h1>
          <p className="text-center">
            Upload and share the Files with download link.
          </p>

          <button
            className="w-40 h-11 text-white text-lg m-7 rounded-md bg-orange-500 border-2 border-orange-800 "
            onClick={() => onUploadClick()}
          >
            Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
      </div>
    </>
  );
};

export default PostFiles;
