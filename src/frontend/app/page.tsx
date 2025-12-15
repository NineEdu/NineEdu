import Homepage from "@/pages/Homepage";
import PublicLayout from "@/shared/layouts/PublicLayout";

export const metadata = {
  title: "NineEdu - Your Gateway to Lifelong Learning",
  description:
    "Explore courses, events, and opportunities to supercharge your career through practical and accessible learning experiences.",
  openGraph: {
    title: "NineEdu - Your Gateway to Lifelong Learning",
    description:
      "Explore courses, events, and opportunities to supercharge your career through practical and accessible learning experiences.",
    url: "/wallpaper.png",
    siteName: "NineEdu",
    images: [
      {
        url: "/wallpaper.png",
        width: 1200,
        height: 630,
        alt: "NineEdu Homepage Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NineEdu - Your Gateway to Lifelong Learning",
    description:
      "Explore courses, events, and opportunities to supercharge your career through practical and accessible learning experiences.",
    images: ["/wallpaper.png"],
  },
};

export default function Home() {
  return (
    <>
      <PublicLayout>
        <Homepage />
      </PublicLayout>
    </>
  );
}
