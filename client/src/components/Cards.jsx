import React from "react";
import styled from "styled-components";
import plantcard1 from "../../static/img/plantcard1.png";

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
            Aloevera gel is widely known for its soothing properties on the
            skin. It can help relieve sunburn, minor burns, cuts, scrapes, and
            irritation.
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
    overflow: hidden;
  }

  .img {
    height: 110%;
    position: absolute;
    top: 5%;
    z-index: 1;
  }

  .initialText {
    position: absolute;
    font-size: 40px;
    color: white;
    font-weight: bold;
    z-index: 2;
  }

  .textBox {
    opacity: 1; /* Always visible */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    z-index: 2;
    transform: translateY(0); /* No initial translation */
    padding: 20px;
    text-align: center;
  }

  .textBox > .text {
    font-weight: bold;
  }

  .textBox > .price {
    font-size: 22px;
    color: white;
  }
`;

export default Card;