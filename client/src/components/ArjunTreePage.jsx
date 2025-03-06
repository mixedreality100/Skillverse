import MusicControl from "./MusicControl";

export const ArjunTreePage = () => {
  return (
    <div className="bg-[#FFFFFF] flex justify-center items-center w-full min-h-screen">
      <div className="max-w-[1440px] w-full">
        <style>
          {`
            .music-control-container {
              position: absolute;
              top: 2.0rem;
              right: calc(23rem + (100% / 13));
              z-index: 50;
            }

            @media (max-width: 768px) {
              .music-control-container {
                top: 1.8rem;
                right: calc(28rem + (100% / 13));
              }
            }
          `}
        </style>
        <div className="bg-[#ffffff] overflow-hidden w-[1440px] h-[4853px] relative">
          <div className="absolute w-[1440px] h-24 top-0 left-0 bg-[#FFFFFF]">
            <div className="music-control-container">
              <MusicControl />
            </div>
          </div>
          
          {/* ... rest of your existing code ... */}
        </div>
      </div>
    </div>
  );
}; 