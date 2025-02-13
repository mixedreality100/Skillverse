import React from "react";

const FormInput = ({ label, type, name }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder={label}
      />
    </div>
  );
};

export default FormInput;
