import Image from "next/image";
import { useState, useEffect } from 'react';
import { storage } from "../lib/firebase"
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject, getMetadata } from "firebase/storage"
import { v4 } from 'uuid'


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
      <div className="flex justify-center items-center w-auto h-auto border-2 px-5 py-5 rounded-md border-gray-600">
        <div className="flex-col flex">

          <div className="flex">
            <input type="file"
              id="fileInput"
              onChange={(e) => { SetImageUpload(e.target.files[0]) }}
              className="file:bg-white file:rounded-md file:font-medium file:py-1.5 file:px-3 file:hover:bg-black file:hover:border-0 file:hover:text-white file:duration-100 file:active:bg-white file:active:bottom-2 file:active:text-black file:border-black file:border-2 " />
            <button onClick={uploadImage} className="py-1.5 px-3 rounded-md font-medium hover:bg-black hover:border-0 hover:text-white duration-100 active:bg-white active:bottom-2 active:text-black border-black border-2 ">
              Upload
            </button>
          </div>
          <div className="flex w-full justify-center mt-5">
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
                className="rounded-md"
                src={uploadImageUrl}
                width={300}
                height={300}
                alt="Uploaded image"
                onLoadingComplete={handleImageLoad}  // Trigger when loading completes
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
