import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  Server, 
  Code, 
  Terminal, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  Cpu,
  RefreshCw,
  FileText,
  Layers,
  Sparkles,
  Info,
  ExternalLink,
  Github,
  CloudLightning,
  Workflow,
  Command,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Verify Cloud Run Port bindings",
    description: "Ensure PORT environment variable dynamically maps and binds to 0.0.0.0 for seamless container traffic routing.",
    priority: "High",
    completed: true
  },
  {
    id: 2,
    title: "Configure requirements.txt dependencies",
    description: "Explicitly declare Flask and gunicorn so Cloud Run installs them automatically during the build phase.",
    priority: "High",
    completed: true
  },
  {
    id: 3,
    title: "Build optimized lightweight Dockerfile",
    description: "Utilize python:3.11-slim image base to minimize container size and achieve lightning-fast cold-starts.",
    priority: "Medium",
    completed: false
  },
  {
    id: 4,
    title: "Polish UI to high-contrast Monotones",
    description: "Transform the visual interface to represent modern 'Salt & Pepper' luxury minimalism.",
    priority: "Low",
    completed: false
  }
];

const DOCKERFILE_CONTENT = `# Base image using lightweight Python slim
FROM python:3.11-slim

# Establish the working directory
WORKDIR /app

# Copy dependency files and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application resources
COPY main.py .

# Optimize Python execution environment
ENV PYTHONUNBUFFERED=1

# Start using gunicorn (Mapped to Cloud Run PORT environment variable)
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--threads", "8", "--timeout", "0", "main:app"]`;

const DEPLOY_COMMANDS = `# 1. Authenticate with Google Cloud SDK
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]

# 2. Deploy directly from the current directory (Automatic Cloud Build)
gcloud run deploy flask-task-manager \\
  --source . \\
  --region asia-northeast1 \\
  --allow-unauthenticated`;

const FLASK_MAIN_PREVIEW = `import os
from flask import Flask, render_template_string, request, redirect, url_for

app = Flask(__name__)

# In-memory storage (Stateless design suited for serverless deployment)
tasks = [...]

@app.route("/")
def index():
    stats = {...}
    port = os.environ.get("PORT", "8080")
    return render_template_string(HTML_TEMPLATE, tasks=tasks, stats=stats, port=port)

# ... (Endpoints handling /add, /toggle, and /delete)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=False)`;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('flask_task_manager_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  
  const [copiedText, setCopiedText] = useState<'main' | 'requirements' | 'dockerfile' | 'deploy' | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guide'>('dashboard');
  const [activeGuideSubTab, setActiveGuideSubTab] = useState<'main' | 'requirements' | 'dockerfile' | 'deploy'>('main');

  useEffect(() => {
    localStorage.setItem('flask_task_manager_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false
    };
    
    setTasks([newTask, ...tasks]);
    setTitle('');
    setDescription('');
    setPriority('Medium');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const copyToClipboard = (text: string, type: 'main' | 'requirements' | 'dockerfile' | 'deploy') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col font-sans relative overflow-hidden selection:bg-black selection:text-white">
      {/* Dynamic Ambient Glow (Sophisticated soft white/silver light aura) */}
      <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[50%] bg-zinc-950/[0.01] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[50%] bg-zinc-950/[0.01] rounded-full blur-[140px] pointer-events-none" />
      
      {/* Precision Digital grid layout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Large Watermark Text Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="text-[12vw] font-black text-black/[0.015] tracking-[0.2em] uppercase whitespace-nowrap leading-none font-sans select-none">
          SALT&amp;PEPPER
        </span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/70 backdrop-blur-xl" id="main-header">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-black/5 ring-4 ring-black/5 transition-transform duration-300 hover:scale-[1.03]">
              S&P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-widest text-zinc-900 uppercase">
                  SALT & PEPPER
                </h1>
                <span className="text-[9px] bg-zinc-900 text-white border border-zinc-800 px-2.5 py-0.5 rounded font-extrabold tracking-wider uppercase">
                  Suite v2.5
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">High-Performance GCP Cloud Run Orchestrator</p>
            </div>
          </div>

          {/* Premium Monochromatic Tabs */}
          <div className="flex bg-zinc-100 border border-zinc-200 p-1 rounded-xl shadow-sm relative">
            <button 
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center space-x-2 relative cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'text-white' 
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {activeTab === 'dashboard' && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-black rounded-lg -z-10 shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Layers className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button 
              id="tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center space-x-2 relative cursor-pointer ${
                activeTab === 'guide' 
                  ? 'text-white' 
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {activeTab === 'guide' && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-black rounded-lg -z-10 shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Server className="w-3.5 h-3.5" />
              <span>Deployment</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12 relative z-10">
        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Side: Creation Box */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Premium Info Panel */}
              <div className="relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-36 h-36 bg-zinc-950/[0.01] rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-black text-white rounded-xl shadow-md">
                    <CloudLightning className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                      Stateless Blueprint
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-2.5 leading-relaxed">
                      All build configs (<strong>main.py</strong>, <strong>requirements.txt</strong>, and <strong>Dockerfile</strong>) are verified in your root workspace. Deployable instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Task Registry Card */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-7 shadow-sm">
                <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-zinc-900" />
                  <span>Register New Task</span>
                </h2>
                
                <form onSubmit={addTask} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Task Title *</label>
                    <input 
                      id="input-task-title"
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required 
                      placeholder="e.g., Validate container binding" 
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-950/30 focus:border-zinc-950 text-sm transition-all text-zinc-900 placeholder-zinc-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Task Description (Optional)</label>
                    <textarea 
                      id="input-task-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write notes, endpoints or parameters..." 
                      rows={3}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-950/30 focus:border-zinc-950 text-sm transition-all text-zinc-900 placeholder-zinc-400"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">Priority Label</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(['Low', 'Medium', 'High'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`border rounded-xl py-3 flex flex-col items-center justify-center cursor-pointer transition-all relative text-xs font-black uppercase tracking-wider ${
                            priority === p 
                              ? 'border-black bg-zinc-950 text-white shadow-sm' 
                              : 'border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700'
                          }`}
                        >
                          <span>{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    id="btn-add-task"
                    type="submit" 
                    className="w-full py-4 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center cursor-pointer border border-transparent shadow-md active:scale-[0.99]"
                  >
                    Add Task
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side: Backlog & Counters */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Counters Display */}
              <div className="grid grid-cols-3 gap-5">
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Backlog</span>
                  <span className="text-3xl font-black text-zinc-900 mt-2 font-mono leading-none">{stats.total}</span>
                </div>
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Runs</span>
                  <span className="text-3xl font-black text-zinc-500 mt-2 font-mono leading-none">{stats.pending}</span>
                </div>
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Completed</span>
                  <span className="text-3xl font-black text-zinc-900 mt-2 font-mono leading-none">{stats.completed}</span>
                </div>
              </div>

              {/* Backlog Directories */}
              <div className="space-y-5">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Task Directory</h2>
                  <button 
                    id="btn-reset"
                    onClick={() => setTasks(INITIAL_TASKS)}
                    className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1.5 font-bold transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Backlog
                  </button>
                </div>

                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <motion.div
                          layout
                          key={task.id}
                          initial={{ opacity: 0, scale: 0.98, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                          className={`bg-white border relative overflow-hidden transition-all duration-300 ${
                            task.completed 
                              ? 'border-zinc-200/60 bg-zinc-50/50 opacity-55' 
                              : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/40'
                          } rounded-2xl p-5 flex items-start justify-between gap-4 shadow-sm`}
                        >
                          {/* Monochromatic Bar on the left */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                            task.completed 
                              ? 'bg-zinc-300' 
                              : task.priority === 'High' 
                                ? 'bg-zinc-950' 
                                : task.priority === 'Medium' 
                                  ? 'bg-zinc-400' 
                                  : 'bg-zinc-200'
                          }`} />

                          <div className="flex items-start space-x-4 flex-grow pl-2">
                            {/* Complete State Toggle */}
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                task.completed 
                                  ? 'bg-black border-black text-white scale-105 shadow-sm' 
                                  : 'border-zinc-200 hover:border-black hover:bg-zinc-50 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[4]" />
                            </button>

                            {/* Main Information */}
                            <div className="flex-grow">
                              <h3 className={`text-sm font-bold tracking-tight transition-all duration-200 ${
                                task.completed ? 'line-through text-zinc-400' : 'text-zinc-900'
                              }`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className={`text-xs text-zinc-500 mt-2 leading-relaxed ${
                                  task.completed ? 'line-through text-zinc-300' : ''
                                }`}>
                                  {task.description}
                                </p>
                              )}
                              
                              {/* Labels */}
                              <div className="flex items-center space-x-2 mt-4">
                                <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border border-zinc-200 bg-zinc-50 text-zinc-500">
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Delete Action */}
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-white border border-dashed border-zinc-200 rounded-3xl py-16 px-4 text-center">
                        <AlertCircle className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Backlog Cleaned</h4>
                        <p className="text-xs text-zinc-500 mt-2">All tasks completed. Add tasks to verify system flow.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Deployment Guide Terminal View */
          <div className="bg-white border border-zinc-200 rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[580px]">
            {/* Sidebar Folder Directory */}
            <div className="md:col-span-1 bg-zinc-50/80 border-r border-zinc-200 p-5 space-y-1.5">
              <div className="px-3 py-2 mb-4">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Directory Files</h3>
                <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">Select configuration elements to inspect and deploy.</p>
              </div>
              
              <button 
                id="btn-subtab-main"
                onClick={() => setActiveGuideSubTab('main')}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'main' 
                    ? 'bg-white border border-zinc-200 text-zinc-900 shadow-sm' 
                    : 'text-zinc-400 hover:bg-zinc-100/50 hover:text-zinc-700'
                }`}
              >
                <Code className="w-4 h-4" />
                <div className="flex-grow">
                  <p className="font-extrabold">main.py</p>
                  <p className="text-[9px] font-normal text-zinc-400 uppercase">Flask Core App</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button 
                id="btn-subtab-req"
                onClick={() => setActiveGuideSubTab('requirements')}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'requirements' 
                    ? 'bg-white border border-zinc-200 text-zinc-900 shadow-sm' 
                    : 'text-zinc-400 hover:bg-zinc-100/50 hover:text-zinc-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <div className="flex-grow">
                  <p className="font-extrabold">requirements.txt</p>
                  <p className="text-[9px] font-normal text-zinc-400 uppercase">Dependencies</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button 
                id="btn-subtab-dock"
                onClick={() => setActiveGuideSubTab('dockerfile')}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'dockerfile' 
                    ? 'bg-white border border-zinc-200 text-zinc-900 shadow-sm' 
                    : 'text-zinc-400 hover:bg-zinc-100/50 hover:text-zinc-700'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <div className="flex-grow">
                  <p className="font-extrabold">Dockerfile</p>
                  <p className="text-[9px] font-normal text-zinc-400 uppercase">Container Settings</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button 
                id="btn-subtab-deploy"
                onClick={() => setActiveGuideSubTab('deploy')}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'deploy' 
                    ? 'bg-white border border-zinc-200 text-zinc-900 shadow-sm' 
                    : 'text-zinc-400 hover:bg-zinc-100/50 hover:text-zinc-700'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <div className="flex-grow">
                  <p className="font-extrabold">gcloud command</p>
                  <p className="text-[9px] font-normal text-zinc-400 uppercase">Terminal CLI Run</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>
            </div>

            {/* Terminal Panel Content */}
            <div className="md:col-span-3 p-6 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <div>
                    <h3 className="font-extrabold text-zinc-900 text-sm uppercase tracking-wider">
                      {activeGuideSubTab === 'main' && 'main.py (Flask Core Application)'}
                      {activeGuideSubTab === 'requirements' && 'requirements.txt (Dependencies config)'}
                      {activeGuideSubTab === 'dockerfile' && 'Dockerfile (Container architecture)'}
                      {activeGuideSubTab === 'deploy' && 'Deployment workflow (Google Cloud SDK)'}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                      {activeGuideSubTab === 'main' && 'Stateless back-end. Automatically captures local dynamic PORT variables assigned by Cloud Run.'}
                      {activeGuideSubTab === 'requirements' && 'Defines packages including Gunicorn which bridges communication inside the container.'}
                      {activeGuideSubTab === 'dockerfile' && 'Sets working context, environment flags, and pre-installs PIP elements cleanly.'}
                      {activeGuideSubTab === 'deploy' && 'Instructions to target specific clusters and route public traffic without friction.'}
                    </p>
                  </div>

                  {/* Copy Trigger */}
                  <button
                    onClick={() => {
                      let text = '';
                      if (activeGuideSubTab === 'main') text = FLASK_MAIN_PREVIEW;
                      else if (activeGuideSubTab === 'requirements') text = `Flask==3.0.3\ngunicorn==22.0.0`;
                      else if (activeGuideSubTab === 'dockerfile') text = DOCKERFILE_CONTENT;
                      else text = DEPLOY_COMMANDS;
                      copyToClipboard(text, activeGuideSubTab);
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl text-xs font-bold transition-all border border-zinc-200 cursor-pointer shadow-sm"
                  >
                    {copiedText === activeGuideSubTab ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-zinc-900" />
                        <span className="text-zinc-900 font-black uppercase tracking-wider text-[10px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-wider text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Simulated Syntax Highlighting Console */}
                <div className="mt-6 bg-zinc-50 rounded-xl p-5 overflow-x-auto border border-zinc-200 shadow-inner max-h-[380px] relative">
                  <div className="absolute top-3.5 right-4 text-[9px] bg-white border border-zinc-200 text-zinc-400 font-mono px-2.5 py-1 rounded uppercase font-black tracking-widest">
                    {activeGuideSubTab}
                  </div>
                  <pre className="text-zinc-800 font-mono text-xs leading-relaxed pt-2">
                    {activeGuideSubTab === 'main' && (
                      <code>
                        <span className="text-indigo-600 font-semibold">import</span> os{"\n"}
                        <span className="text-indigo-600 font-semibold">from</span> flask <span className="text-indigo-600 font-semibold">import</span> Flask, render_template_string, request, redirect, url_for{"\n\n"}
                        app = Flask(__name__){"\n\n"}
                        <span className="text-zinc-400"># In-memory transient database structure</span>{"\n"}
                        tasks = {"[...]"} {"\n\n"}
                        <span className="text-emerald-700">@app.route</span>(<span className="text-amber-800">"/"</span>){"\n"}
                        <span className="text-indigo-600 font-semibold">def</span> <span className="text-zinc-900 font-bold">index</span>():{"\n"}
                        {"    "}stats = {"{...}"}{"\n"}
                        {"    "}port = os.environ.get(<span className="text-amber-800">"PORT"</span>, <span className="text-amber-800">"8080"</span>){"\n"}
                        {"    "}<span className="text-indigo-600 font-semibold">return</span> render_template_string(HTML_TEMPLATE, tasks=tasks, stats=stats, port=port){"\n\n"}
                        <span className="text-zinc-400"># ... (Endpoint routing configurations)</span>{"\n\n"}
                        <span className="text-indigo-600 font-semibold">if</span> __name__ == <span className="text-amber-800">"__main__"</span>:{"\n"}
                        {"    "}port = <span className="text-blue-600">int</span>(os.environ.get(<span className="text-amber-800">"PORT"</span>, <span className="text-blue-600">8080</span>)){"\n"}
                        {"    "}app.run(host=<span className="text-amber-800">"0.0.0.0"</span>, port=port, debug=<span className="text-zinc-400">False</span>)
                      </code>
                    )}
                    {activeGuideSubTab === 'requirements' && (
                      <code>
                        <span className="text-zinc-900 font-bold">Flask</span>==<span className="text-blue-600">3.0.3</span>{"\n"}
                        <span className="text-zinc-900 font-bold">gunicorn</span>==<span className="text-blue-600">22.0.0</span>
                      </code>
                    )}
                    {activeGuideSubTab === 'dockerfile' && (
                      <code>
                        <span className="text-indigo-600 font-bold">FROM</span> python:3.11-slim{"\n\n"}
                        <span className="text-indigo-600 font-bold">WORKDIR</span> /app{"\n\n"}
                        <span className="text-indigo-600 font-bold">COPY</span> requirements.txt .{"\n"}
                        <span className="text-indigo-600 font-bold">RUN</span> pip install --no-cache-dir -r requirements.txt{"\n\n"}
                        <span className="text-indigo-600 font-bold">COPY</span> main.py .{"\n\n"}
                        <span className="text-indigo-600 font-bold">ENV</span> PYTHONUNBUFFERED=1{"\n\n"}
                        <span className="text-indigo-600 font-bold">CMD</span> [<span className="text-amber-800">"gunicorn"</span>, <span className="text-amber-800">"--bind"</span>, <span className="text-amber-800">"0.0.0.0:8080"</span>, <span className="text-amber-800">"--workers"</span>, <span className="text-amber-800">"1"</span>, <span className="text-amber-800">"main:app"</span>]
                      </code>
                    )}
                    {activeGuideSubTab === 'deploy' && (
                      <code>
                        <span className="text-zinc-400"># Login & map GCP project target context</span>{"\n"}
                        gcloud auth login{"\n"}
                        gcloud config set project <span className="text-zinc-900 font-bold">[YOUR_PROJECT_ID]</span>{"\n\n"}
                        <span className="text-zinc-400"># Direct source deployment execution</span>{"\n"}
                        gcloud run deploy flask-task-manager \<span className="text-zinc-400"></span>{"\n"}
                        {"  "}--source . \<span className="text-zinc-400"></span>{"\n"}
                        {"  "}--region asia-northeast1 \<span className="text-zinc-400"></span>{"\n"}
                        {"  "}--allow-unauthenticated
                      </code>
                    )}
                  </pre>
                </div>
              </div>

              {/* Engineering Advice Banner */}
              <div className="mt-6 p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-start space-x-3.5 text-xs text-zinc-600">
                <Info className="w-4.5 h-4.5 text-zinc-900 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-extrabold text-zinc-900 uppercase tracking-wider text-[10.5px]">Production Architecture Notice</h4>
                  <p className="mt-2 leading-relaxed text-zinc-500">
                    Cloud Run automatically scales down (shrinks instances to 0) when there is no incoming API load. Because of this, transient data initialized inside Flask's python runtime resets. For permanent, multi-tenant persistence, integrate <strong>Cloud Firestore</strong> or <strong>Cloud SQL</strong>.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-100 border-t border-zinc-200 py-12 mt-16 text-xs text-zinc-500 relative z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-black text-zinc-900 uppercase tracking-widest">SALT & PEPPER RUN SUITE &copy; 2026</p>
            <p className="mt-1 text-zinc-500">All deployment configurations are already generated in the root workspace.</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="bg-white px-3.5 py-1.5 rounded text-zinc-700 border border-zinc-200 font-mono shadow-sm">Python 3.11</span>
            <span className="bg-white px-3.5 py-1.5 rounded text-zinc-700 border border-zinc-200 font-mono shadow-sm">Flask 3.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
