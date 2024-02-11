import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  const handleImageChange = (e) => {
    setCaption(null);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const playAudio = (text) => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const handleUpload = () => {
    setUploading(true);
    setCaption("");
    const formData = new FormData();
    formData.append("image", selectedFile);

    axios
      .post(`${import.meta.env.VITE_API}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Image captioned successfully:", response.data.name);
        setCaption(response.data.caption);
        playAudio(response.data.caption);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        type="file"
        className="border text-white  border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-indigo-500"
        onChange={handleImageChange}
        accept="image/*"
      />
      <div className="flex justify-center ">
        {image && (
          <img
            src={image}
            alt="Uploaded"
            className=" w-4/12 object-contain aspect-square "
          />
        )}
      </div>
      <h2 className="text-2xl font-bold">
        {caption ? (
          <>
            {caption}
            <button
              onClick={() => {
                playAudio(caption);
              }}
              className={`rounded-full p-2 flex items-center justify-center gap-1 focus:outline-none border`}
            >
              {true ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 19.2V4.8L15.2 12L6 19.2Z" fill="currentColor" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 6V18L18 12L3 6Z" fill="currentColor" />
                </svg>
              )}
            </button>
          </>
        ) : null}
      </h2>
      {image && (
        <div className="">
          <button
            className="flex items-center rounded-md border-2 border-transparent py-3 px-6 text-base font-medium text-white border-indigo-300   hover:border-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:border-indigo-500"
            onClick={handleUpload}
          >
            <div className="flex items-center">
              {uploading ? (
                <>
                  <div>Generating Caption</div>
                  <div className="loader ml-2"></div>
                </>
              ) : (
                <>Generate Caption</>
              )}
            </div>
            {/* // {uploading && <div className="loader ml-2"></div>} */}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
