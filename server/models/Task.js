import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  detailedDescription: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  tags: { type: [String], required: true },
  goal: { type: String, required: true },
  type: { type: String, enum: ['Project', 'Challenge', 'Practice', 'Learning'], required: true },
  resources: { type: [String], required: true },
  skill: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);