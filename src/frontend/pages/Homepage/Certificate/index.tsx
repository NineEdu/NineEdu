import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/ui/button";
import React from "react";

const Certi = () => {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[calc(50vw-7px)] w-[calc(100vw-16px)] bg-[#10069d] text-center py-10 flex items-center justify-center">
      <div className="container flex lg:flex-row flex-col w-full h-full items-center">
        {/* left */}
        <div className="lg:w-2/5 w-[80vw] flex flex-col justify-center p-8">
          {/* title */}
          <Heading className="text-white">EARN YOUR CERTIFICATE</Heading>

          {/* subtite  */}
          <Text className="text-white mt-4">
            Boost your career with globally recognized certificates from top
            international learning programs.
          </Text>

          {/* button */}
          <Button className="bg-white text-purple-500 mt-4">Apply now !</Button>
        </div>

        {/* right */}
        <div className="lg:w-3/5 w-[80vw]  flex items-center justify-center">
          <img src="/certi.png" alt="" className="rounded-[30px] w-[700px]" />
        </div>
      </div>
    </div>
  );
};

export default Certi;
