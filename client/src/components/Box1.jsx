import React from "react";
import search from "../../static/img/Search.png";
import zaWarudo from "../../static/img/HomeIcon.png";
import { useNavigate } from 'react-router-dom';

export const Box = () => {
  const navigate = useNavigate();

  const handleHomeButtonClick = () => {
    navigate('/plants');
  };

  return (
    <div className="w-[1440px] h-[78px]">
      <div className="w-[1440px] h-[78px] top-0 left-0 bg-[#FFD000]">
        <div className="relative w-[1440px] h-[47px] top-4 left-[-467px]">
          <button 
            className="w-[80px] h-[50px] font-bold bg-white border border-black rounded-full hover:bg-[#0A342A] hover:text-white hover:scale-105 transition duration-200 absolute top-[3px] left-[471px] text-[15px]"
            onClick={handleHomeButtonClick}
          >
            Back
          </button>
          <div className="absolute w-[71px] h-[37px] top-[3px] left-[1287px] transition-all duration-[0.2s] ease-[ease]">
            {/* <div className="w-[69px] relative h-[37px] rounded-[100px]">
              <div className="absolute w-[69px] h-[37px] top-0 left-0 bg-white rounded-[100px] border border-solid border-black transition-all duration-[0.2s] ease-[ease] flex items-center justify-center">
                <div className="font-normal text-black text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
                  Login
                </div>
              </div>
            </div> */}
          </div>

          {/* <div className="absolute w-[219px] h-[37px] top-[3px] left-[1011px] rounded-[100px] border border-solid border-black">
            <img
              className="absolute w-[22px] h-[21px] top-[7px] left-[183px]"
              alt="Search"
              src={search}
            />
          </div> */}

          {/* <img
            className="absolute w-[49px] h-[47px] top-0 left-0"
            alt="Za warudo"
            src={zaWarudo}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Box;
