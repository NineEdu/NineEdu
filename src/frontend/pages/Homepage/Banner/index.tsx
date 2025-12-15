import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <div className="container bg-white flex pt-20 lg:flex-row flex-col ">
      {/* right section */}
      <div className="flex-1 px-10">
        {/* heading */}
        <Heading
          as="h2"
          size="xl"
          className="tracking-[2px] text-[30px] lg:!text-[48px]  uppercase leading-normal"
        >
          Your Gateway
          <br /> to Lifelong <br />
          Learning
        </Heading>

        {/* desc */}
        <Text className="mt-10" size="lg">
          Empowering learners and professionals with the skills, insights, and
          opportunities they need to thrive — fostering lifelong growth,
          innovation, and success across diverse fields of technology and
          beyond.
        </Text>

        {/* button */}
        <Link href={"/courses"}>
          <Button className="mt-10">Explore all courses</Button>
        </Link>
      </div>

      {/* left section */}
      <div className="lg:w-1/2 w-full mt-4">
        <img
          src="/banner.png"
          alt=""
          className="rounded-[50px] object-contain"
        />
      </div>
    </div>
  );
};

export default Banner;
