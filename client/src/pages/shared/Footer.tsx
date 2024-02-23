import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 p-6  text-center">
      <div className="container mx-auto">
        <p className="text-lg font-bold mb-2">Talktive</p>
        <p className="text-sm mb-4">Connect, communicate, and collaborate</p>
        <div className="flex justify-center mb-4">
          <a href="#" className="mr-4">
            About
          </a>
          <a href="#" className="mr-4">
            Contact
          </a>
          <a href="#" className="mr-4">
            Privacy Policy
          </a>
          <a href="#">Terms of Service</a>
        </div>
        <p className="text-sm">&copy; 2024 Talktive. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
