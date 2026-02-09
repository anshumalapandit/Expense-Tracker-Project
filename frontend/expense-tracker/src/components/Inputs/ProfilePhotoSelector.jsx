import React, { useRef, useState } from 'react';
import { LuUser, LuUpload,LuTrash } from "react-icons/lu"


const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Update the image state
      setImage(file);

      // Generate preview URL from the file
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

<<<<<<< HEAD
  return <div className='flex justify-center mb-4 md:mb-6'>
=======
  return <div className='flex justify-center mb-6'>
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
    <input 
    type="file"
    accept="image/*"
    ref={inputRef}
    onChange={handleImageChange}
    className='hidden'
   />
    { ! image ? (
<<<<<<< HEAD
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
         <LuUser className='text-3xl md:text-4xl text-primary'/>
         <button
         type="button"
         className='w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 text-sm md:text-base'
=======
        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
         <LuUser className='text-4xl text-primary'/>
         <button
         type="button"
         className='w-8 h-8 flex items-center justify-center bg-primary  text-white rounded-full absolute -bottom-1 -right-1'
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
         onClick={onChooseFile}
        >
        <LuUpload/>
        </button>
        </div>
    ) :(
        <div className="relative">
            <img
            src={previewUrl}
            alt="profile photo"
<<<<<<< HEAD
            className='w-16 h-16 md:w-20 md:h-20 rounded-full object-cover'
            />
            <button
            type="button"
            className='w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 text-sm md:text-base'
=======
            className='w-20 h-20 rounded-full object-cover'
            />
            <button
            type="button"
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full -bottom-1 -right-1 '
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
            onClick={handleRemoveImage}
            >
                <LuTrash/>
                </button>
        </div>
    )}
  </div>;
};

export default ProfilePhotoSelector;
