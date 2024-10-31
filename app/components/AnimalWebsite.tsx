"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, Info, Sparkles, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import anime from 'animejs';

interface Animal {
  id: number;
  name: string;
  type: string;
  habitat: string;
  description: string;
  funFact: string;
  dangerLevel: 'High' | 'Low';
  conservation: string;
}

const AnimalWebsite = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isMounted, setIsMounted] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize animations after component is mounted
  useEffect(() => {
    if (!isMounted) return;

    const initializeTitleAnimation = () => {
      const titleElement = titleRef.current;
      if (!titleElement?.textContent) return;
      
      const text = titleElement.textContent;
      titleElement.innerHTML = '';
      text.split('').forEach((letter, i) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        span.className = `letter-${i}`;
        titleElement.appendChild(span);
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
    };

    const initializeSparkles = () => {
      if (!sparklesRef.current) return;

      const createSparkle = () => {
        const sparkle = document.createElement('div');
        sparkle.className = 'absolute w-1 h-1 bg-yellow-300 rounded-full';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparklesRef.current?.appendChild(sparkle);

        anime({
          targets: sparkle,
          opacity: [0, 1, 0],
          translateY: [-20, -40],
          translateX: [-10, 10],
          scale: [0, 1.2, 0],
          duration: 2000,
          easing: 'easeOutExpo',
          complete: () => sparkle.remove()
        });
      };

      const sparkleInterval = setInterval(createSparkle, 2000);
      return () => clearInterval(sparkleInterval);
    };

    initializeTitleAnimation();
    const cleanup = initializeSparkles();
    
    return cleanup;
  }, [isMounted]);

  // Card animations
  useEffect(() => {
    if (!isMounted) return;

    anime({
      targets: '.animal-card',
      scale: [0.8, 1],
      opacity: [0, 1],
      translateY: [50, 0],
      rotateX: [-20, 0],
      delay: anime.stagger(200),
      easing: 'spring(1, 80, 10, 0)',
      duration: 1500
    });
  }, [activeFilter, sortOrder, isMounted]);

  const animateCardsFilter = () => {
    if (!isMounted) return;

    anime({
      targets: '.animal-card',
      scale: [0.9, 1],
      opacity: [0.5, 1],
      translateY: [20, 0],
      duration: 600,
      delay: anime.stagger(150),
      easing: 'easeOutExpo'
    });
  };

  const animateHeartClick = (index) => {
    if (!isMounted) return;

    anime.timeline()
      .add({
        targets: `.heart-icon-${index}`,
        scale: [1, 1.5, 1],
        rotate: ['0deg', '40deg', '0deg'],
        duration: 800,
        easing: 'easeInOutBack'
      })
      .add({
        targets: `.heart-icon-${index}-particles`,
        scale: [0, 1],
        opacity: [1, 0],
        translateY: [-20, -40],
        translateX: [-20, 20],
        rotate: [-45, 45],
        duration: 1000,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
      }, '-=400');
  };

  const animateModalOpen = () => {
    if (!isMounted) return;

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
        rotateX: [-10, 0],
        duration: 600,
        easing: 'spring(1, 90, 12, 0)'
      }, '-=100')
      .add({
        targets: '.modal-content .info-item',
        translateX: [-20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 500,
        easing: 'easeOutQuad'
      }, '-=200');
  };

  const animateModalClose = () => {
    if (!isMounted) return;

    anime.timeline()
      .add({
        targets: '.modal-content',
        scale: [1, 0.8],
        opacity: [1, 0],
        translateY: [0, 20],
        rotateX: [0, -10],
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

  const animals: Animal[] = [
    {
      id: 1,
      name: 'Lion',
      type: 'Mammal',
      habitat: 'Savanna',
      description: 'Known as the king of the jungle, lions are powerful big cats that live in pride groups.',
      funFact: 'Female lions do 90% of the hunting for their pride.',
      dangerLevel: 'High',
      conservation: 'Vulnerable'
    },
    {
      id: 2,
      name: 'Penguin',
      type: 'Bird',
      habitat: 'Antarctica',
      description: 'Flightless birds that are highly adapted to life in the water.',
      funFact: 'Emperor penguins can dive up to 1800 feet deep.',
      dangerLevel: 'Low',
      conservation: 'Near Threatened'
    },
    {
      id: 3,
      name: 'Dolphin',
      type: 'Mammal',
      habitat: 'Ocean',
      description: 'Highly intelligent marine mammals known for their playful behavior.',
      funFact: 'Dolphins sleep with one half of their brain at a time.',
      dangerLevel: 'Low',
      conservation: 'Varies by species'
    },
    {
      id: 4,
      name: 'Red Panda',
      type: 'Mammal',
      habitat: 'Himalayan forests',
      description: 'Adorable tree-dwelling mammals that mainly eat bamboo.',
      funFact: 'They can be as small as a house cat.',
      dangerLevel: 'Low',
      conservation: 'Endangered'
    }
  ];

  const filteredAndSortedAnimals = animals
    .filter(animal => {
      const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'all' || animal.type.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    animateCardsFilter();
  };

  // Animation functions with proper TypeScript types
  const animateCardsFilter = () => {
    if (!isMounted) return;

    anime({
      targets: '.animal-card',
      scale: [0.9, 1],
      opacity: [0.5, 1],
      translateY: [20, 0],
      duration: 600,
      delay: anime.stagger(150),
      easing: 'easeOutExpo'
    });
  };

  const animateHeartClick = (index: number | string) => {
    if (!isMounted) return;

    anime.timeline()
      .add({
        targets: `.heart-icon-${index}`,
        scale: [1, 1.5, 1],
        rotate: ['0deg', '40deg', '0deg'],
        duration: 800,
        easing: 'easeInOutBack'
      })
      .add({
        targets: `.heart-icon-${index}-particles`,
        scale: [0, 1],
        opacity: [1, 0],
        translateY: [-20, -40],
        translateX: [-20, 20],
        rotate: [-45, 45],
        duration: 1000,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
      }, '-=400');
  };

  const animateModalOpen = () => {
    if (!isMounted) return;

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
        rotateX: [-10, 0],
        duration: 600,
        easing: 'spring(1, 90, 12, 0)'
      }, '-=100')
      .add({
        targets: '.modal-content .info-item',
        translateX: [-20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 500,
        easing: 'easeOutQuad'
      }, '-=200');
  };

  const animateModalClose = () => {
    if (!isMounted) return;

    anime.timeline()
      .add({
        targets: '.modal-content',
        scale: [1, 0.8],
        opacity: [1, 0],
        translateY: [0, 20],
        rotateX: [0, -10],
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

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4 relative">
        <div ref={sparklesRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
        <h1 ref={titleRef} className="text-4xl font-bold text-purple-600 title-animation relative">
          Animal Kingdom
        </h1>
        <p className="text-gray-600 title-animation">Discover amazing animals from around the world!</p>
        
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search animals..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-md bg-white/90 backdrop-blur-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              animateCardsFilter();
            }}
          />
        </div>

        <div className="flex justify-center gap-4 mt-4">
          {['all', 'mammal', 'bird'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                animateCardsFilter();
              }}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeFilter === filter 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={toggleSort}
          className="flex items-center gap-2 mx-auto mt-4 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
        >
          Sort {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAndSortedAnimals.map((animal, index) => (
          <Card 
            key={animal.id}
            className="animal-card cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 bg-white/90 backdrop-blur-sm"
            onClick={() => {
              setSelectedAnimal(animal);
              animateModalOpen();
            }}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  {animal.name}
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </span>
                <div className="relative">
                  <Heart 
                    className={`h-5 w-5 transition-colors duration-300 ${
                      favorites.includes(animal.id) ? 'text-red-500 fill-red-500' : 'text-red-400'
                    } heart-icon-${index}`}
                    onClick={(e) => {
                      toggleFavorite(animal.id, e);
                      animateHeartClick(index);
                    }}
                  />
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`heart-icon-${index}-particles absolute inset-0 opacity-0`}
                    >
                      ♥
                    </div>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-semibold">Type:</span> {animal.type}</p>
                <p><span className="font-semibold">Habitat:</span> {animal.habitat}</p>
                <p className="text-gray-600">{animal.description}</p>
                <div className="flex gap-2 mt-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    animal.dangerLevel === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {animal.dangerLevel} Risk
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">
                    {animal.conservation}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAnimal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 modal-backdrop"
          onClick={() => animateModalClose()}
        >
          <Card 
            className="modal-content max-w-lg w-full bg-white/95 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  {selectedAnimal.name}
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    animateModalClose();
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 info-item transform transition-all duration-300 hover:translate-x-1">
                <Info className="h-5 w-5 text-blue-500 mt-1 animate-pulse" />
                <div>
                  <p className="font-semibold">Fun Fact:</p>
                  <p className="text-gray-600">{selectedAnimal.funFact}</p>
                </div>
              </div>
              
              <div className="info-item bg-purple-50 p-4 rounded-lg transform transition-all duration-300 hover:scale-[1.02]">
                <p className="text-gray-700 leading-relaxed">{selectedAnimal.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 info-item">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Habitat</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm inline-block hover:bg-blue-200 transition-colors">
                    {selectedAnimal.habitat}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Type</p>
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm inline-block hover:bg-purple-200 transition-colors">
                    {selectedAnimal.type}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 info-item bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Risk Level</span>
                  <span className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedAnimal.dangerLevel === 'High' 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}>
                    {selectedAnimal.dangerLevel} Risk Level
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Conservation Status</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm hover:bg-orange-200 transition-colors">
                    {selectedAnimal.conservation}
                  </span>
                </div>
              </div>
              
              {favorites.includes(selectedAnimal.id) && (
                <div className="info-item transform transition-all duration-300">
                  <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
                    <Heart className="h-4 w-4 fill-current animate-bounce" />
                    <span className="text-sm font-medium">In Your Favorites</span>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-100 info-item">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(selectedAnimal.id, e);
                    animateHeartClick('modal');
                  }}
                  className={`w-full py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    favorites.includes(selectedAnimal.id)
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart 
                    className={`h-5 w-5 heart-icon-modal ${
                      favorites.includes(selectedAnimal.id) ? 'fill-current' : ''
                    }`}
                  />
                  {favorites.includes(selectedAnimal.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnimalWebsite;