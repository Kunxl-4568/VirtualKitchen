import { useState, useEffect } from 'react';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState({
    mission: false,
    story: false,
    team: false,
    stats: false
  });

  const [stats, setStats] = useState({
    recipes: 0,
    users: 0,
    reviews: 0,
    cuisines: 0
  });

  // Simulated final stats values
  const finalStats = {
    recipes: 1000,
    users: 5000,
    reviews: 3000,
    cuisines: 50
  };

  useEffect(() => {
    // Intersection Observer for fade-in effects
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    ['mission', 'story', 'team', 'stats'].forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  // Animate stats counting up
  useEffect(() => {
    if (isVisible.stats) {
      const duration = 2000; // 2 seconds
      const steps = 50;
      const interval = duration / steps;

      const counters = Object.keys(finalStats).map(key => {
        let current = 0;
        const target = finalStats[key];
        const step = target / steps;

        return setInterval(() => {
          current += step;
          if (current > target) {
            current = target;
            clearInterval(counters[key]);
          }
          setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, interval);
      });

      return () => counters.forEach(counter => clearInterval(counter));
    }
  }, [isVisible.stats]);

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Head Chef",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      description: "10+ years of culinary excellence"
    },
    {
      name: "Sarah Chen",
      role: "Food Curator",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      description: "Food anthropologist and cuisine expert"
    },
    {
      name: "Michael Rodriguez",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      description: "Building bridges through food"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-r from-orange-400 to-orange-600">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Bringing People Together Through Food
            </h1>
            <p className="text-xl text-orange-50">
              Virtual Kitchen is more than just recipes - it's about creating connections, 
              sharing traditions, and celebrating diversity through culinary experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div 
        id="mission"
        className={`py-20 px-4 transition-all duration-1000 transform ${
          isVisible.mission ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe that cooking is a universal language that brings people together. 
            Our mission is to make cooking accessible, enjoyable, and inspiring for everyone, 
            from beginners to experienced chefs. By sharing recipes, stories, and techniques, 
            we're building a global community united by the love of food.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div 
        id="stats"
        className={`bg-orange-50 py-20 px-4 transition-all duration-1000 ${
          isVisible.stats ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {value.toLocaleString()}+
                </div>
                <div className="text-gray-600 capitalize">
                  {key.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div 
        id="story"
        className={`py-20 px-4 transition-all duration-1000 transform ${
          isVisible.story ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-gray-600 leading-relaxed mb-6">
              Virtual Kitchen started as a simple idea: create a space where people could share 
              their favorite recipes and cooking experiences. What began as a small community 
              has grown into a global platform where food enthusiasts from all walks of life 
              come together to explore, create, and share their culinary adventures.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we're proud to host thousands of recipes from countless cultures, 
              helping people discover new flavors and techniques while preserving traditional 
              cooking methods for future generations.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div 
        id="team"
        className={`bg-gray-100 py-20 px-4 transition-all duration-1000 transform ${
          isVisible.team ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
              >
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-orange-600 font-medium mb-3">{member.role}</div>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;