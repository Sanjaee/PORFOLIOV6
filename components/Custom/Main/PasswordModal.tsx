"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const PasswordModal = ({ onClose, onSubmit }: any) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const staticPassword = "Ev9SH4"; // Set your static password here

    if (password === staticPassword) {
      toast.success("Password correct! Redirecting...");
      onSubmit();
    } else {
      setError("Incorrect password. Please try again.");
      toast.error("Incorrect password.");
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="mb-10 text-center font-bold px-4">
          <p className="text-black dark:text-white">
            This page contains sensitive data. To request access, please contact
            Me or take the password on my CV :
          </p>
          <p className="text-blue-500 mt-3">afrizaahmad18@gmail.com</p>
        </div>
        <div className="bg-white border dark:border-black p-6 rounded-md">
          <h2 className="text-lg dark:text-black font-semibold mb-4">
            Enter Password :
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="mb-2 p-2 border border-gray-300 bg-white dark:text-black rounded-md"
            />
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex justify-center mt-4 items-center">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-300 hover:bg-blue-600 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordModal;
