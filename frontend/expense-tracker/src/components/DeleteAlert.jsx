import React from "react";

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
<<<<<<< HEAD
      <p className="text-sm md:text-base">{content}</p>

      <div className="flex justify-end mt-4 md:mt-6">
=======
      <p className="text-sm">{content}</p>

      <div className="flex justify-end mt-6">
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
