// server.js - Express Backend for Task Tracker
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(express.json());

// Initialize tasks file
async function initTasksFile() {
  try {
    await fs.access(TASKS_FILE);
  } catch {
    await fs.writeFile(TASKS_FILE, JSON.stringify([], null, 2));
  }
}

// Read tasks from JSON
async function getTasks() {
  const data = await fs.readFile(TASKS_FILE, 'utf-8');
  return JSON.parse(data);
}

// GET monthly stats
app.get('/api/stats/monthly', async (req, res) => {
  try {
    const tasks = await getTasks();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTasks = tasks.filter(t => {
      const taskDate = new Date(t.updatedAt);
      return taskDate.getMonth() === currentMonth && 
             taskDate.getFullYear() === currentYear;
    });

    const stats = {
      total: monthlyTasks.length,
      completed: monthlyTasks.filter(t => t.status === 'done').length,
      byCategory: {
        Personal: monthlyTasks.filter(t => t.category === 'Personal' && t.status === 'done').length,
        Work: monthlyTasks.filter(t => t.category === 'Work' && t.status === 'done').length,
        Fitness: monthlyTasks.filter(t => t.category === 'Fitness' && t.status === 'done').length
      }
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Write tasks to JSON
async function saveTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}



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

// Schedule daily email at 6:00 AM
async function scheduleDailyEmail() {
  schedule.scheduleJob('0 6 * * *', async () => {
    try {
      const tasks = await getTasks();
      
      const pendingTasks = tasks.filter(t => 
        t.status === 'todo' || t.status === 'in-progress'
      );

      if (pendingTasks.length === 0) {
        console.log('No pending tasks to remind about');
        return;
      }

      const taskList = pendingTasks
        .map(t => `- ${t.description} (${t.category} - ${t.priority} priority)`)
        .join('\n');

      const emailContent = `
Here are your pending tasks for tonight:

${taskList}

Total pending tasks: ${pendingTasks.length}

Don't forget to complete them!
Task Tracker
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.USER_EMAIL,
        subject: `📋 Task Reminder - ${pendingTasks.length} tasks pending`,
        text: emailContent,
        html: `
          <h2>Evening Reminder 🌙</h2>
          <p>Here are your pending tasks:</p>
          <ul>
            ${pendingTasks.map(t => 
              `<li><strong>${t.description}</strong> (${t.category} - ${t.priority})</li>`
            ).join('')}
          </ul>
          <p><strong>Total pending tasks: ${pendingTasks.length}</strong></p>
          <p>Don't forget to complete them!</p>
        `
      });

      console.log(`✅ Daily reminder email sent at 6:00 AM`);
    } catch (err) {
      console.error('Error sending email:', err);
    }
  });
}

// Optional: Send immediate test email
async function sendTestEmail() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.USER_EMAIL,
      subject: 'Test Email - Task Tracker',
      text: 'If you see this, email configuration is working!'
    });
    console.log('✅ Test email sent successfully');
  } catch (err) {
    console.error('❌ Test email failed:', err.message);
  }
}

// ===== ROUTES =====

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await getTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
app.post('/api/tasks', async (req, res) => {
  try {
    const tasks = await getTasks();
    const newTask = {
      id: Date.now(),
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority,
      status: 'todo',
      deadline: req.body.deadline || null,
      calendarEventId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (newTask.deadline) {
      // Calendar event creation removed
    }

    tasks.push(newTask);
    await saveTasks(tasks);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await getTasks();
    const taskIndex = tasks.findIndex(t => t.id == req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = tasks[taskIndex];
    Object.assign(task, req.body, { updatedAt: new Date().toISOString() });

    if (req.body.deadline && !task.calendarEventId) {
      // Calendar event creation removed
    }

    tasks[taskIndex] = task;
    await saveTasks(tasks);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await getTasks();
    const filtered = tasks.filter(t => t.id != req.params.id);
    await saveTasks(filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH change task status
app.patch('/api/tasks/:id/status', async (req, res) => {
  try {
    const tasks = await getTasks();
    const task = tasks.find(t => t.id == req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.status = req.body.status;
    task.updatedAt = new Date().toISOString();
    await saveTasks(tasks);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, async () => {
  await initTasksFile();
  scheduleDailyEmail();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Daily email reminder scheduled for 6:00 AM`);
});

module.exports = app;