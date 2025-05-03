import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, X, Shuffle, Settings, Volume2, VolumeX, Copy, RotateCcw } from 'lucide-react';

const RandomAlphabet = () => {
  const [currentLetter, setCurrentLetter] = useState('A');
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({
    includeUpperCase: true,
    includeLowerCase: false,
    excludeLetters: '',
    sound: true,
    animationSpeed: 50,
  });
  const [showSettings, setShowSettings] = useState(false);
  const audioContextRef = useRef(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    // Create audio context
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    // Cleanup function
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playLetterSound = async () => {
    if (!settings.sound || !audioContextRef.current) return;

    try {
      // Resume audio context if it's suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440 + Math.random() * 220, audioContextRef.current.currentTime);

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);

      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const getValidLetters = () => {
    let letters = settings.includeUpperCase ? alphabet : '';
    if (settings.includeLowerCase) {
      letters += alphabet.toLowerCase();
    }
    return letters.split('').filter(letter => !settings.excludeLetters.toUpperCase().includes(letter.toUpperCase()));
  };

  const generateRandomLetter = () => {
    const validLetters = getValidLetters();
    if (validLetters.length === 0) return;

    setIsAnimating(true);
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomLetter = validLetters[Math.floor(Math.random() * validLetters.length)];
      setCurrentLetter(randomLetter);
      playLetterSound();
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        setIsAnimating(false);
        // Add to history
        setHistory(prev => [{
          letter: randomLetter,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 9)]);
      }
    }, settings.animationSpeed);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Random Letter</h1>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Main Display */}
          <div className="relative aspect-square mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
            <div className={`text-[120px] font-bold text-white transition-all transform ${
              isAnimating ? 'scale-110' : 'scale-100'
            }`}>
              {currentLetter}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <button
              onClick={generateRandomLetter}
              disabled={isAnimating}
              className="w-full py-4 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Shuffle size={20} />
              GENERATE LETTER
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setSettings(prev => ({ ...prev, sound: !prev.sound }))}
                className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                {settings.sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button
                onClick={() => copyToClipboard(currentLetter)}
                className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Copy size={20} />
              </button>
              <button
                onClick={() => setCurrentLetter('A')}
                className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-gray-600 mb-2">History</h2>
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {item.letter}
                      </div>
                      <span className="text-sm text-gray-500">{item.timestamp}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.letter)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Include Uppercase</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, includeUpperCase: !prev.includeUpperCase }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.includeUpperCase ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        settings.includeUpperCase ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Include Lowercase</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, includeLowerCase: !prev.includeLowerCase }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.includeLowerCase ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        settings.includeLowerCase ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exclude Letters
                    </label>
                    <input
                      type="text"
                      value={settings.excludeLetters}
                      onChange={(e) => setSettings(prev => ({ ...prev, excludeLetters: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. XYZ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Animation Speed (ms)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={settings.animationSpeed}
                      onChange={(e) => setSettings(prev => ({ ...prev, animationSpeed: Number(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Fast</span>
                      <span>{settings.animationSpeed}ms</span>
                      <span>Slow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RandomAlphabet;