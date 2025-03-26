import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentUser = authService.getCurrentUser();
  
  // Determine active item based on current path
  const getActiveItem = (path: string) => {
    if (path === '/') return 'home';
    // Remove leading slash and return the path
    return path.substring(1);
  };
  
  const [activeItem, setActiveItem] = useState(getActiveItem(currentPath));

  // Update active item when location changes
  useEffect(() => {
    setActiveItem(getActiveItem(currentPath));
    setIsMobileMenuOpen(false); // Close mobile menu when route changes
  }, [currentPath]);

  const handleTaeButtonClick = () => {
    navigate('/tae-ai');
    setActiveItem('tae-ai');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setActiveItem('profile');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-[#5C4B99] text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out bg-[#5C4B99] text-white w-72 h-full flex flex-col shrink-0`}>
        <div className="p-8">
          <h1 className="text-3xl font-bold">StudyPal</h1>
        </div>
        
        {/* User Profile Section */}
        <div className="px-6 mb-6">
          <div 
            className="flex items-center p-4 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
            onClick={handleProfileClick}
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 text-xl font-bold">
              {currentUser?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <span className="font-semibold block">{currentUser?.name || 'User'}</span>
              <span className="text-sm text-gray-300">{currentUser?.email || ''}</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {/* Home Link */}
            <li className="relative">
              <Link 
                to="/" 
                className={`flex items-center p-4 ${activeItem === 'home' ? 'text-white' : 'text-gray-300 hover:bg-white/5'} rounded-lg mx-4`}
                onClick={() => setActiveItem('home')}
              >
                <div className="mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
                  </svg>
                </div>
                <span>Home</span>
              </Link>
              {activeItem === 'home' && (
                <>
                  <div className="absolute inset-0 bg-white/10 rounded-lg mx-4 z-0"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                </>
              )}
            </li>
            
            {/* Progress Link */}
            <li className="relative">
              <Link 
                to="/progress" 
                className={`flex items-center p-4 ${activeItem === 'progress' ? 'text-white' : 'text-gray-300 hover:bg-white/5'} rounded-lg mx-4`}
                onClick={() => setActiveItem('progress')}
              >
                <div className="mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <span>Progress</span>
              </Link>
              {activeItem === 'progress' && (
                <>
                  <div className="absolute inset-0 bg-white/10 rounded-lg mx-4 z-0"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                </>
              )}
            </li>
            
            {/* Schedule Link */}
            <li className="relative">
              <Link 
                to="/schedule" 
                className={`flex items-center p-4 ${activeItem === 'schedule' ? 'text-white' : 'text-gray-300 hover:bg-white/5'} rounded-lg mx-4 relative z-10`}
                onClick={() => setActiveItem('schedule')}
              >
                <div className="mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span>Schedule</span>
              </Link>
              {activeItem === 'schedule' && (
                <>
                  <div className="absolute inset-0 bg-white/10 rounded-lg mx-4 z-0"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                </>
              )}
            </li>
            
            {/* Tae AI Link */}
            <li className="relative">
              <Link 
                to="/tae-ai" 
                className={`flex items-center p-4 ${activeItem === 'tae-ai' ? 'text-white' : 'text-gray-300 hover:bg-white/5'} rounded-lg mx-4 relative z-10`}
                onClick={() => setActiveItem('tae-ai')}
              >
                <div className="mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span>AI Recommendations</span>
              </Link>
              {activeItem === 'tae-ai' && (
                <>
                  <div className="absolute inset-0 bg-white/10 rounded-lg mx-4 z-0"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                </>
              )}
            </li>
            
            {/* Messages Link */}
            <li className="relative">
              <Link 
                to="/messages" 
                className={`flex items-center p-4 ${activeItem === 'messages' ? 'text-white' : 'text-gray-300 hover:bg-white/5'} rounded-lg mx-4 relative z-10`}
                onClick={() => setActiveItem('messages')}
              >
                <div className="mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
                <span>Messages</span>
              </Link>
              {activeItem === 'messages' && (
                <>
                  <div className="absolute inset-0 bg-white/10 rounded-lg mx-4 z-0"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                </>
              )}
            </li>
            
            {/* Study Sessions Link */}
            <li className="relative">
              <Link 
                to="/sessions" 
                className={`flex items-center p-4 ${activeItem === 'sessions' ? 'text-white' : 'text-gray-300 hover:bg-white/5'} rounded-lg mx-4`}
                onClick={() => setActiveItem('sessions')}
              >
                <div className="mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <span>Study Sessions</span>
              </Link>
              {activeItem === 'sessions' && (
                <>
                  <div className="absolute inset-0 bg-white/10 rounded-lg mx-4 z-0"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                </>
              )}
            </li>
            
            {/* Tasks Link */}
            <li className="relative">
              <Link 
                to="/tasks" 
                className={`flex items-center p-4 ${activeItem === 'tasks' ? 'text-white' : 'text-gray-300 hover:bg-white/5'} rounded-lg mx-4`}
                onClick={() => setActiveItem('tasks')}
              >
                <div className="mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                </div>
                <span>Tasks</span>
              </Link>
              {activeItem === 'tasks' && (
                <>
                  <div className="absolute inset-0 bg-white/10 rounded-lg mx-4 z-0"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                </>
              )}
            </li>
            
            {/* Notes Link */}
            <li className="relative">
              <Link 
                to="/notes" 
                className={`flex items-center p-4 ${activeItem === 'notes' ? 'text-white' : 'text-gray-300 hover:bg-white/5'} rounded-lg mx-4`}
                onClick={() => setActiveItem('notes')}
              >
                <div className="mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <span>Notes</span>
              </Link>
              {activeItem === 'notes' && (
                <>
                  <div className="absolute inset-0 bg-white/10 rounded-lg mx-4 z-0"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                </>
              )}
            </li>
            
            {/* Flashcards Link */}
            <li className="relative">
              <Link 
                to="/flashcards" 
                className={`flex items-center p-4 ${activeItem === 'flashcards' ? 'text-white' : 'text-gray-300 hover:bg-white/5'} rounded-lg mx-4`}
                onClick={() => setActiveItem('flashcards')}
              >
                <div className="mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span>Flashcards</span>
              </Link>
              {activeItem === 'flashcards' && (
                <>
                  <div className="absolute inset-0 bg-white/10 rounded-lg mx-4 z-0"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                </>
              )}
            </li>
            
            {/* Settings Link */}
            <li className="relative">
              <Link 
                to="/settings" 
                className={`flex items-center p-4 ${activeItem === 'settings' ? 'text-white' : 'text-gray-300 hover:bg-white/5'} rounded-lg mx-4 relative z-10`}
                onClick={() => setActiveItem('settings')}
              >
                <div className="mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <span>Settings</span>
              </Link>
              {activeItem === 'settings' && (
                <>
                  <div className="absolute inset-0 bg-white/10 rounded-lg mx-4 z-0"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                </>
              )}
            </li>
          </ul>
        </nav>
        
        <div className="p-6 mt-auto space-y-4">
          <div className="bg-[#4B3C7D] rounded-lg p-4">
            <h3 className="font-bold">Talk with Tae</h3>
            <p className="text-sm text-gray-300 mb-3">Your Personalized AI Bot</p>
            <button 
              onClick={handleTaeButtonClick}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm w-full"
            >
              Start
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar; 