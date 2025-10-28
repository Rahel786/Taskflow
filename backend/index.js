// server.js - Express Backend with MongoDB
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// ===== MONGODB CONNECTION =====
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ===== TASK SCHEMA =====
const taskSchema = new mongoose.Schema({
  description: String,
  category: String,
  priority: String,
  status: { type: String, default: 'todo' },
  deadline: Date,
  calendarEventId: String
}, { timestamps: true });

taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

const Task = mongoose.model('Task', taskSchema);

// ===== EMAIL SETUP =====
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('⚠️ Email configuration error:', error.message);
  } else if (success) {
    console.log('✅ Email service ready');
  }
});

// ===== FUNCTION: Send Reminder Email =====
async function sendDailyEmail() {
  try {
    const tasks = await Task.find({ status: { $in: ['todo', 'in-progress'] } });

    if (tasks.length === 0) {
      console.log('ℹ️ No pending tasks for today');
      return;
    }

    await transporter.sendMail({
      from: `"Task Tracker" <${process.env.EMAIL_USER}>`,
      to: process.env.USER_EMAIL,
      subject: `📋 Task Reminder - ${tasks.length} tasks pending`,
      html: `
        <h2>Evening Reminder 🌙</h2>
        <p>Here are your pending tasks:</p>
        <ul>${tasks.map(t => `<li>${t.description}</li>`).join('')}</ul>
      `
    });

    console.log('✅ Daily reminder email sent successfully');
  } catch (err) {
    console.error('❌ Failed to send daily email:', err.message);
  }
}

// ===== CRON JOB: Every day at 9:00 PM =====
// Cron syntax: '0 21 * * *' → 9:00 PM daily
schedule.scheduleJob('0 21 * * *', async () => {
  console.log('🕘 Running scheduled task: Daily reminder email');
  await sendDailyEmail();
});

// ===== ROUTES =====

// Trigger manually if needed
app.get('/api/send-daily-email', async (req, res) => {
  try {
    await sendDailyEmail();
    res.json({ success: true, message: 'Manual email sent' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH change task status
app.patch('/api/tasks/:id/status', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('⏰ Cron job scheduled for 9:00 PM daily');
});

module.exports = app;