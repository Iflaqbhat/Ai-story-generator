import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    default: 'fantasy'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Story = mongoose.model('Story', storySchema);