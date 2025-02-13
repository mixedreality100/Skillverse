import React from "react";
import styled from "styled-components";
import tulsi3 from "./tulsi3.png";

// import custardappple3 from "./custardapple3.jpg";

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        {/* Plant SVG */}
        <svg
          className="img"
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          width="100%"
          height="100%"
          version="1.1"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          imageRendering="optimizeQuality"
          fillRule="evenodd"
          clipRule="evenodd"
          viewBox="0 0 500 500"
        >
          <g id="Layer_x0020_1">
            <g id="plant">
              {/* SVG content commented out */}
            </g>
          </g>
        </svg>
        <div className="initialText">Respiratory Health</div>
        <div className="textBox">
          <p className="text price" style={{ marginLeft: '10px', padding: '0 20px' }}>
          Tulsi alleviates respiratory issues like asthma, cough, and cold by clearing mucus and acting as an antimicrobial, promoting better lung health.
        </p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  font-family: 'Poppins', sans-serif;
  .card {
    width: 421px;
    height: 225px;
       background-image: url(${tulsi3}); /* Use the imported image here */
    background-size: cover;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    transition: 0.2s ease-in-out;
    position: relative;
  }

  .img {
    height: 110%;
    position: absolute;
    top: 5%;
    transition: 0.2s ease-in-out;
    z-index: 1;
  }

  .initialText {
    position: absolute;
    font-size: 40px;
    color: white;
    font-weight: bold;
    z-index: 2;
    transition: 0.2s ease-in-out;
  }

  .textBox {
    opacity: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    transition: 0.2s ease-in-out;
    z-index: 2;
    transform: translateY(50px);
  }

  .textBox > .text {
    font-weight: bold;
  }

  .textBox > .price {
    font-size: 22px;
    color: white;
  }

  .card:hover .initialText {
    opacity: 0;
    transform: translateY(-30px);
  }

  .card:hover .textBox {
    opacity: 1;
    transform: translateY(0);
  }

  .card:hover > .img {
    height: 75%;
    filter: blur(2px);
    animation: anim 3s infinite;
  }

  @keyframes anim {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-100px);
    }

    100% {
      transform: translateY(0);
    }
  }

  .card:hover {
    transform: scale(1.04) rotate(0deg);
  }
`;

export default Card;
