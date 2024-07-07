import HeroInfo from "@/components/heroInfo";
import RefreshToken from "@/components/server/refreshToken";
import Image from "next/image";

export default function Home() {
  <RefreshToken />;

  return (
    <main className="main-layout">
      <div className="flex justify-between">
        <div className="flex flex-col gap-12">
          <div>
            <h1 className="lg:text-5xl md:text-4xl text-3xl font-bold lg:max-w-xl md:max-w-lg max-w-md">
              Find or Create a Team on{" "}
              <span className="bg-gradient-to-r from-red-600 to-yellow-400 inline-block text-transparent bg-clip-text">
                XDTeam
              </span>{" "}
              Play Serious Rankeds.
            </h1>
          </div>
          <div>
            <h2 className="lg:text-3xl md:text-2xl text-xl font-bold max-w-lg">
              Reach the best ranks of XDefiant with your Team
            </h2>
            <div className="relative mt-3">
              <Image
                src={"/XDefiant1.png"}
                alt="Master"
                width={100}
                height={100}
                className="w-auto h-auto z-10"
              />
              <Image
                src={"/XDefiant2.png"}
                priority
                alt="TOP500"
                width={130}
                height={130}
                className="md:w-auto md:h-auto w-[180px] h-[180px] absolute md:top-0 top-6 left-20 z-30 mask-img"
              />
              <Image
                src={"/Diamond10.png"}
                alt="Diamond"
                width={100}
                height={100}
                className="w-auto h-auto md:absolute top-0 right-40 z-10"
              />
            </div>
          </div>
          <HeroInfo />
        </div>
        <div>
          <p>ffsdf</p>
        </div>
      </div>
    </main>
  );
}
