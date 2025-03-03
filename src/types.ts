export interface Story {
  _id: string;
  title: string;
  content: string;
  prompt: string;
  genre: string;
  createdAt: string;
}

export interface GeneratedStory {
  title: string;
  content: string;
  prompt: string;
  genre: string;
}

export type StoryGenreOption = 
  | 'fantasy' 
  | 'sci-fi' 
  | 'mystery' 
  | 'romance' 
  | 'horror' 
  | 'adventure';

export type StoryLengthOption = 'short' | 'medium' | 'long';