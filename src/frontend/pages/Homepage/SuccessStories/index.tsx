import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import React from "react";
import Quote from "./Quote";

export const testimonialsData = [
  {
    name: "Kane Vo",
    title: "Backend Developer",
    avatarSrc: "/avatars/kane.jpeg",
    quote:
      "After 1 year as a C# Backend Developer at Codeleap, I was confident in building apps. The Cloud & DevOps course at NineEdu taught me how to run and scale them. Understanding CI/CD, Kubernetes, and infrastructure optimization was a complete mindset shift. I don't just write code anymore; I know how to make it perform.",
  },
  {
    name: "Quoc Luong",
    title: "Frontend Developer | UI/UX Designer",
    avatarSrc: "/avatars/quoc-luong.png",
    quote:
      "As an Frontend at Cohart, I lived on the receiving end of APIs. This Full-stack course (with Node.js/Go) unlocked the entire system for me. I now understand where the data comes from and why an API is designed a certain way. I can build features end-to-end and my communication with the backend team is 100% more effective.",
  },
  {
    name: "Tri Doan",
    title: "Backend Developer",
    avatarSrc: "/avatars/chi.jpg",
    quote:
      "I learned how to design user-centric Web3 experiences. The collaboration with peers was invaluable for my professional growth and perspective.",
  },
  {
    name: "My Tran",
    title: "Bussiness Analyst",
    avatarSrc: "/avatars/banton.jpg",
    quote:
      "This program opened my eyes to the power of on-chain data. It's a new frontier, and I'm excited to apply my skills to this innovative field.",
  },
];
const SuccessStories = () => {
  return (
    <div className="container flex justify-center flex-col">
      {/* heading */}
      <Heading size="lg" className="text-center">
        SUCCESSFUL STORIES
      </Heading>

      {/* subtitle */}
      <Text className="text-center mt-4">
        Explore real journeys where passion, perseverance, and the right
        guidance come together to create lasting impact.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {testimonialsData.map((testimonial, idx) => (
          <Quote
            key={idx}
            name={testimonial.name}
            title={testimonial.title}
            avatarSrc={testimonial.avatarSrc}
            quote={testimonial.quote}
          />
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
