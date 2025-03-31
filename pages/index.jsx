import Image from "next/image";
import { useState, useEffect } from 'react';
import { storage } from "../lib/firebase"
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject, getMetadata } from "firebase/storage"
import { v4 } from 'uuid'
import Link from "next/link";
import Chat from "./chat"
import Tutorial from "./tutorial"
import axios from "axios";
import clsx from "clsx";


export default function Home(props) {

  const [imageUpload, SetImageUpload] = useState(null);
  const [uploadImageUrl, SetUploadImageUrl] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [textres, Settextres] = useState("");
  const [tutorialState, SetTutorialState] = useState(false);

  const [yoloRes, SetYoloRes] = useState(false);
  const [uploadRes, SetUploadRes] = useState(false);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const imageListRef = ref(storage, "ingredients/")

  const handleImageLoad = () => {
    setIsLoading(false);  // Hide spinner once the image is loaded
  };

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async () => {  // ✅ Mark function as async
    if (imageUpload == null) return;

    // ✅ Resize image to 640x640 before uploading
    const resizedImage = await resizeImage(imageUpload, 640, 640);

    const imageRef = ref(storage, `ingredients/${imageUpload.name + v4()}`);

    try {
      // ✅ Upload Image
      const snapshot = await uploadBytes(imageRef, resizedImage);
      SetImageUpload(null);
      SetUploadImageUrl(null);
      setIsLoading(true);

      // ✅ Get Download URL
      const url = await getDownloadURL(snapshot.ref);
      console.log("Uploaded Image URL:", url);

      SetUploadImageUrl(url);
      setIsLoading(false);
      SetUploadRes(true)

      // ✅ Wait for API response
      // const response = await axios.get("http://localhost:8000/detect/latest");
      const response = await axios.get("https://yolov8-api-4ain.onrender.com/detect/latest");
      console.log("Detection Response:", response.data);
      Settextres(response.data.detections)
      SetYoloRes(true)

    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    SetUploadImageUrl("/import2.png")
    SetTutorialState(true)
  }, [])

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      {tutorialState && (
        <div className="mt-[200px] md:mt-0 absolute inset-0 flex justify-center items-center bg-gradient-to-br from-white to-gray-100 text-gray-800 z-50 px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-gray-200">

            <h2 className="text-3xl font-bold text-center text-green-600 mb-4">
              Welcome to <span className="italic text-black">'Chefsense'</span>
            </h2>

            <p className="whitespace-pre-line text-base leading-7 mb-6 text-gray-700">
              {"\t"}Have you ever had this problem?
              {"\n"}You found some ingredients in your fridge, but you had no idea what to make with them.
              {"\n"}Or maybe there were a few ingredients you didn’t even recognize.
              {"\n"}That’s where <span className="font-semibold text-green-600">Chefsense</span> comes in!
              {"\n"}Just upload a picture of the ingredients, press <span className="font-medium">Upload</span>, and that’s it!
              {"\n"}Our system will identify the ingredients and suggest dishes you can make.
              {"\n"}You can even chat with our AI to ask more about the recommended recipes.
            </p>

            <div className="mb-4 text-lg font-semibold text-gray-800">✨ How to use it:</div>
            <ul className="list-decimal list-inside text-left space-y-1 text-gray-700">
              <li>Select the picture of ingredients that you don't know.</li>
              <li>Press the <span className="font-medium">Upload</span> button to detect those ingredients.</li>
              <li>Press the <span className="font-medium">Send</span> button to ask AI about the recipe.</li>
              <li>You can continue chatting with the AI to get more ideas or adjust the dish.</li>
            </ul>

            <div className="mt-6 flex justify-center">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md"
                onClick={() => SetTutorialState(false)}
              >
                🚀 Get started
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={clsx("flex flex-col mt-[150px] md:mt-0 items-center px-4", tutorialState && "blur-sm")}>
        {/* Title */}
        <div className="flex justify-center w-full">
          <p className="font-extrabold text-[50px] md:text-[100px] text-green-600 drop-shadow-md">Chefsense</p>
        </div>

        {/* Upload Section Container */}
        <div className="flex flex-col md:flex-row justify-center items-center mt-12 w-full max-w-4xl border border-gray-300 shadow-lg rounded-xl bg-white p-6 space-y-6 md:space-y-0 md:space-x-10">

          {/* Left Column: Upload + Preview */}
          <div className="flex flex-col items-center space-y-4 w-full md:w-auto">

            {/* Upload Inputs */}
            <div className="flex md:flex-row gap-3 items-center ">
              <input
                type="file"
                id="fileInput"
                onChange={(e) => SetImageUpload(e.target.files[0])}
                className="cursor-pointer w-[250px] file:bg-white file:text-green-700 file:border-2 file:border-green-600 file:px-4 file:py-2 file:rounded-md file:font-medium active:bg-green-800
               hover:file:bg-green-600 hover:file:text-white transition duration-200"
              />
              <button
                onClick={uploadImage}
                className="px-4 py-2 rounded-md border-2 border-green-600 font-medium text-green-700 hover:bg-green-600 hover:text-white transition duration-200 active:bg-green-800"
              >
                Upload
              </button>
            </div>


            {/* Loading Spinner or Image */}
            <div className="flex justify-center items-center w-full min-h-[100px]">
              {isLoading && (
                <div className="animate-spin h-10 w-10 text-green-600">
                  <svg viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z" />
                  </svg>
                </div>
              )}
              {uploadImageUrl && (
                <Image
                  className="rounded-lg shadow-md"
                  src={uploadImageUrl}
                  width={300}
                  height={300}
                  alt="Uploaded image"
                  onLoadingComplete={handleImageLoad}
                />
              )}
            </div>
          </div>

          {/* Right Column: Chat Component */}
          {yoloRes && (
            <div className="w-full md:w-[400px]">
              <Chat initialPrompt={textres} />
            </div>)}
          {!yoloRes && uploadRes && (
            <div className="animate-spin h-10 w-10 text-green-600">
              <svg viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
