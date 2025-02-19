import Image from "next/image";
import { useState, useEffect } from 'react';
import { storage } from "../lib/firebase"
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject, getMetadata } from "firebase/storage"
import { v4 } from 'uuid'
import Link from "next/link";
import Chat from "./chat"


export default function Home() {

  const [imageUpload, SetImageUpload] = useState(null);
  const [uploadImageUrl, SetUploadImageUrl] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const imageListRef = ref(storage, "ingredients/")

  const handleImageLoad = () => {
    setIsLoading(false);  // Hide spinner once the image is loaded
  };

  const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `ingredients/${imageUpload.name + v4()}`)
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      // alert("Image Uploaded")
      SetImageUpload(null)
      SetUploadImageUrl(null)
      setIsLoading(true);

      // Get the download URL for the uploaded image
      getDownloadURL(snapshot.ref).then((url) => {
        console.log("Uploaded Image URL:", url);
        // You can set this URL in state to display or store it
        setIsLoading(false);
        SetUploadImageUrl(url);
      });
      // document.getElementById("fileInput").value = "";
    })
  };

  useEffect(() => {
    SetUploadImageUrl("/import2.png")
  }, [])

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex-col mt-[150px] md:mt-0">
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
          <Chat></Chat>
          {/* <Link href="/chat" className="py-1.5 px-3 rounded-md font-medium hover:bg-black hover:border-0 hover:text-white duration-100 active:bg-white active:bottom-2 active:text-black border-black border-2 ">Go to Chat</Link> */}

        </div>
      </div>

    </div>
  );
}
