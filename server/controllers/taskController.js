import Task from '../models/Task.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Capitalize first letter of a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const recommendTasks = async (req, res) => {
  const { skill, time } = req.body;
  const userId = req.user.id;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!skill || !time) {
    return res.status(400).json({ message: 'Skill and time are required' });
  }

  // Normalize skill to lowercase
  const normalizedSkill = skill.toLowerCase();

  if (!apiKey) {
    return res.status(500).json({ message: 'Gemini API key not found in environment' });
  }

  const prompt = `
You are an AI-powered task recommendation system for students. Generate ONE specific, actionable task for the skill "${normalizedSkill}" that can be completed in approximately ${time} hour(s). The task should enhance the student's proficiency in the skill.

Return a JSON object with the following fields:
- description (string, 20-50 words, concise summary)
- detailedDescription (string, 50-100 words, detailed context or steps)
- estimatedTime (number, hours, must not exceed ${time})
- skillLevel (string, "Beginner" | "Intermediate" | "Advanced")
- tags (array of strings, relevant keywords)
- goal (string, learning objective, 10-20 words)
- type (string, "Project" | "Challenge" | "Practice" | "Learning")
- resources (array of strings, URLs or titles of reputable learning resources)

Example:
{
  "description": "Create a Python function to calculate the factorial of a number recursively.",
  "detailedDescription": "Write a Python function that uses recursion to compute the factorial of a positive integer. Start by defining a base case for 0 or 1, then implement the recursive case. Test the function with inputs like 5 and 10 to verify correctness. This task helps understand recursion and function design.",
  "estimatedTime": 1,
  "skillLevel": "Beginner",
  "tags": ["Python", "Functions", "Recursion"],
  "goal": "Understand recursive function implementation in Python.",
  "type": "Practice",
  "resources": ["https://www.w3schools.com/python/", "Python Official Docs"]
}

Ensure the response is valid JSON without markdown wrappers.
`;

  // Helper function to clean markdown from response
  const cleanResponse = (text) => {
    return text
      .replace(/```json\s*([\s\S]*?)\s*```/, '$1')
      .replace(/```\s*([\s\S]*?)\s*```/, '$1')
      .trim();
  };

  try {
    // Attempt with SDK
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean markdown
    text = cleanResponse(text);

    let task;
    try {
      task = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ Failed to parse SDK response:', text, parseError);
      return res.status(500).json({ message: 'SDK response invalid JSON', rawResponse: text });
    }

    // Validate task
    if (typeof task.estimatedTime !== 'number' || task.estimatedTime > time) {
      return res.status(400).json({ message: 'Task exceeds time limit or invalid estimatedTime' });
    }

    if (!['Beginner', 'Intermediate', 'Advanced'].includes(task.skillLevel)) {
      task.skillLevel = 'Beginner';
    }

    if (!['Project', 'Challenge', 'Practice', 'Learning'].includes(task.type)) {
      task.type = 'Practice';
    }

    if (!task.detailedDescription || typeof task.detailedDescription !== 'string') {
      task.detailedDescription = task.description;
    }

    // Save task to MongoDB
    const savedTask = await new Task({
      userId,
      description: task.description,
      detailedDescription: task.detailedDescription,
      estimatedTime: task.estimatedTime,
      skillLevel: task.skillLevel,
      tags: task.tags,
      goal: task.goal,
      type: task.type,
      resources: task.resources,
      skill: normalizedSkill, // Store in lowercase
      status: 'pending'
    }).save();

    return res.status(201).json(savedTask);
  } catch (sdkError) {
    console.warn('⚠️ SDK failed, using REST fallback:', sdkError.message);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ REST API error:', errorData);
        return res.status(500).json({ message: 'Gemini REST API failed', error: errorData });
      }

      const data = await response.json();

      if (!data?.candidates?.length) {
        console.error('❌ No candidates in REST response:', data);
        return res.status(500).json({ message: 'No task returned by Gemini REST API' });
      }

      let text = data.candidates[0].content.parts[0].text;

      // Clean markdown
      text = cleanResponse(text);

      let task;
      try {
        task = JSON.parse(text);
      } catch (parseError) {
        console.error('❌ Failed to parse REST response:', text, parseError);
        return res.status(500).json({ message: 'REST response invalid JSON', rawResponse: text });
      }

      // Validate task
      if (typeof task.estimatedTime !== 'number' || task.estimatedTime > time) {
        return res.status(400).json({ message: 'Task exceeds time limit or invalid estimatedTime' });
      }

      if (!['Beginner', 'Intermediate', 'Advanced'].includes(task.skillLevel)) {
        task.skillLevel = 'Beginner';
      }

      if (!['Project', 'Challenge', 'Practice', 'Learning'].includes(task.type)) {
        task.type = 'Practice';
      }

      if (!task.detailedDescription || typeof task.detailedDescription !== 'string') {
        task.detailedDescription = task.description;
      }

      // Save task to MongoDB
      const savedTask = await new Task({
        userId,
        description: task.description,
        detailedDescription: task.detailedDescription,
        estimatedTime: task.estimatedTime,
        skillLevel: task.skillLevel,
        tags: task.tags,
        goal: task.goal,
        type: task.type,
        resources: task.resources,
        skill: normalizedSkill, // Store in lowercase
        status: 'pending'
      }).save();

      return res.status(201).json(savedTask);
    } catch (restError) {
      console.error('🔥 Gemini REST API failed:', restError);
      return res.status(500).json({ message: 'Internal Server Error (REST fallback)', error: restError.message });
    }
  }
};

// Fetch pending tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, status: 'pending' }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept task
export const acceptTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.status !== 'pending') {
      return res.status(400).json({ message: 'Task is not pending' });
    }

    task.status = 'accepted';
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject task
export const rejectTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.status !== 'pending') {
      return res.status(400).json({ message: 'Task is not pending' });
    }

    task.status = 'rejected';
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch accepted tasks grouped by skill
export const getAcceptedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, status: 'accepted' }).sort({ createdAt: -1 });
    // Group tasks by skill (case-insensitive)
    const groupedTasks = tasks.reduce((acc, task) => {
      const skill = capitalize(task.skill); // Capitalize for display
      if (!acc[skill]) {
        acc[skill] = [];
      }
      acc[skill].push(task);
      return acc;
    }, {});
    res.json(groupedTasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle task completion
export const completeTask = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const userId = req.user.id;

  try {
    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.status !== 'accepted') {
      return res.status(400).json({ message: 'Task must be accepted to mark as completed' });
    }

    task.completed = completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};