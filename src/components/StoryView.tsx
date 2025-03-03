import React from 'react';
import { Story } from '../types';
import { Trash2, Calendar, Tag } from 'lucide-react';

interface StoryViewProps {
  story: Story;
  onDelete: () => void;
}

const StoryView: React.FC<StoryViewProps> = ({ story, onDelete }) => {
  const formattedDate = new Date(story.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-white">{story.title}</h2>
        <button
          onClick={onDelete}
          className="p-2 text-red-300 hover:text-red-200 hover:bg-red-900/20 rounded-full transition-colors"
          title="Delete story"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6 text-sm text-gray-300">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-purple-300" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1 text-purple-300" />
          <span className="capitalize">{story.genre}</span>
        </div>
      </div>

      <div className="mb-6 p-3 bg-black/30 rounded-md border border-purple-500/20">
        <h3 className="text-sm font-medium text-purple-300 mb-1">Original Prompt:</h3>
        <p className="text-gray-300 italic">{story.prompt}</p>
      </div>

      <div className="prose prose-invert prose-purple max-w-none">
        <div className="bg-black/10 p-6 rounded-lg border border-white/5 whitespace-pre-line">
          {story.content}
        </div>
      </div>
    </div>
  );
};

export default StoryView;