import axios from "axios";
import React, { useEffect, useState } from "react";

const Download = () => {
  const [uploadFiles, setUploadFiles] = useState([]);

  // const fetchdata = async () => {
  //   const data = await axios.post("http://localhost:5000/api/files/");

  //   console.log(data);

  //   setUploadFiles(data);
  // };

  // useEffect(() => {
  //   fetchdata();
  // }, []);

  // console.log("uploadFiles data ==== ", uploadFiles);

  return <div>download</div>;
};

export default Download;
