import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  detailedDescription: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  tags: { type: [String], default: [] },
  goal: { type: String, default: '' },
  type: { type: String, enum: ['Project', 'Challenge', 'Practice', 'Learning'], default: 'Practice' },
  resources: { type: [String], default: [] },
  skill: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);