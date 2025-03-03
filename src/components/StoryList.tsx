import React from 'react';
import { Story } from '../types';
import { BookOpen } from 'lucide-react';

interface StoryListProps {
  stories: Story[];
  onSelect: (story: Story) => void;
  selectedId?: string;
}

const StoryList: React.FC<StoryListProps> = ({ stories, onSelect, selectedId }) => {
  if (stories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No stories found. Create your first story!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {stories.map((story) => (
        <div
          key={story._id}
          onClick={() => onSelect(story)}
          className={`p-3 rounded-md cursor-pointer transition-all ${
            selectedId === story._id
              ? 'bg-purple-600/30 border border-purple-500'
              : 'bg-black/20 border border-white/5 hover:bg-black/30'
          }`}
        >
          <div className="flex items-start">
            <BookOpen className="h-5 w-5 mt-0.5 mr-2 text-purple-300 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">{story.title}</h3>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <span className="capitalize bg-purple-900/50 px-2 py-0.5 rounded text-purple-200">
                  {story.genre}
                </span>
                <span className="mx-2">•</span>
                <span className="truncate">
                  {new Date(story.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryList;