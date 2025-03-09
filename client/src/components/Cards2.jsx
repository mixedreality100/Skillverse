import React from "react";
import styled from "styled-components";
import plantcard1 from "../../static/img/plantcard2.png";

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
              {/* SVG content can be added here if needed */}
            </g>
          </g>
        </svg>
        <div className="textBox">
          <p className="text price">
            Aloe vera gel is a natural moisturizer that can help hydrate and soften the skin. It can be particularly beneficial for dry, flaky skin.
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
    background: url(${plantcard1}) no-repeat center center;
    background-size: cover;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    position: relative;
  }

  .img {
    height: 110%;
    position: absolute;
    top: 5%;
    z-index: 1;
  }

  .textBox {
    opacity: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    z-index: 2;
    transform: translateY(0);
  }

  .textBox > .text {
    font-weight: bold;
  }

  .textBox > .head {
    font-size: 40px;
    color: white;
  }

  .textBox > .price {
    font-size: 22px;
    color: white;
    margin-left: 10px;
    padding: 0 20px;
  }
`;

export default Card;