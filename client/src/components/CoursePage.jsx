import React, { useState, useRef, useEffect } from 'react';
import ARIcon from "../assets/AR_icon.svg";
import VRIcon from "../assets/VR_icon.svg";
import aloevera from "../assets/aloevera.svg";
import homeButton from "../assets/HomeBtn.svg";
import line15 from "../assets/Line_15.svg";
import menu from "../assets/Menu.png";
import closeIcon from "../assets/Menu.png";
// import line4 from "../assets/Line_4.svg";
import { useNavigate } from 'react-router-dom';







export const CoursePage = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const modelRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    const scrollToModel = () => {
        if (modelRef.current) {
            modelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const section = modelRef.current;
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleTakeQuizClick = () => {
        console.log('Navigating to quiz page...');
        navigate('/quizpage');
    };

    const handleHomeButtonClick = () => {
        navigate('/plants');
    };

    return (
      
      <div className="bg-[#cdffaa] flex flex-row justify-center w-full font-[Poppins]">
        <div className="bg-[#cdffaa] overflow-hidden w-[1440px] h-[4600px] relative">
          <div className="absolute w-full h-[965px] top-[356px] left-0 bg-[url(/fresh-aloe-vera-plant-isolated-white-vibrant-aloe-vera-plant-water-droplets-showcased-pure-white-background-325502035-1.svg)] bg-cover bg-center z-0">
          </div>


          {/* Introduction*/}          
          <section id="brief-intro" className="mt-10">
          <div className="absolute w-full top-[350px] left-0 z-10 text-center">
            <img
                className="absolute w-[1001px] h-[683px] top-[-290px] left-[270px] object-cover"
                alt="Fresh aloe vera"
                src={aloevera}
            />
            <h1 className="[-webkit-text-stroke:2px_#ffffff] font-normal text-black text-[250px] tracking-[3.00px] leading-[normal] whitespace-nowrap relative z-20 top-[-150px]">
                Aloe Vera
            </h1>
            <h2 className="font-regular italic text-black text-[50px] tracking-[-0.50px] leading-[normal] whitespace-nowrap relative z-20  mx-auto text-right absolute top-[-480px] left-1/2 transform -translate-x-1/2">
            <em>Aloe Barbadensis</em>
            </h2>
          </div>
              <div className="absolute w-[1297px] h-auto top-[705px] left-[76px] bg-[#ffffffc4] p-20 rounded-lg shadow-lg">
                  <p className="transition-all duration-[0.2s] ease-[ease] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[28px] text-left tracking-[0.38px] leading-[39px] opacity-100 scale-110">
                      <span className="tracking-[0.14px]">
                          Hey there! Let me tell you about a super cool plant called{" "}
                      </span>

                      <span className="[font-family:'Poppins-Bold',Helvetica] font-bold tracking-[0.14px]">
                          Aloe vera
                      </span>

                      <span className="tracking-[0.14px] [font-family:'Poppins-Regular',Helvetica]">
                          . Think of it like a special plant superhero that's been
                          helping people stay healthy for thousands of years!
                          <br />
                          <br />
                          It's like a cactus with thick, squishy leaves filled with a clear gel. People
                          use this gel like nature's band-aid - it helps make cuts feel better and
                          keeps skin healthy. In ancient times, kings and queens in Egypt even
                          called it the "plant of immortality" because they thought it was magical!
                          <br />
                          <br />
                          Today, we still use Aloe vera in lots of ways - in skin creams,
                          drinks, and medicine. It's like having a natural first-aid kit
                          growing right in your garden!
                      </span>
                  </p>
              </div>
          </section>
  
          <div className="absolute w-[1355px] h-[784px] top-[1490px] left-[15px]">
            <div className="absolute w-[508px] h-[565px] top-[113px] left-[763px]">
            </div>
            {/* 3D model */}
            <section ref={modelRef} id="3D-Model" className={`mt-10 fade-in ${isVisible ? 'visible' : ''}`}>
                <img
                    className="absolute w-[1001px] h-[683px] top-[-125px] left-[480px] object-cover z-0"
                    alt="Fresh aloe vera"
                    src={aloevera}
                />
                <p className="absolute w-[678px] top-100 left-0 bg-white bg-opacity-50 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[26px] tracking-[0] leading-[33px] pl-2 pr-4 pt-4 pb-4 z-10">
                    <span className="[font-family:'Poppins-Regular',Helvetica] font-light text-black text-[26px] tracking-[0] leading-[33px]">
                        Aloe vera is a succulent plant known for its medicinal properties.
                        It is characterized by:
                        <br />
                        <br />
                    </span>

                    {/* <span className="[font-family:'Poppins-Bold',Helvetica] font-bold">
                        Stem
                    </span>

                    <span className="[font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[26px] tracking-[0] leading-[33px]">
                        : Aloe vera typically has a short, stout stem, often hidden under
                        the rosette of leaves. Some varieties may have a slightly longer
                        stem, but it&#39;s generally not a prominent feature.
                        <br />
                        <br />
                    </span> */}

                    <span className="[font-family:'Poppins-Bold',Helvetica] font-bold">
                        Leaves
                    </span>

                    <span className="[font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[26px] tracking-[0] leading-[33px]">
                        : Thick, fleshy, and lance-shaped with serrated edges. They are
                        typically green to gray-green with white flecks.
                        <br />
                        <br />
                    </span>

                    {/* <span className="[font-family:'Poppins-Bold',Helvetica] font-bold">
                        Flowers
                    </span>

                    <span className="[font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[26px] tracking-[0] leading-[33px]">
                        : Aloe vera produces tall flower stalks with clusters of tubular
                        flowers. The flowers are typically yellow or orange, but some
                        varieties may have red or pink flowers.  <br />
                        <br />
                    </span> */}

                    <span className="[font-family:'Poppins-Bold',Helvetica] font-bold">
                        Gel
                    </span>

                    <span className="[font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[26px] tracking-[0] leading-[33px]">
                        : The inner part of the leaf contains a clear, gel-like substance
                        that is rich in nutrients and has various medicinal properties.
                    </span>
                </p>
            </section>
          </div>
  
          {/* Navbar */}
          <section id="navbar" className="fixed top-0 left-0 w-full h-20 bg-[#212121] z-50">
              <img
                  className="absolute w-px h-[74px] top-1.5 left-[110px] object-cover"
                  alt="Line"
                  src={line15}
              />

              <p className="absolute top-[20px] left-[136px] z-10 [font-family:'Poppins-Regular',Helvetica] font-bold text-[25px] text-white text-center leading-[36px] whitespace-nowrap">
                  Aloe vera: A Succulent with Healing Powers
              </p>

              <img
                  className="absolute w-[75px] h-[54px] top-[12px] left-[11px] cursor-pointer"
                  alt="Home button"
                  src={homeButton}
                  onClick={handleHomeButtonClick}
              />

              <img
                  className="absolute w-[50px] h-[50px] top-2 right-5 cursor-pointer"
                  alt="Menu"
                  src={menu}
                  onClick={toggleDropdown}
              />
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                  <div className="absolute top-10 right-[80px] bg-white shadow-lg rounded-lg p-5 z-50 transform scale-105">
                     <h3 className="text-[40px] font-bold mb-2">Course Modules</h3>
                     <div className="border-b border-black mb-2" />
                     <ul className="list-none">
                          <li onClick={closeDropdown} className="py-2 px-4 cursor-pointer hover:bg-gray-300 text-[31px]">Introduction</li>
                          <li onClick={closeDropdown} className="py-2 px-4 cursor-pointer hover:bg-gray-300 text-[31px]">3D Model</li>
                          <li onClick={closeDropdown} className="py-2 px-4 cursor-pointer hover:bg-gray-300 text-[31px]">Benefits of Aloe Vera</li>
                          <li onClick={closeDropdown} className="py-2 px-4 cursor-pointer hover:bg-gray-300 text-[31px]">Immersive Interaction</li>
                          <li onClick={closeDropdown} className="py-2 px-4 cursor-pointer hover:bg-gray-300 text-[31px]">Quiz</li>
                      </ul>
                  </div>
              )}
          </section>
  
          <section id="benefits" className="mt-10">
            <div className="absolute w-[1304px] h-[722px] top-[2203px] left-[70px] bg-white rounded-[15px]">
                <p className="absolute w-[1240px] top-[25px] left-[20px] [font-family:'Poppins-Bold',Helvetica] font-normal text-black text-[32px] tracking-[-0.96px] leading-[40px]">
                    <span className="font-bold tracking-[-0.31px]">&#9733; Soothes Skin</span>

                    <span className="[font-family:'Poppins-Regular',Helvetica] tracking-[-0.31px]">
                        : Aloe vera gel is widely known for its soothing properties on the
                        skin. It can help relieve sunburn, minor burns, cuts, scrapes, and
                        irritation.  <br />
                        <br />
                    </span>

                    <span className="font-bold tracking-[-0.31px]">
                    &#9733; Moisturizes Skin
                    </span>

                    <span className="[font-family:'Poppins-Regular',Helvetica] tracking-[-0.31px]">
                        : Aloe vera gel is a natural moisturizer that can help hydrate and
                        soften the skin. It can be particularly beneficial for dry, flaky
                        skin.
                        <br />
                        <br />
                    </span>

                    <span className="font-bold tracking-[-0.31px]">
                    &#9733; Promotes Wound Healing
                    </span>

                    <span className="[font-family:'Poppins-Regular',Helvetica] tracking-[-0.31px]">
                        : Aloe vera contains compounds that may help speed up the healing
                        process of minor wounds.
                        <br />
                        <br />
                    </span>

                    <span className="font-bold tracking-[-0.31px]">
                    &#9733; Reduces Inflammation
                    </span>

                    <span className="[font-family:'Poppins-Regular',Helvetica] tracking-[-0.31px]">
                        : It has anti-inflammatory properties that can help reduce redness
                        and swelling associated with various skin conditions.
                        <br />
                        <br />
                    </span>

                    <span className="font-bold tracking-[-0.31px]">
                    &#9733; May Improve Digestive Health
                    </span>

                    <span className="[font-family:'Poppins-Regular',Helvetica] tracking-[-0.31px]">
                        : Some studies suggest that Aloe vera may have beneficial effects
                        on digestion, such as relieving constipation.
                        <br />
                        <br />
                    </span>

                    <span className="font-bold tracking-[-0.31px]">
                    &#9733; May Boost Immunity
                    </span>

                    <span className="[font-family:'Poppins-Regular',Helvetica] tracking-[-0.31px]">
                        : Some research suggests that Aloe vera may have immune-boosting
                        properties, although more research is needed.
                    </span>
                </p>
            </div>

            <div className="absolute w-[1303px] h-[150px] top-[2080px] left-[0px]">
                <div className="relative w-[1301px] h-[150px]">
                    <div className="absolute w-[1440px] h-[75px] top-0 left-0 bg-[#ffffffc4]" />
                    <p className="absolute w-[1297px] top-[20px] left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[45px] text-center tracking-[-0.90px] leading-[42px]">
                        Benefits Of Aloe Vera
                    </p>
                </div>
            </div>
          </section>
  
          <section id="AR_VR" className="relative">
              <div className="absolute w-[1440px] h-[75px] top-[2950px] left-[0px] bg-[#ffffffc4]">
                  <p className="absolute w-[1240px] top-[20px] left-[250px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[45px] tracking-[-1.47px] leading-[42px] whitespace-nowrap">
                      Time for some Interactive and Immersive Experience!
                  </p>
              </div>

              {/* <div className="absolute w-[266px] h-[69px] top-[5900px] left-[264px]">
                  <div className="relative w-[298px] h-[95px] bg-white rounded-[30px] border border-solid border-black shadow-[8px_8px_4px_#00000040]">
                      <div className="absolute w-[127px] top-6 left-[90px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] tracking-[-0.96px] leading-[42px] whitespace-nowrap">
                          Enter AR
                      </div>
                  </div>
              </div>

              <div className="absolute w-[266px] h-[69px] top-[5900px] left-[944px]">
                  <div className="relative w-[298px] h-[95px] bg-white rounded-[30px] border border-solid border-black shadow-[8px_8px_4px_#00000040]">
                      <div className="absolute w-[127px] top-[25px] left-[90px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] tracking-[-0.96px] leading-[42px] whitespace-nowrap">
                          Enter VR
                      </div>
                  </div>
              </div> */}
          </section>
  
          <section id="take-quiz-button" className="relative">
              <div className="absolute w-[1440px] h-[75px] top-[3500px] left-[0px] bg-[#ffffffc4]">
                  <p className="absolute w-[1331px] top-[20px] left-[35%] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[45px] tracking-[-1.59px] leading-[42px] whitespace-nowrap">
                      Time for some QUIZ
                  </p>
              </div>

              <div className="absolute w-[360px] h-[46px] top-[2042px] left-[1658px] bg-[#333333c4]" />

              <div className="absolute w-[300px] h-[95px] top-[3700px] left-[578px]">
                  <button 
                      className="relative w-[298px] h-[95px] bg-white rounded-[25px] border border-solid border-black shadow-[8px_8px_4px_#00000040] transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
                      onClick={handleTakeQuizClick}
                  >
                      <div className="absolute w-[154px] top-[29px] left-[71px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] tracking-[-0.96px] leading-[42px] whitespace-nowrap">
                          TAKE QUIZ
                      </div>
                  </button>
              </div>
          </section>
  
          <section id="3d-model-heading" className="relative">
              <div className="absolute w-[1439px] h-[75px] top-[1250px] left-0 bg-[#ffffffc4]">
                  <p className="absolute w-[706px] top-5 left-1/2 transform -translate-x-1/2 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[45px] tracking-[-1.71px] leading-[42px] whitespace-nowrap">
                      Check Out This 3D model!
                  </p>
              </div>

              <p className="absolute w-[618px] top-[1400px] left-[20px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-black text-[44px] tracking-[0] leading-[22.4px] whitespace-nowrap">
                  Aloe vera: Nature&#39;s First Aid
              </p>
          </section>
  
          <section id="ar_vr-icon" className="relative">
  {/* AR Icon */}
  <div className="group relative w-[266px] h-[266px] top-[3100px] left-[350px] bg-white rounded-[40px] border border-solid border-black shadow-[inset_10px_10px_4px_#00000040] transition-all duration-200 hover:w-[400px] flex items-center overflow-hidden">
    <img
      className="absolute w-[120px] h-[120px] top-[75px] left-[80px] transition-all duration-200 group-hover:translate-x-[-50px] object-cover"
      alt="AR icon"
      src={ARIcon}
    />
    <span className="ml-[240px] text-[52px] font-bold opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
      AR
    </span>
  </div>

  {/* VR Icon */}
  <div className="group absolute w-[266px] h-[266px] top-[3100px] right-[350px] bg-white rounded-[40px] border border-solid border-black shadow-[inset_10px_10px_4px_#00000040] transition-all duration-200 hover:w-[400px] flex items-center overflow-hidden">
    <img
      className="absolute w-[120px] h-[120px] top-[75px] right-[70px] transition-all duration-200 group-hover:translate-x-[50px] object-cover"
      alt="VR icon"
      src={VRIcon}
    />
    <span className="ml-[90px] text-[52px] font-bold opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
      VR
    </span>
  </div>
</section>  

          {/* Footer */}
          <div className="absolute bottom-0 left-0 w-full h-[440px] top-[4155px] ">
            <div className="relative w-full h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover">
              <div className="absolute top-[252px] left-[23px] w-[1374px] h-[178px] bg-white rounded-[12px]">
                <div className="flex justify-center space-x-4 mt-4">
                <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105 transition duration-200">
                  Instagram
                </button>
                  <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-black hover:text-white hover:scale-105 transition duration-200">
                    Twitter
                  </button>
                  <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-blue-500 hover:text-white hover:scale-105 transition duration-200">
                    Facebook
                  </button>
                  <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-red-500 hover:text-white hover:scale-105 transition duration-200">
                    Pinterest
                    </button>
                </div>

                <div className="mt-4 border-t border-gray-300"></div>

                <div className="text-center mt-2">
                  <p className="text-xl text-gray-800">© 2024, All Rights Reserved</p>
                </div>
              </div>

              <p className="absolute top-[40px] left-[363px] text-[64px] font-normal text-center text-white">
                Be the one with
                <span className="text-red-500"> Nat</span>
                <span className="text-[#B9DE00]">ur</span>
                <span className="text-red-500">e</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };