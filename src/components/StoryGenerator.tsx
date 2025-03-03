import React, { useState } from 'react';
import { Sparkles, Save, Loader2, RefreshCw } from 'lucide-react';
import { StoryGenreOption, StoryLengthOption, GeneratedStory } from '../types';

interface StoryGeneratorProps {
  onSave: (story: Omit<GeneratedStory, '_id'>) => Promise<any>;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<StoryGenreOption>('fantasy');
  const [length, setLength] = useState<StoryLengthOption>('medium');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const genres: StoryGenreOption[] = ['fantasy', 'sci-fi', 'mystery', 'romance', 'horror', 'adventure'];
  const lengths: StoryLengthOption[] = ['short', 'medium', 'long'];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate a story');
      return;
    }

    setError('');
    setIsGenerating(true);
    setGeneratedStory('');

    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, genre, length }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      setGeneratedStory(data.story);
      
      // Generate a title from the first few words if not provided
      if (!title) {
        const firstLine = data.story.split('\n')[0];
        const suggestedTitle = firstLine.length > 40 
          ? firstLine.substring(0, 40) + '...' 
          : firstLine;
        setTitle(suggestedTitle);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedStory || !title) {
      setError('Please generate a story and provide a title before saving');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const savedStory = await onSave({
        title,
        content: generatedStory,
        prompt,
        genre,
      });

      if (savedStory) {
        setSuccess('Story saved successfully!');
        // Reset form after successful save
        setPrompt('');
        setTitle('');
        setGeneratedStory('');
        setGenre('fantasy');
        setLength('medium');
      } else {
        throw new Error('Failed to save story');
      }
    } catch (error) {
      console.error('Error saving story:', error);
      setError('Failed to save story. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-black/20 backdrop-blur-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-300" />
          Story Generator
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md text-green-200">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-purple-200 mb-1">
              Story Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt for your story..."
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-purple-200 mb-1">
                Genre
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value as StoryGenreOption)}
                className="w-full p-2 bg-black/30 border border-purple-500/30 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="length" className="block text-sm font-medium text-purple-200 mb-1">
                Length
              </label>
              <select
                id="length"
                value={length}
                onChange={(e) => setLength(e.target.value as StoryLengthOption)}
                className="w-full p-2 bg-black/30 border border-purple-500/30 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {lengths.map((l) => (
                  <option key={l} value={l}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md font-medium text-white hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Story
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-purple-200 mb-1">
            Story Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your story..."
            className="w-full p-2 bg-black/30 border border-purple-500/30 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-purple-200">
              Generated Story
            </label>
            {generatedStory && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="text-xs flex items-center text-purple-300 hover:text-purple-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </button>
            )}
          </div>
          <div className="w-full h-[calc(100vh-24rem)] p-4 bg-black/30 border border-purple-500/30 rounded-md text-white overflow-y-auto whitespace-pre-wrap">
            {isGenerating ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
              </div>
            ) : generatedStory ? (
              generatedStory
            ) : (
              <div className="text-gray-500 h-full flex items-center justify-center text-center">
                <p>Your generated story will appear here</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || !generatedStory || !title}
          className="w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-md font-medium text-white hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Story
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StoryGenerator;