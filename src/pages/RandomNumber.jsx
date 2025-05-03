import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, X, Shuffle, Settings, Volume2, VolumeX, Copy, RotateCcw, Plus, Minus } from 'lucide-react';

const RandomNumber = () => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({
    minNumber: 1,
    maxNumber: 100,
    sound: true,
    animationSpeed: 50,
    excludeNumbers: '',
    onlyEven: false,
    onlyOdd: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const audioContextRef = useRef(null);

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

  const playNumberSound = async () => {
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
      oscillator.frequency.setValueAtTime(220 + Math.random() * 440, audioContextRef.current.currentTime);

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);

      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const getValidNumbers = () => {
    const excludeArray = settings.excludeNumbers
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    let numbers = Array.from(
      { length: settings.maxNumber - settings.minNumber + 1 },
      (_, i) => i + settings.minNumber
    );

    // Apply filters
    numbers = numbers.filter(num => !excludeArray.includes(num));
    if (settings.onlyEven) numbers = numbers.filter(num => num % 2 === 0);
    if (settings.onlyOdd) numbers = numbers.filter(num => num % 2 !== 0);

    return numbers;
  };

  const generateRandomNumber = () => {
    const validNumbers = getValidNumbers();
    if (validNumbers.length === 0) return;

    setIsAnimating(true);
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomNumber = validNumbers[Math.floor(Math.random() * validNumbers.length)];
      setCurrentNumber(randomNumber);
      playNumberSound();
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        setIsAnimating(false);
        // Add to history
        setHistory(prev => [{
          number: randomNumber,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 9)]);
      }
    }, settings.animationSpeed);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text.toString());
  };

  const adjustRange = (field, increment) => {
    const value = settings[field];
    const newValue = increment ? value + 1 : value - 1;
    
    // Ensure values don't go below 0
    if (newValue < 0) return;
    
    if (field === 'minNumber' && newValue < settings.maxNumber) {
      setSettings(prev => ({ ...prev, minNumber: newValue }));
    } else if (field === 'maxNumber' && newValue > settings.minNumber) {
      setSettings(prev => ({ ...prev, maxNumber: newValue }));
    }
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
            <h1 className="text-xl font-semibold text-gray-800">Random Number</h1>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Range Display */}
          <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-500">
            <span>{settings.minNumber || 0}</span>
            <div className="h-[2px] w-12 bg-gray-200"></div>
            <span>{settings.maxNumber || 0}</span>
          </div>

          {/* Main Display */}
          <div className="relative aspect-square mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center overflow-hidden">
            <div className={`text-[64px] sm:text-[80px] font-bold text-white transition-all transform ${
              isAnimating ? 'scale-110' : 'scale-100'
            }`}>
              {currentNumber}
            </div>
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-50"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          </div>

          {/* Quick Range Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[10, 50, 100].map(num => (
              <button
                key={num}
                onClick={() => setSettings(prev => ({ ...prev, maxNumber: num }))}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  settings.maxNumber === num
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                1-{num}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <button
              onClick={generateRandomNumber}
              disabled={isAnimating}
              className="w-full py-4 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Shuffle size={20} />
              GENERATE NUMBER
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setSettings(prev => ({ ...prev, sound: !prev.sound }))}
                className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                {settings.sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button
                onClick={() => copyToClipboard(currentNumber)}
                className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Copy size={20} />
              </button>
              <button
                onClick={() => setCurrentNumber(0)}
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
                      <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium">
                        {item.number}
                      </div>
                      <span className="text-sm text-gray-500">{item.timestamp}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.number)}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Range
                    </label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Min</label>
                        <div className="flex">
                          <button
                            onClick={() => adjustRange('minNumber', false)}
                            className="px-2 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="number"
                            value={settings.minNumber || ''}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              if (inputValue === '') {
                                setSettings(prev => ({ ...prev, minNumber: '' }));
                                return;
                              }
                              const value = parseInt(inputValue);
                              if (!isNaN(value)) {
                                setSettings(prev => ({ ...prev, minNumber: value }));
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && settings.maxNumber !== '' && value >= settings.maxNumber) {
                                setSettings(prev => ({ ...prev, minNumber: settings.maxNumber - 1 }));
                              }
                            }}
                            className="w-20 px-2 py-1 border-y border-gray-300 text-center focus:outline-none"
                            min="0"
                          />
                          <button
                            onClick={() => adjustRange('minNumber', true)}
                            className="px-2 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Max</label>
                        <div className="flex">
                          <button
                            onClick={() => adjustRange('maxNumber', false)}
                            className="px-2 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="number"
                            value={settings.maxNumber || ''}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              if (inputValue === '') {
                                setSettings(prev => ({ ...prev, maxNumber: '' }));
                                return;
                              }
                              const value = parseInt(inputValue);
                              if (!isNaN(value)) {
                                setSettings(prev => ({ ...prev, maxNumber: value }));
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && settings.minNumber !== '' && value <= settings.minNumber) {
                                setSettings(prev => ({ ...prev, maxNumber: settings.minNumber + 1 }));
                              }
                            }}
                            className="w-20 px-2 py-1 border-y border-gray-300 text-center focus:outline-none"
                            min={settings.minNumber || 0}
                          />
                          <button
                            onClick={() => adjustRange('maxNumber', true)}
                            className="px-2 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exclude Numbers (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={settings.excludeNumbers}
                      onChange={(e) => setSettings(prev => ({ ...prev, excludeNumbers: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. 13, 666, 777"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Only Even Numbers</span>
                    <button
                      onClick={() => {
                        if (!settings.onlyOdd) {
                          setSettings(prev => ({ ...prev, onlyEven: !prev.onlyEven }));
                        }
                      }}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.onlyEven ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        settings.onlyEven ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Only Odd Numbers</span>
                    <button
                      onClick={() => {
                        if (!settings.onlyEven) {
                          setSettings(prev => ({ ...prev, onlyOdd: !prev.onlyOdd }));
                        }
                      }}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.onlyOdd ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        settings.onlyOdd ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
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
          {/* End of Settings Modal */}
        </div>
      </div>
    </div>
  );
};

export default RandomNumber;