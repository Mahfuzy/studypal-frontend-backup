import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const features = [
    {
      title: 'Interactive Courses',
      description: 'Learn through engaging content',
      icon: '📚',
    },
    {
      title: 'Responsive AI Features',
      description: 'AI-powered learning assistance',
      icon: '🤖',
    },
    {
      title: 'Usage of Flash Cards',
      description: 'Master concepts effectively',
      icon: '🗂️',
    },
    {
      title: 'Personalized Study Timetable',
      description: 'Organize your learning journey',
      icon: '📅',
    },
    {
      title: 'Community Support',
      description: 'Learn together, grow together',
      icon: '👥',
    },
    {
      title: 'Streak System',
      description: 'Stay motivated and consistent',
      icon: '🔥',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">StudyPal</Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
            <Link to="/courses" className="text-gray-600 hover:text-gray-800">Courses</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-800">Contact</Link>
            <Link to="/signup" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Sign Up</Link>
            <Link to="/login" className="text-purple-600 hover:text-purple-700">Log In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to StudyPal
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your gateway to effective and fun learning
            </p>
            <div className="space-x-4">
              <Link
                to="/signup"
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 inline-block"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg border border-purple-600 hover:bg-purple-50 inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="/landing_illustration.png"
              alt="Study Illustration"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Why choose StudyPal?
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Explore our unique features designed to enhance your learning experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 