import React from "react";

interface TestimonialCardProps {
  name: string;
  title: string;
  avatarSrc: string;
  quote: string;
  className?: string;
}

const Quote: React.FC<TestimonialCardProps> = ({
  name,
  title,
  avatarSrc,
  quote,
  className = "",
}) => {
  return (
    <div
      className={`relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-8 shadow-lg ${className}`}
    >
      {/* header  */}
      <div className="flex items-center gap-4">
        {/* avatar */}
        <img
          src={avatarSrc}
          alt={name}
          className="h-14 w-14 rounded-full object-cover"
        />

        {/* info  */}
        <div className="flex flex-col">
          {/* name */}
          <p className="text-lg font-bold text-gray-900">{name}</p>

          {/* title */}
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>

      {/* content  */}
      <div className="mt-6 flex gap-2">
        {/* icon */}
        <span className="text-[50px] font-bold text-gray-500 opacity-80">
          “
        </span>

        {/* quote */}
        <p className="relative z-10 text-base leading-relaxed text-gray-700 line-clamp-5">
          {quote}
        </p>
      </div>
    </div>
  );
};

export default Quote;
