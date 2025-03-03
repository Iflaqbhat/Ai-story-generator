import React, { useState, useEffect } from 'react';
import { Book, Sparkles, BookText, Trash2, Save, Loader2 } from 'lucide-react';
import StoryGenerator from './components/StoryGenerator';
import StoryList from './components/StoryList';
import StoryView from './components/StoryView';
import { Story } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/stories');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
  };

  const handleDeleteStory = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/stories/${id}`, {
        method: 'DELETE',
      });
      setStories(stories.filter(story => story._id !== id));
      if (selectedStory && selectedStory._id === id) {
        setSelectedStory(null);
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const handleSaveStory = async (story: Omit<Story, '_id'>) => {
    try {
      const response = await fetch('http://localhost:5000/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(story),
      });
      const savedStory = await response.json();
      setStories([savedStory, ...stories]);
      return savedStory;
    } catch (error) {
      console.error('Error saving story:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Book className="h-8 w-8 text-purple-300" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                AI Story Weaver
              </h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 transition ${
                  activeTab === 'generate'
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/20 hover:bg-black/30 text-purple-200'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Create</span>
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 transition ${
                  activeTab === 'library'
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/20 hover:bg-black/30 text-purple-200'
                }`}
              >
                <BookText className="h-4 w-4" />
                <span>Library</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'generate' ? (
          <StoryGenerator onSave={handleSaveStory} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-black/20 backdrop-blur-md rounded-lg p-4 h-[calc(100vh-12rem)] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookText className="mr-2 h-5 w-5 text-purple-300" />
                Your Stories
              </h2>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <StoryList
                  stories={stories}
                  onSelect={handleStorySelect}
                  selectedId={selectedStory?._id}
                />
              )}
            </div>
            <div className="lg:col-span-2 bg-black/20 backdrop-blur-md rounded-lg p-6 h-[calc(100vh-12rem)] overflow-y-auto">
              {selectedStory ? (
                <StoryView
                  story={selectedStory}
                  onDelete={() => handleDeleteStory(selectedStory._id)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                  <BookText className="h-16 w-16 mb-4 text-purple-400/50" />
                  <h3 className="text-xl font-medium mb-2">No Story Selected</h3>
                  <p>Select a story from your library or create a new one</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;