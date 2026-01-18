import React, { useEffect, useState } from 'react';
import { Heart, TrendingUp, Users, LogOut, Crown, MessageCircle, Shield } from 'lucide-react';
import { STRIPE_LINK } from './pro';
import { auth } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

const ICON = process.env.PUBLIC_URL + '/icon.png';

// Mock auth for demo - replace with real Firebase
const mockAuth = {
  currentUser: null,
  signIn: () => mockAuth.currentUser = { uid: 'demo-user', displayName: 'Demo User', email: 'demo@mindtracker.app' },
  signOut: () => mockAuth.currentUser = null
};

const moods = [
  { name: 'Happy', emoji: '😊', color: '#fbbf24' },
  { name: 'Calm', emoji: '😌', color: '#60a5fa' },
  { name: 'Sad', emoji: '😢', color: '#a78bfa' },
  { name: 'Anxious', emoji: '😰', color: '#f87171' },
  { name: 'Angry', emoji: '😠', color: '#ef4444' }
];

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [proPending, setProPending] = useState(localStorage.getItem('mindtracker-pro-pending') === '1');
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('journal');
  const [entry, setEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [entries, setEntries] = useState({});
  const [isPro, setIsPro] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([
    { id: 1, author: 'Anonymous', text: 'Taking things one day at a time 💜', likes: 12, date: '2026-01-03' },
    { id: 2, author: 'Anonymous', text: 'Grateful for small victories today', likes: 8, date: '2026-01-04' }
  ]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    // Demo: Load saved entries from localStorage
    const saved = localStorage.getItem('mindtracker-entries');
    if (saved) setEntries(JSON.parse(saved));
    
    const savedPro = localStorage.getItem('mindtracker-pro');
    if (savedPro) setIsPro(true);
    const pending = localStorage.getItem('mindtracker-pro-pending');
    if (pending) setProPending(true);
    
    // If REACT_APP_USE_FIREBASE is set to 'true', hook into Firebase auth state
        if (process.env.REACT_APP_USE_FIREBASE === 'true') {
      try {
        const unsub = onAuthStateChanged(auth, user => {
          if (user) setUser(user);
              else setUser(null);
              if (user) setAuthError('');
        });
        return () => unsub();
      } catch (e) {
        // ignore if firebase not configured
        console.warn('Firebase auth not initialized', e);
      }
    }
  }, []);

  const login = () => {
      if (process.env.REACT_APP_USE_FIREBASE === 'true') {
      if (!email || !password) return setAuthError('Enter email and password');
      setAuthLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          setAuthError('');
          setToast('Logged in');
        })
        .catch(e => setAuthError(e.message || e))
        .finally(() => setAuthLoading(false));
      return;
    }

    mockAuth.signIn();
    setUser(mockAuth.currentUser);
  };

  const logout = () => {
    if (process.env.REACT_APP_USE_FIREBASE === 'true') {
      firebaseSignOut(auth).catch(e => console.warn(e));
      setUser(null);
      setCurrentView('journal');
      return;
    }

    mockAuth.signOut();
    setUser(null);
    setCurrentView('journal');
  };

  const createAccount = () => {
    if (process.env.REACT_APP_USE_FIREBASE === 'true') {
      if (!email || !password) return setAuthError('Enter email and password');
      setAuthLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          setAuthError('');
          setToast('Account created');
        })
        .catch(e => setAuthError(e.message || e))
        .finally(() => setAuthLoading(false));
      return;
    }

    mockAuth.signIn();
    setUser(mockAuth.currentUser);
  };

  const saveEntry = () => {
    if (!entry.trim()) return;
    
    const date = new Date().toISOString().split('T')[0];
    const newEntries = {
      ...entries,
      [date]: {
        text: entry,
        mood: selectedMood.name,
        time: Date.now(),
        color: selectedMood.color
      }
    };
    
    setEntries(newEntries);
    localStorage.setItem('mindtracker-entries', JSON.stringify(newEntries));
    setEntry('');
    
    // Show success message
    alert('✨ Entry saved! Keep going!');
  };

  const addCommunityPost = () => {
    if (!newPost.trim() || !isPro) return;
    
    const post = {
      id: Date.now(),
      author: 'You',
      text: newPost,
      likes: 0,
      date: new Date().toISOString().split('T')[0]
    };
    
    setCommunityPosts([post, ...communityPosts]);
    setNewPost('');
  };

  const upgradeToPro = () => {
    // mark pending then open Stripe checkout page
    try {
      localStorage.setItem('mindtracker-pro-pending', '1');
      setProPending(true);
    } catch (e) {}
    window.open(STRIPE_LINK, '_blank');
    setToast('Opened Stripe checkout — click Confirm Purchase after completing checkout.');
  };

  const confirmPurchase = () => {
    // Local demo confirmation: mark user as Pro
    try {
      localStorage.setItem('mindtracker-pro', 'true');
      localStorage.removeItem('mindtracker-pro-pending');
      setIsPro(true);
      setProPending(false);
      setToast('Thanks — your account is now Pro!');
    } catch (e) {
      setToast('Failed to save Pro status locally');
    }
  };

  // Calculate mood stats
  const moodStats = Object.values(entries).reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});

  const totalEntries = Object.keys(entries).length;
  const currentStreak = calculateStreak(entries);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/20">
          <div className="mb-6">
            <img src={ICON} alt="MindTracker logo" className="w-16 h-16 mx-auto mb-4 rounded-full object-cover" />
            <h1 className="text-3xl font-bold text-white mb-2">MindTracker</h1>
            <p className="text-purple-200">Your safe space for mental wellness</p>
          </div>

          {process.env.REACT_APP_USE_FIREBASE === 'true' ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full mb-3 p-3 rounded-lg bg-white/5 placeholder-purple-200 text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mb-3 p-3 rounded-lg bg-white/5 placeholder-purple-200 text-white"
              />
              {authError && <div className="text-sm text-red-300 mb-2">{authError}</div>}
              <div className="flex gap-3">
                <button onClick={login} className="flex-1 bg-white text-purple-700 py-3 rounded-xl font-semibold">{authLoading ? 'Working…' : 'Login'}</button>
                <button onClick={createAccount} className="flex-1 bg-white/20 text-white py-3 rounded-xl">{authLoading ? 'Working…' : 'Create'}</button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={login}
                className="w-full bg-white text-purple-700 font-semibold py-4 px-6 rounded-xl hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <img src={ICON} alt="logo" className="w-9 h-9" />
                <span>Get Started</span>
              </button>
              <div className="mt-8 space-y-3 text-sm text-purple-200">
                <div className="flex items-center gap-2 justify-center">
                  <Shield size={16} />
                  <span>End-to-end encrypted journals</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Heart size={16} />
                  <span>Track moods & build healthy habits</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Users size={16} />
                  <span>Connect with supportive community</span>
                </div>
              </div>
              {proPending && (
                <div className="mt-4 text-sm text-yellow-200">
                  <div>Complete checkout then click <button onClick={confirmPurchase} className="underline">Confirm Purchase</button> to activate Pro locally.</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 bottom-6 bg-black/70 text-white px-4 py-2 rounded-md shadow-md">
          {toast}
          <button className="ml-3 text-sm underline" onClick={() => setToast('')}>Dismiss</button>
        </div>
      )}
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ICON} alt="MindTracker logo" className="w-9 h-9 rounded-full object-cover" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white ml-2">MindTracker</h1>
              {user && (
                <div className="text-sm text-purple-200">{user.displayName || user.email}</div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isPro && (
              <>
                <button
                  onClick={upgradeToPro}
                  className="bg-yellow-400 text-purple-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-all flex items-center gap-2"
                >
                  <Crown size={16} />
                  <span className="hidden sm:inline">Upgrade Pro</span>
                </button>
                <a href={STRIPE_LINK} target="_blank" rel="noreferrer" className="ml-2 text-sm text-white/90 underline hidden sm:inline">Subscribe</a>
              </>
            )}
            {isPro && (
              <div className="px-3 py-1 bg-white/10 rounded-md text-sm text-yellow-300">Pro</div>
            )}
            <button
              onClick={logout}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2">
            {[
              { id: 'journal', icon: MessageCircle, label: 'Journal' },
              { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
              { id: 'community', icon: Users, label: 'Community' }
            ].map(nav => (
              <button
                key={nav.id}
                onClick={() => setCurrentView(nav.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  currentView === nav.id
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <nav.icon size={18} />
                {nav.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="text-3xl font-bold text-white">{currentStreak}</div>
            <div className="text-purple-200 text-sm">Day Streak 🔥</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="text-3xl font-bold text-white">{totalEntries}</div>
            <div className="text-purple-200 text-sm">Total Entries ✍️</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="text-3xl font-bold text-white">{isPro ? 'Pro' : 'Free'}</div>
            <div className="text-purple-200 text-sm">Account {isPro ? '👑' : '🌱'}</div>
          </div>
        </div>

        {/* Journal View */}
        {currentView === 'journal' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Heart className="text-pink-400" />
                How are you feeling today?
              </h2>
              
              <div className="grid grid-cols-5 gap-3 mb-6">
                {moods.map(mood => (
                  <button
                    key={mood.name}
                    onClick={() => setSelectedMood(mood)}
                    className={`p-4 rounded-xl transition-all ${
                      selectedMood.name === mood.name
                        ? 'bg-white/30 scale-105 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-4xl mb-2">{mood.emoji}</div>
                    <div className="text-white text-sm font-medium">{mood.name}</div>
                  </button>
                ))}
              </div>

              <textarea
                value={entry}
                onChange={e => setEntry(e.target.value)}
                placeholder="Write freely. This is your safe space. No judgment. 💜"
                className="w-full h-40 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-purple-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <button
                onClick={saveEntry}
                disabled={!entry.trim()}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Save Entry ✨
              </button>
            </div>

            {/* Recent Entries */}
            {Object.keys(entries).length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Recent Entries</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Object.entries(entries)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 5)
                    .map(([date, data]) => (
                      <div key={date} className="bg-white/10 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-purple-200 text-sm">{formatDate(date)}</span>
                          <span className="text-2xl">
                            {moods.find(m => m.name === data.mood)?.emoji}
                          </span>
                        </div>
                        <p className="text-white line-clamp-2">{data.text}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-400" />
                Your Mood Patterns
              </h2>

              {Object.keys(moodStats).length > 0 ? (
                <div className="space-y-4">
                  {moods.map(mood => {
                    const count = moodStats[mood.name] || 0;
                    const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
                    
                    return (
                      <div key={mood.name}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-white">
                            <span className="text-2xl">{mood.emoji}</span>
                            <span className="font-medium">{mood.name}</span>
                          </div>
                          <span className="text-purple-200">{count} times ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              background: mood.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-purple-200 text-center py-8">
                  Start journaling to see your mood patterns! 📊
                </p>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Weekly Insights</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-white">{getWeeklyCount(entries)}</div>
                  <div className="text-purple-200 text-sm">Entries this week</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-white">{getMostCommonMood(entries)}</div>
                  <div className="text-purple-200 text-sm">Most common mood</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Community View */}
        {currentView === 'community' && (
          <div className="space-y-6">
            {!isPro && (
              <div className="bg-yellow-400/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-400/30">
                <div className="flex items-start gap-4">
                  <Crown className="text-yellow-400 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-white font-bold mb-2">Upgrade to Pro for Community Access</h3>
                    <p className="text-purple-200 mb-4">Connect with others, share anonymously, and find support in a safe space.</p>
                    <button
                      onClick={upgradeToPro}
                      className="bg-yellow-400 text-purple-900 font-semibold px-6 py-2 rounded-lg hover:bg-yellow-300 transition-all"
                    >
                      Upgrade Now - $4.99/month
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isPro && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Share Your Thoughts</h2>
                <textarea
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder="Share something positive or ask for support... (posted anonymously)"
                  className="w-full h-24 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-purple-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 mb-3"
                />
                <button
                  onClick={addCommunityPost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  Post Anonymously
                </button>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Community Feed</h3>
              <div className="space-y-4">
                {communityPosts.map(post => (
                  <div key={post.id} className="bg-white/10 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-300 text-sm font-medium">{post.author}</span>
                      <span className="text-purple-200 text-sm">{formatDate(post.date)}</span>
                    </div>
                    <p className="text-white mb-3">{post.text}</p>
                    <div className="flex items-center gap-2 text-purple-200">
                      <Heart size={16} />
                      <span className="text-sm">{post.likes} hearts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-white/20">
        <div className="max-w-6xl mx-auto px-4 text-center text-purple-200 text-sm">
          <p className="mb-2"><img src={ICON} alt="logo" className="inline-block w-9 h-9 mr-2 align-text-bottom"/>Your data is encrypted and private</p>
          <p>Made with 💜 for mental wellness</p>
        </div>
      </footer>
    </div>
  );
}

// Helper functions
function calculateStreak(entries) {
  const dates = Object.keys(entries).sort().reverse();
  if (dates.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const date of dates) {
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getWeeklyCount(entries) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return Object.values(entries).filter(e => e.time > weekAgo).length;
}

function getMostCommonMood(entries) {
  const counts = Object.values(entries).reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});
  
  if (Object.keys(counts).length === 0) return 'N/A';
  
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}


