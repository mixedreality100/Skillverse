import React, { useState } from 'react';
import styled from 'styled-components';

const Switch = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <StyledWrapper>
      <div id="menuToggle">
        <input id="checkbox" type="checkbox" onClick={toggleDropdown} />
        <label className="toggle" htmlFor="checkbox">
          <div className="bar bar--top" />
          <div className="bar bar--middle" />
          <div className="bar bar--bottom" />
        </label>
      </div>
      {isOpen && (
        <Dropdown isOpen={isOpen}>
          <DropdownItem>3D Model</DropdownItem>
          <DropdownItem>Benefits of Aloe Vera</DropdownItem>
          <DropdownItem>Immersive Interaction</DropdownItem>
          <DropdownItem>Quiz</DropdownItem>
        </Dropdown>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
position: absolute; /* Change to fixed if you want it to stay on screen while scrolling */
top: 20px; /* Adjust as needed */
right: 20px; /* Adjust as needed */

  
  #checkbox {
    display: none;
  }

  .toggle {
    position: relative;
    width: 40px;
    cursor: pointer;
    margin: auto;
    display: block;
    height: calc(4px * 3 + 11px * 2);
  }

  .bar {
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: calc(4px / 2);
    background: #000000;
    color: inherit;
    opacity: 1;
    transition: none 0.35s cubic-bezier(.5,-0.35,.35,1.5) 0s;
  }

  /***** Tornado Animation *****/

  .bar--top {
    bottom: calc(50% + 11px + 4px/ 2);
    transition-property: bottom,transform;
    transition-delay: calc(0s + 0.35s) * .6;
  }

  .bar--middle {
    top: calc(50% - 4px/ 2);
    transition-property: opacity,transform;
    transition-delay: calc(0s + 0.35s * .3);
  }

  .bar--bottom {
    top: calc(50% + 11px + 4px/ 2);
    transition-property: top,transform;
    transition-delay: 0s;
  }

  #checkbox:checked + .toggle .bar--top {
    transform: rotate(-135deg);
    transition-delay: 0s;
    bottom: calc(50% - 4px/ 2);
  }

  #checkbox:checked + .toggle .bar--middle {
    opacity: 0;
    transform: rotate(-135deg);
    transition-delay: calc(0s + 0.35s * .3);
  }

  #checkbox:checked + .toggle .bar--bottom {
    top: calc(50% - 4px/ 2);
    transform: rotate(-225deg);
    transition-delay: calc(0s + 0.35s * .6);
  }`;

const Dropdown = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  position: absolute;
  top: 18px; /* Adjust as needed to position below the switch */
  right: 34px;
  width: 348px; /* Set width to 548px */
  height: 274px; /* Set height to 474px */
  background-color: white; /* Background color of the dropdown */
  border: 1px solid #ccc; /* Border for the dropdown */
  border-radius: 20px 0px 20px 20px; /* Rounded corners */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Shadow for dropdown */
  z-index: 1000; /* Ensure dropdown is above other elements */
  opacity: 0; /* Start with opacity 0 */
  visibility: hidden; /* Start with visibility hidden */
  transition: opacity 0.3s ease, visibility 0.3s ease; /* Transition for fade effect */

  /* Show dropdown when isOpen is true */
  ${({ isOpen }) => isOpen && `
    opacity: 1; /* Fade in */
    visibility: visible; /* Make it visible */
  `}
`;

const DropdownItem = styled.div`
  border-radius: 20px ; /* Rounded corners */
  padding: 15px 25px; /* Padding for dropdown items */
  cursor: pointer; /* Pointer cursor on hover */
  font-size: 25px; /* Increase font size */
  &:hover {
    background-color: #c4c3c4; /* Change background on hover */
  }
`;

export default Switch;
