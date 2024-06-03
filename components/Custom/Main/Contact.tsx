"use client";
import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const mailtoLink = `mailto:afrizaahmad18@gmail.com?subject=Message from ${name}&body=${encodeURIComponent(
      message
    )}%0A%0AFrom:%20${email}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="flex flex-col mt-16 sm:mt-1 items-center justify-center mb-36">
      <h1 className="text-3xl font-bold">Contact Me</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col">
          <label>Name</label>
          <input
            className="min-w-[300px] w-full p-2 border rounded-md "
            placeholder="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label>Email</label>
          <input
            className="min-w-[300px] w-full p-2 border rounded-md "
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label>Message</label>
          <textarea
            className="min-w-[300px] w-full p-2 border rounded-md "
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Contact;
