import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import facebookLogo from "/src/assets/Facebook logo.png";
import instagram from "/src/assets/Instagram.png";
import logo from "/src/assets/HomeBtn.svg";
// import testAccount from "/src/assets/test_account.svg";

export const QuizPage = () => {
	const [selectedOptionQ1, setSelectedOptionQ1] = useState(null);
	const [selectedOptionQ2, setSelectedOptionQ2] = useState(null);
	const [selectedOptionQ3, setSelectedOptionQ3] = useState(null);
	const [selectedOptionQ4, setSelectedOptionQ4] = useState(null);
	const [selectedOptionQ5, setSelectedOptionQ5] = useState(null);

	const handleOptionClickQ1 = (option) => setSelectedOptionQ1(option);
	const handleOptionClickQ2 = (option) => setSelectedOptionQ2(option);
	const handleOptionClickQ3 = (option) => setSelectedOptionQ3(option);
	const handleOptionClickQ4 = (option) => setSelectedOptionQ4(option);
	const handleOptionClickQ5 = (option) => setSelectedOptionQ5(option);

	const navigate = useNavigate(); // Initialize navigate

	const handleHomeClick = () => {
	  navigate("/"); // Navigate to LandingPage
	};
  
	const handleCoursesClick = () => {
	  navigate("/plants"); // Navigate to Plants
	};

	return (
		<div className="bg-white flex flex-row justify-center w-full">
			<div className="bg-white w-[1440px] h-[4997px] relative">

				{/* Footer */}
				<section id="footer" className="absolute w-[1440px] h-[221px] top-[4776px] left-0 bg-[#ffc134] shadow-[0px_3px_15.4px_#00000040]">
					<div className="absolute top-14 left-[677px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-black text-[23px] tracking-[0] leading-[normal]">
						Follow Us
					</div>

					<img
						className="absolute w-[50px] h-[50px] top-[114px] left-[659px] transition-all duration-[0.2s] ease-[ease] object-cover"
						alt="Facebook logo"
						src={facebookLogo}
					/>

					<img
						className="absolute w-[50px] h-[50px] top-[114px] left-[740px] transition-all duration-[0.2s] ease-[ease] object-cover"
						alt="Instagram"
						src={instagram}
					/>
				</section>
				{/* Navbar */}
				<section id="nav-bar" className="fixed top-0 left-0 w-full h-[80px] z-50 bg-[#ffc134] border border-solid border-black shadow-[13px_-16px_25.2px_30px_#00000040]">
					<img
						className="absolute w-[65px] h-[62px] top-[7px] left-[30px]"
						alt="Logo"
						src={logo}
					/>

					{/* Home Button */}
					<button onClick={handleHomeClick} className="all-[unset] box-border absolute w-[102px] h-[47px] top-[17px] left-[574px]">
            <div className="relative w-[100px] h-[47px] rounded-[100px]">
              <div className="absolute w-[100px] h-[47px] top-0 left-0 bg-[#fffafa] rounded-[100px] border border-solid border-black transition-all duration-[0.2s] ease-[ease]" />
              <div className="absolute w-[47px] top-[13px] left-[27px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                Home
              </div>
            </div>
          </button>

          {/* Courses Button */}
          <button onClick={handleCoursesClick} className="all-[unset] box-border absolute w-[103px] h-[47px] top-[17px] left-[723px]">
            <div className="relative w-[101px] h-[47px] rounded-[100px]">
              <div className="absolute w-[101px] h-[47px] top-0 left-0 bg-[#fffafa] rounded-[100px] border border-solid border-black transition-all duration-[0.2s] ease-[ease]" />
              <div className="absolute w-[62px] top-[13px] left-5 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                Courses
              </div>
            </div>
          </button>

					{/*<img
						className="absolute w-[70px] h-[70px] top-[4px]  right-[80px]"
						alt="Test account"
						src={testAccount}
					/>*/}
				</section>

				{/* Question One */}
				<section id="question_one" className="absolute w-[562px] h-[469px] top-[120px] left-[299px]">
					<div className="absolute w-[562px] h-[469px] top-[0px] left-[25px]">
						<div className="relative w-[762px] h-[569px] bg-white rounded-[32px] border border-solid border-black shadow-[10px_1px_14.5px_2px_#00000040]">
							<div className="absolute top-12 left-[20px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
								Question 1
							</div>

							<div className="absolute w-[583.53px] h-[62.98px] top-[120px] left-[30px]">
								<div className="top-0 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ1 === 'A' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ1('A')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											A
										</div>
									</div>
								</div>

								<div className="top-28 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ1 === 'B' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ1('B')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											B
										</div>
									</div>
								</div>

								<div className="top-56 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ1 === 'C' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ1('C')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											C
										</div>
									</div>
								</div>

								<div className="top-[336px] absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ1 === 'D' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ1('D')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											D
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* Question Two */}
				<section id="question_two" className="absolute w-[562px] h-[469px] top-[750px] left-[299px]">
					<div className="absolute w-[562px] h-[469px] top-[0px] left-[25px]">
						<div className="relative w-[762px] h-[569px] bg-white rounded-[32px] border border-solid border-black shadow-[10px_1px_14.5px_2px_#00000040]">
							<div className="absolute top-12 left-[20px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
								Question 2
							</div>
							<div className="absolute w-[583.53px] h-[62.98px] top-[120px] left-[30px]">
								<div className="top-0 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ2 === 'A' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ2('A')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											A
										</div>
									</div>
								</div>

								<div className="top-28 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ2 === 'B' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ2('B')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											B
										</div>
									</div>
								</div>

								<div className="top-56 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ2 === 'C' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ2('C')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											C
										</div>
									</div>
								</div>

								<div className="top-[336px] absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ2 === 'D' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ2('D')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											D
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Question Three */}
				<section id="question_three" className="absolute w-[562px] h-[469px] top-[1390px] left-[299px]">
					<div className="absolute w-[562px] h-[469px] top-[0px] left-[25px]">
						<div className="relative w-[762px] h-[569px] bg-white rounded-[32px] border border-solid border-black shadow-[10px_1px_14.5px_2px_#00000040]">
							<div className="absolute top-12 left-[20px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
								Question 3
							</div>
							<div className="absolute w-[583.53px] h-[62.98px] top-[120px] left-[30px]">
								<div className="top-0 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ3 === 'A' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ3('A')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											A
										</div>
									</div>
								</div>

								<div className="top-28 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ3 === 'B' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ3('B')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											B
										</div>
									</div>
								</div>

								<div className="top-56 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ3 === 'C' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ3('C')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											C
										</div>
									</div>
								</div>

								<div className="top-[336px] absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ3 === 'D' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ3('D')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											D
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Question Four */}
				<section id="question_four" className="absolute w-[562px] h-[469px] top-[2030px] left-[299px]">
					<div className="absolute w-[562px] h-[469px] top-[0px] left-[25px]">
						<div className="relative w-[762px] h-[569px] bg-white rounded-[32px] border border-solid border-black shadow-[10px_1px_14.5px_2px_#00000040]">
							<div className="absolute top-12 left-[20px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
								Question 4
							</div>
							<div className="absolute w-[583.53px] h-[62.98px] top-[120px] left-[30px]">
								<div className="top-0 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ4 === 'A' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ4('A')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											A
										</div>
									</div>
								</div>

								<div className="top-28 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ4 === 'B' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ4('B')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											B
										</div>
									</div>
								</div>

								<div className="top-56 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ4 === 'C' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ4('C')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											C
										</div>
									</div>
								</div>

								<div className="top-[336px] absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ4 === 'D' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ4('D')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											D
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Question Five */}
				<section id="question_five" className="absolute w-[562px] h-[469px] top-[2690px] left-[299px]">
					<div className="absolute w-[562px] h-[469px] top-[0px] left-[25px]">
						<div className="relative w-[762px] h-[569px] bg-white rounded-[32px] border border-solid border-black shadow-[10px_1px_14.5px_2px_#00000040]">
							<div className="absolute top-12 left-[20px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
								Question 5
							</div>
							<div className="absolute w-[583.53px] h-[62.98px] top-[120px] left-[30px]">
								<div className="top-0 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ5 === 'A' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ5('A')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											A
										</div>
									</div>
								</div>

								<div className="top-28 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ5 === 'B' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ5('B')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											B
										</div>
									</div>
								</div>

								<div className="top-56 absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ5 === 'C' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ5('C')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											C
										</div>
									</div>
								</div>

								<div className="top-[336px] absolute w-[610px] h-[89px] left-0">
									<div
										className={`relative w-[680px] h-[89px] rounded-[10px] border-2 border-solid border-[#4d4c4c] transition duration-200 ${selectedOptionQ5 === 'D' ? 'bg-[#1877F2]' : 'bg-white'}`}
										onClick={() => handleOptionClickQ5('D')}
									>
										<div className="absolute w-[66px] h-[66px] top-[9px] left-2 bg-[#e1f0ec] rounded-[10px] border border-solid border-black" />
										<div className="absolute w-[25px] top-[22px] left-8 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal]">
											D
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Submit Button */}
				<section className="absolute w-[920px] h-[89px] top-[3400px] left-[250px]">
					<button
						className="relative w-[918px] h-[89px] bg-[#ffc134] rounded-[50px] transition-transform duration-300 hover:scale-105"
					>
						<div className="absolute w-[172px] top-[27px] left-[382px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-black text-[23px] tracking-[0] leading-[normal]">
							Submit Button
						</div>
					</button>
				</section>
			</div>
		</div>
	);
};
