"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import anime from 'animejs';

const AnimalWebsite = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // Animate main title with wave effect
    const letters = titleRef.current.textContent.split('');
    titleRef.current.textContent = '';
    letters.forEach((letter, i) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.display = 'inline-block';
      span.className = `letter-${i}`;
      titleRef.current.appendChild(span);
    });

    anime.timeline()
      .add({
        targets: '.title-animation .letter-*',
        translateY: [-100, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .6)'
      })
      .add({
        targets: searchInputRef.current,
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo'
      }, '-=800');

    // Animate cards with staggered entrance
    anime({
      targets: '.animal-card',
      scale: [0.8, 1],
      opacity: [0, 1],
      translateY: [50, 0],
      delay: anime.stagger(200),
      easing: 'spring(1, 80, 10, 0)',
      duration: 1500
    });
  }, []);

  // Animate cards when search filters them
  useEffect(() => {
    anime({
      targets: '.animal-card',
      scale: [0.9, 1],
      opacity: [0.5, 1],
      duration: 600,
      delay: anime.stagger(150),
      easing: 'easeOutExpo'
    });
  }, [searchTerm]);

  const animateHeartClick = (index) => {
    anime.timeline()
      .add({
        targets: `.heart-icon-${index}`,
        scale: [1, 1.5, 1],
        rotate: ['0deg', '40deg', '0deg'],
        duration: 800,
        easing: 'easeInOutBack'
      })
      .add({
        targets: `.heart-icon-${index}`,
        translateY: [-10, 0],
        duration: 400,
        easing: 'easeOutBounce'
      }, '-=400');
  };

  const animateModalOpen = () => {
    anime.timeline()
      .add({
        targets: '.modal-backdrop',
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
      })
      .add({
        targets: '.modal-content',
        scale: [0.8, 1],
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 600,
        easing: 'spring(1, 90, 12, 0)'
      }, '-=100');
  };

  const animateModalClose = () => {
    anime.timeline()
      .add({
        targets: '.modal-content',
        scale: [1, 0.8],
        opacity: [1, 0],
        translateY: [0, 20],
        duration: 300,
        easing: 'easeInQuad'
      })
      .add({
        targets: '.modal-backdrop',
        opacity: [1, 0],
        duration: 300,
        easing: 'easeOutQuad',
        complete: () => setSelectedAnimal(null)
      }, '-=200');
  };

  const animals = [
    {
      id: 1,
      name: 'Lion',
      type: 'Mammal',
      habitat: 'Savanna',
      description: 'Known as the king of the jungle, lions are powerful big cats that live in pride groups.',
      funFact: 'Female lions do 90% of the hunting for their pride.'
    },
    {
      id: 2,
      name: 'Penguin',
      type: 'Bird',
      habitat: 'Antarctica',
      description: 'Flightless birds that are highly adapted to life in the water.',
      funFact: 'Emperor penguins can dive up to 1800 feet deep.'
    },
    {
      id: 3,
      name: 'Dolphin',
      type: 'Mammal',
      habitat: 'Ocean',
      description: 'Highly intelligent marine mammals known for their playful behavior.',
      funFact: 'Dolphins sleep with one half of their brain at a time.'
    },
    {
      id: 4,
      name: 'Red Panda',
      type: 'Mammal',
      habitat: 'Himalayan forests',
      description: 'Adorable tree-dwelling mammals that mainly eat bamboo.',
      funFact: 'They can be as small as a house cat.'
    }
  ];

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 ref={titleRef} className="text-4xl font-bold text-purple-600 title-animation">
          Animal Kingdom
        </h1>
        <p className="text-gray-600 title-animation">Discover amazing animals from around the world!</p>
        
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search animals..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAnimals.map((animal, index) => (
          <Card 
            key={animal.id}
            className="animal-card cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => {
              setSelectedAnimal(animal);
              animateModalOpen();
            }}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{animal.name}</span>
                <Heart 
                  className={`h-5 w-5 text-red-400 heart-icon-${index} transition-colors hover:text-red-500`}
                  onClick={(e) => {
                    e.stopPropagation();
                    animateHeartClick(index);
                  }}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-semibold">Type:</span> {animal.type}</p>
                <p><span className="font-semibold">Habitat:</span> {animal.habitat}</p>
                <p className="text-gray-600">{animal.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAnimal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 modal-backdrop">
          <Card className="modal-content max-w-lg w-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{selectedAnimal.name}</span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    animateModalClose();
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <p className="font-semibold">Fun Fact:</p>
                  <p>{selectedAnimal.funFact}</p>
                </div>
              </div>
              <p>{selectedAnimal.description}</p>
              <div className="pt-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                  {selectedAnimal.type}
                </span>
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  {selectedAnimal.habitat}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnimalWebsite;