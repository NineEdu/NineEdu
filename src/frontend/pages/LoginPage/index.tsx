import { Heading } from "@/components/Heading";
import React from "react";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* left */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-purple-200 via-blue-200 to-blue-300 p-6">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* right  */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-6">
        {/* img */}
        <img src="/banner2.png" alt="banner" className="w-4/5 max-w-md" />

        {/* title */}
        <Heading size="lg" className="text-center mt-6 text-[#10069d]">
          LEARN FROM THE BEST <br /> Anytime, Anywhere.
        </Heading>
      </div>
    </div>
  );
};

export default LoginPage;
