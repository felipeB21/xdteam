import "./globals.css";
import Header from "@/components/header";
import AuthContextProvider from "@/components/AuthProvider";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "800"],
});

export const metadata = {
  title: "XDTeam",
  description:
    "Find or Create a Team to play XDefiant Rankeds mode or just to have fun with others in cassual mode.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader height={2} speed={500} showSpinner={false} />
        <AuthContextProvider>
          <Header />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
