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

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const imageListRef = ref(storage, "ingredients/")

  const handleImageLoad = () => {
    setIsLoading(false);  // Hide spinner once the image is loaded
  };

  const uploadImage = async () => {  // ✅ Mark function as async
    if (imageUpload == null) return;

    const imageRef = ref(storage, `ingredients/${imageUpload.name + v4()}`);

    try {
      // ✅ Upload Image
      const snapshot = await uploadBytes(imageRef, imageUpload);
      SetImageUpload(null);
      SetUploadImageUrl(null);
      setIsLoading(true);

      // ✅ Get Download URL
      const url = await getDownloadURL(snapshot.ref);
      console.log("Uploaded Image URL:", url);

      SetUploadImageUrl(url);
      setIsLoading(false);

      // ✅ Wait for API response
      const response = await axios.get("http://localhost:8000/detect/latest");
      console.log("Detection Response:", response.data);
      Settextres(response.data.detections)

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
        <div className="absolute inset-0 flex justify-center items-center bg-gradient-to-br from-white to-gray-100 text-gray-800 z-50 px-6">
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
      <div className={clsx("flex-col mt-[150px] md:mt-0")}>
        <div className="flex w-full justify-center h-auto">
          <p className="font-thin text-[75px] mt-10 md:mt-0 md:text-[100px]">Chefsense</p>
        </div>
        <div className="flex-col mt-12 md:mt-0 flex md:flex-row justify-center items-center w-[375px] md:w-auto h-auto border-2 px-5 py-5 rounded-md border-gray-600">
          <div className="flex-col flex">
            <div className="flex justify-between w-[350px] md:w-auto">
              <input type="file"
                id="fileInput"
                onChange={(e) => { SetImageUpload(e.target.files[0]) }}
                className="w-[250px] file:bg-white file:rounded-md file:font-medium file:py-1.5 file:px-3 file:hover:bg-black file:hover:border-2 file:hover:text-white file:duration-100 file:active:bg-white file:active:bottom-2 file:active:text-black file:border-black file:border-2 " />
              <button onClick={uploadImage} className="py-1.5 px-3 rounded-md font-medium hover:bg-black hover:border-2 hover:text-white duration-100 active:bg-white active:bottom-2 active:text-black border-black border-2 ">
                Upload
              </button>
            </div>
            <div className="flex w-full justify-center mt-0 md:mt-5">
              {isLoading && (
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0116 0H4z"
                    />
                  </svg>
                </div>
              )}
              {uploadImageUrl && (
                <Image
                  className="rounded-md mt-2 md:mt-0 "
                  src={uploadImageUrl}
                  width={300}
                  height={300}
                  alt="Uploaded image"
                  onLoadingComplete={handleImageLoad}  // Trigger when loading completes
                />
              )}
            </div>
          </div>
          <Chat
            initialPrompt={textres}
          />
          {/* <Link href="/chat" className="py-1.5 px-3 rounded-md font-medium hover:bg-black hover:border-0 hover:text-white duration-100 active:bg-white active:bottom-2 active:text-black border-black border-2 ">Go to Chat</Link> */}

        </div>
      </div>

    </div >
  );
}
