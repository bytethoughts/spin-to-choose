import React, { useState, useRef } from 'react';
import { ChevronLeft, Settings, Share2, Download, RotateCcw } from 'lucide-react';

const NFLTeamPicker = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const wheelRef = useRef(null);

  const nflTeams = [
    { id: 1, text: 'New York Jets', color: '#125740' },
    { id: 2, text: 'Pittsburgh Steelers', color: '#101820' },
    { id: 3, text: 'Tennessee Titans', color: '#0C2340' },
    { id: 4, text: 'Arizona Cardinals', color: '#97233F' },
    { id: 5, text: 'Atlanta Falcons', color: '#A71930' },
    { id: 6, text: 'Carolina Panthers', color: '#0085CA' },
    { id: 7, text: 'Chicago Bears', color: '#0B162A' },
    { id: 8, text: 'Dallas Cowboys', color: '#003594' },
    { id: 9, text: 'Detroit Lions', color: '#0076B6' },
    { id: 10, text: 'Green Bay Packers', color: '#203731' },
    { id: 11, text: 'Los Angeles Rams', color: '#003594' },
    { id: 12, text: 'Minnesota Vikings', color: '#4F2683' },
    { id: 13, text: 'New Orleans Saints', color: '#101820' },
    { id: 14, text: 'New York Giants', color: '#0B2265' },
    { id: 15, text: 'Philadelphia Eagles', color: '#004C54' },
    { id: 16, text: 'San Francisco 49ers', color: '#AA0000' },
    { id: 17, text: 'Seattle Seahawks', color: '#002244' },
    { id: 18, text: 'Tampa Bay Buccaneers', color: '#FF7900' },
    { id: 19, text: 'Washington Commanders', color: '#5A1414' },
    { id: 20, text: 'Baltimore Ravens', color: '#241773' },
    { id: 21, text: 'Buffalo Bills', color: '#00338D' },
    { id: 22, text: 'Cincinnati Bengals', color: '#FB4F14' },
    { id: 23, text: 'Cleveland Browns', color: '#311D00' },
    { id: 24, text: 'Denver Broncos', color: '#FB4F14' },
    { id: 25, text: 'Houston Texans', color: '#03202F' },
    { id: 26, text: 'Indianapolis Colts', color: '#002C5F' },
    { id: 27, text: 'Jacksonville Jaguars', color: '#101820' },
    { id: 28, text: 'Kansas City Chiefs', color: '#E31837' },
    { id: 29, text: 'Las Vegas Raiders', color: '#000000' },
    { id: 30, text: 'Los Angeles Chargers', color: '#0080C6' },
    { id: 31, text: 'Miami Dolphins', color: '#008E97' },
    { id: 32, text: 'New England Patriots', color: '#002244' },
  ];

  const createWheelPath = (startAngle, endAngle) => {
    const radius = 50;
    const center = { x: 50, y: 50 };

    const start = {
      x: center.x + radius * Math.cos(startAngle),
      y: center.y + radius * Math.sin(startAngle),
    };

    const end = {
      x: center.x + radius * Math.cos(endAngle),
      y: center.y + radius * Math.sin(endAngle),
    };

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    return `
      M ${center.x} ${center.y}
      L ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
      Z
    `;
  };

  const spinWheel = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setWinner(null);
      const extraSpins = 5;
      const randomDegrees = Math.floor(Math.random() * 360);
      const totalRotation = rotation + 360 * extraSpins + randomDegrees;
      setRotation(totalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        const winningIndex =
          nflTeams.length - 1 - Math.floor((totalRotation % 360) / (360 / nflTeams.length));
        const winningItem = nflTeams[winningIndex % nflTeams.length];
        setWinner(winningItem);
        setShowWinnerModal(true);
      }, 5000);
    }
  };

  const resetWheel = () => {
    setRotation(0);
    setWinner(null);
    setIsSpinning(false);
  };

  const shareResults = () => {
    if (winner && navigator.share) {
      navigator.share({
        title: 'NFL Team Picker Result',
        text: `The selected team is: ${winner.text}!`,
      });
    }
  };

  const downloadResults = () => {
    if (winner) {
      const element = document.createElement('a');
      const file = new Blob([`Selected Team: ${winner.text}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'nfl-team-picker-result.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-[#264653]">
          NFL Team Picker
        </h1>

        <div className="flex flex-col gap-6">
          {/* Wheel Section */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[500px] sm:max-w-[600px] aspect-square">
              {/* Wheel (rotating part) */}
              <div
                ref={wheelRef}
                className="relative w-full h-full transform-gpu transition-transform duration-[5000ms] ease-[cubic-bezier(0.2,0,0.3,1)]"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Wheel segments */}
                  {nflTeams.map((team, index) => {
                    const angleSize = (2 * Math.PI) / nflTeams.length;
                    const startAngle = index * angleSize - Math.PI / 2;
                    const endAngle = (index + 1) * angleSize - Math.PI / 2;
                    
                    // Calculate the middle angle for text placement
                    const midAngle = (startAngle + endAngle) / 2;
                    
                    // Calculate text position (closer to the outer edge for better readability)
                    const textRadius = 35;
                    const textX = 50 + textRadius * Math.cos(midAngle);
                    const textY = 50 + textRadius * Math.sin(midAngle);
                    
                    // Calculate rotation angle for radial text orientation
                    const textRotationAngle = (midAngle * 180 / Math.PI);

                    return (
                      <g key={team.id}>
                        <path
                          d={createWheelPath(startAngle, endAngle)}
                          fill={team.color}
                          className="transition-all duration-300"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill="#FFFFFF"
                          fontSize="2"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textRotationAngle}, ${textX}, ${textY})`}
                          className="select-none pointer-events-none uppercase"
                        >
                          {team.text}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Center button */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={spinWheel}
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span className="text-xl font-bold text-gray-800">SPIN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={resetWheel}
                className="p-3 bg-gray-100 text-[#264653] rounded-lg hover:bg-gray-200 transition-all"
              >
                <RotateCcw size={20} />
              </button>
              <button
                onClick={shareResults}
                disabled={!winner}
                className="p-3 bg-gray-100 text-[#264653] rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={downloadResults}
                disabled={!winner}
                className="p-3 bg-gray-100 text-[#264653] rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
          
          {/* FAQ and Content Section */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">What is NFL Team Picker?</h2>
            <p className="mb-4">
              NFL Team Picker is an interactive spinning wheel tool designed to randomly select NFL teams for various purposes. Whether you're deciding which team to root for, choosing teams for a fantasy league, or just having fun with friends, our wheel makes the selection process exciting and fair.
            </p>
            <p className="mb-4">
              The wheel features all 32 NFL teams with their official colors, making it both functional and visually appealing. Simply spin the wheel and let fate decide which team you'll be supporting!
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">How does the NFL Team Picker wheel work?</h3>
                <p>
                  The wheel contains all 32 NFL teams arranged in a circle. When you click the "SPIN" button in the center, the wheel rotates multiple times before gradually slowing down to land on a randomly selected team. The selection is completely random and fair, ensuring no team has an advantage.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Is the NFL Team Picker free to use?</h3>
                <p>
                  Yes! NFL Team Picker is completely free to use. There are no hidden fees, subscriptions, or in-app purchases required to enjoy the full functionality of the wheel.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I share my results with friends?</h3>
                <p>
                  Absolutely! After spinning the wheel, you can share your results directly with friends through various platforms using the share button. This makes it easy to let others know which team was randomly selected for you.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">How can I use the NFL Team Picker for fantasy football?</h3>
                <p>
                  The NFL Team Picker is perfect for fantasy football! Use it to randomly assign teams to players in your fantasy league, or to decide which team's players to focus on when building your fantasy roster. It adds an element of fun and fairness to your fantasy football experience.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Does the wheel include all current NFL teams?</h3>
                <p>
                  Yes, our wheel is regularly updated to include all 32 current NFL teams with their official colors and logos. We stay current with any team relocations, rebranding, or other changes in the NFL.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I use the NFL Team Picker on mobile devices?</h3>
                <p>
                  Yes! NFL Team Picker is fully responsive and works on all devices including smartphones, tablets, laptops, and desktop computers. The wheel is optimized for touch screens, making it easy to spin on mobile devices.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Is there a limit to how many times I can spin the wheel?</h3>
                <p>
                  No, there are no limits! You can spin the wheel as many times as you want. Each spin is independent and completely random, so you can keep spinning until you're satisfied with your selection.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Fun Ways to Use NFL Team Picker</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Decide which team to root for during the NFL season</li>
              <li>Assign teams for fantasy football leagues</li>
              <li>Choose teams for friendly competitions or bets</li>
              <li>Add excitement to NFL watch parties</li>
              <li>Help undecided fans pick a team to support</li>
              <li>Create random matchups for NFL discussions</li>
              <li>Add an element of surprise to NFL-themed games</li>
              <li>Make team selection fair and unbiased</li>
            </ul>
          </div>

          {/* New Content Sections */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">NFL Team Picker for Fantasy Football</h2>
            <p className="mb-4">
              Fantasy football enthusiasts love using our NFL Team Picker to add excitement to their leagues. Here are some creative ways to incorporate the wheel into your fantasy football experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Draft Order:</strong> Use the wheel to determine the draft order for your fantasy league, making the process fair and exciting.</li>
              <li><strong>Team Assignments:</strong> Randomly assign NFL teams to fantasy players to create themed teams based on real NFL rosters.</li>
              <li><strong>Weekly Matchups:</strong> When deciding which players to start, use the wheel to randomly select a team's players to focus on for your lineup.</li>
              <li><strong>Trade Evaluations:</strong> Use the wheel to randomly select teams when evaluating potential trades between fantasy owners.</li>
              <li><strong>League Events:</strong> Add the wheel to your fantasy football draft party or watch parties for interactive fun.</li>
            </ul>
            <p>
              The randomness of the NFL Team Picker adds an element of surprise and fairness to your fantasy football experience, making it more enjoyable for everyone involved.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">NFL Team Picker for Watch Parties</h2>
            <p className="mb-4">
              NFL watch parties are more exciting when everyone has a team to root for. Our NFL Team Picker makes it easy to assign teams to guests who don't have a favorite team or want to switch things up:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Team Assignments:</strong> Have each guest spin the wheel to get assigned a random NFL team for the day.</li>
              <li><strong>Friendly Competitions:</strong> Create small competitions where guests root for their randomly assigned teams.</li>
              <li><strong>Prize Drawings:</strong> Use the wheel to randomly select winners for NFL-themed prizes or contests.</li>
              <li><strong>Game Predictions:</strong> Spin the wheel to make predictions about which teams will win upcoming games.</li>
              <li><strong>Theme Nights:</strong> Dedicate watch parties to specific teams by using the wheel to select the theme team.</li>
            </ul>
            <p>
              Adding the NFL Team Picker to your watch parties creates a more interactive and engaging experience for all your football-loving friends.
            </p>
          </div>

         

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">NFL Team Picker for Education</h2>
            <p className="mb-4">
              Teachers and parents can use the NFL Team Picker as an educational tool to teach children about NFL teams, geography, and probability:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Geography Lessons:</strong> Teach children about the cities and states where NFL teams are located.</li>
              <li><strong>Color Recognition:</strong> Help young children learn colors by identifying team colors on the wheel.</li>
              <li><strong>Probability Concepts:</strong> Use the wheel to demonstrate basic probability concepts in a fun way.</li>
              <li><strong>Team History:</strong> Assign students NFL teams to research and present information about.</li>
              <li><strong>Math Activities:</strong> Create math problems based on the wheel, such as calculating the probability of landing on specific teams.</li>
            </ul>
            <p>
              The NFL Team Picker makes learning about football and related subjects more engaging and interactive for students of all ages.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">NFL Team Picker Tips and Tricks</h2>
            <p className="mb-4">
              Get the most out of your NFL Team Picker experience with these helpful tips:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Multiple Spins:</strong> If you're not satisfied with your first result, spin again! Each spin is completely independent.</li>
              <li><strong>Share Your Results:</strong> Use the share button to let friends know which team was randomly selected for you.</li>
              <li><strong>Download Your Selection:</strong> Save your result using the download button for future reference.</li>
              <li><strong>Reset the Wheel:</strong> Use the reset button to start fresh if needed.</li>
              <li><strong>Mobile Optimization:</strong> For the best experience on mobile devices, hold your phone in landscape mode.</li>
              <li><strong>Group Activities:</strong> When using the wheel with a group, have each person take turns spinning for a fair experience.</li>
              <li><strong>Create Challenges:</strong> Develop fun challenges based on the teams selected by the wheel.</li>
            </ul>
            <p>
              The NFL Team Picker is designed to be simple and intuitive, but these tips can help you get even more enjoyment from using it.
            </p>
          </div>
        </div>
      </div>

      {/* Winner Modal without Confetti */}
      {showWinnerModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[20px] w-[280px]">
            <div className="p-5">
              <h2 className="text-[22px] text-center text-gray-800 mb-4">Selected Team!</h2>
              <div className="bg-emerald-500 rounded-[14px] p-4 mb-5">
                <p className="text-[22px] font-medium text-white text-center">
                  {winner.text}
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setShowWinnerModal(false)}
                  className="min-w-[80px] px-5 py-2 bg-gray-100 text-[15px] text-gray-600 rounded-[10px] hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={shareResults}
                  className="min-w-[80px] px-5 py-2 bg-emerald-500 text-[15px] text-white rounded-[10px] hover:bg-emerald-600 transition-all"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFLTeamPicker; 