import os
from flask import Flask, render_template_string, request, redirect, url_for

app = Flask(__name__)

# In-memory data store for tasks (Stateless design for serverless environment)
tasks = [
    {
        "id": 1,
        "title": "Configure Cloud Run Port settings",
        "description": "Read port dynamically from PORT env and bind to 0.0.0.0.",
        "priority": "High",
        "completed": True
    },
    {
        "id": 2,
        "title": "Include requirements.txt in build folder",
        "description": "Specify Flask and gunicorn so Cloud Run installs them on deployment.",
        "priority": "High",
        "completed": True
    },
    {
        "id": 3,
        "title": "Write Dockerfile and optimize layers",
        "description": "Utilize python:3.11-slim base image for fast container initialization.",
        "priority": "Medium",
        "completed": False
    },
    {
        "id": 4,
        "title": "Polishing UI to Premium Monotones",
        "description": "Rebrand to modern 'Salt & Pepper' luxury minimalism using ultra-high contrast styling.",
        "priority": "Low",
        "completed": False
    }
]
task_id_counter = 5

# HTML/CSS (Jinja2 Template) - Premium 'Salt & Pepper' Monochromatic High-Contrast Style
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Salt & Pepper | Cloud Run Suite</title>
    <!-- Tailwind CSS (CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #08080a; /* Pepper Black */
        }
        .mono {
            font-family: 'JetBrains Mono', monospace;
        }
        .border-premium {
            border-color: rgba(255, 255, 255, 0.07);
        }
        .bg-pepper {
            background-color: rgba(15, 15, 18, 0.85);
        }
        .bg-salt {
            background-color: rgba(255, 255, 255, 0.95);
        }
        .text-pepper {
            color: #0d0d11;
        }
        .glass-header {
            background: rgba(10, 10, 12, 0.85);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
        }
        /* Custom scrollbar for premium touch */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #08080a;
        }
        ::-webkit-scrollbar-thumb {
            background: #222227;
            border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #33333b;
        }
    </style>
</head>
<body class="min-h-screen text-slate-300 flex flex-col antialiased relative">
    
    <!-- Sophisticated background pattern -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
    <div class="absolute top-0 left-1/3 w-[600px] h-[300px] bg-white/5 rounded-full blur-[160px] pointer-events-none"></div>

    <!-- HEADER -->
    <header class="glass-header sticky top-0 z-40 border-b border-white/5">
        <div class="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black font-black text-xl shadow-2xl shadow-white/10 ring-4 ring-white/10">
                    S&P
                </div>
                <div>
                    <h1 class="text-sm font-extrabold tracking-widest text-white uppercase flex items-center gap-2">
                        Salt & Pepper <span class="text-[9px] font-bold bg-white/10 border border-white/20 text-white px-2 py-0.5 rounded-md tracking-normal">LIVE CONSOLE</span>
                    </h1>
                    <p class="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">GCP Cloud Run Ready Architecture</p>
                </div>
            </div>
            
            <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                    <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span class="mono text-[10px] tracking-wider uppercase">Active Port: {{ port }}</span>
                </div>
            </div>
        </div>
    </header>

    <!-- MAIN WRAPPER -->
    <main class="flex-grow max-w-5xl w-full mx-auto px-6 py-12 relative z-10">
        
        <!-- Welcome Banner -->
        <div class="mb-10 p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-start space-x-4">
            <div class="p-2.5 bg-white/10 text-white rounded-2xl border border-white/10">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div>
                <h4 class="text-xs font-bold text-white tracking-widest uppercase">Stateless Infrastructure Reminder</h4>
                <p class="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Designed for serverless containers. The in-memory dataset is temporary and resets when Cloud Run scales down to zero.
                    For persistent workloads, consider integrating GCP Firestore or Cloud SQL (PostgreSQL).
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <!-- LEFT: Add Task Form (Col 5) -->
            <div class="lg:col-span-5">
                <div class="bg-pepper border-premium rounded-3xl p-7 shadow-2xl shadow-black/80 sticky top-28">
                    <div class="flex items-center space-x-3 mb-6">
                        <div class="p-2 bg-white text-black rounded-xl">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
                            </svg>
                        </div>
                        <h2 class="text-sm font-bold tracking-widest text-white uppercase">Create Task</h2>
                    </div>
                    
                    <form action="{{ url_for('add_task') }}" method="POST" class="space-y-6">
                        <div class="space-y-2">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Task Title *</label>
                            <input type="text" name="title" required placeholder="e.g., Validate container binding" 
                                   class="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/40 text-sm transition-all text-white placeholder-slate-700">
                        </div>
                        
                        <div class="space-y-2">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description (Optional)</label>
                            <textarea name="description" placeholder="Input details, links, or technical notes..." rows="3"
                                      class="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/40 text-sm transition-all text-white placeholder-slate-700"></textarea>
                        </div>
                        
                        <div class="space-y-2.5">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</label>
                            <div class="grid grid-cols-3 gap-2.5">
                                <label class="border border-white/5 bg-black/40 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all relative select-none group">
                                    <input type="radio" name="priority" value="Low" class="sr-only peer">
                                    <span class="text-xs font-bold text-slate-500 peer-checked:text-white transition-colors">Low</span>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-white/40 rounded-xl pointer-events-none"></div>
                                </label>
                                <label class="border border-white/5 bg-black/40 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all select-none relative group">
                                    <input type="radio" name="priority" value="Medium" checked class="sr-only peer">
                                    <span class="text-xs font-bold text-slate-400 peer-checked:text-white transition-colors">Medium</span>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-white/40 rounded-xl pointer-events-none"></div>
                                </label>
                                <label class="border border-white/5 bg-black/40 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all select-none relative group">
                                    <input type="radio" name="priority" value="High" class="sr-only peer">
                                    <span class="text-xs font-bold text-slate-400 peer-checked:text-white transition-colors">High</span>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-white/40 rounded-xl pointer-events-none"></div>
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" class="w-full py-4 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-white/5 active:scale-[0.99]">
                            <span>ADD TO BACKLOG</span>
                        </button>
                    </form>
                </div>
            </div>

            <!-- RIGHT: Task List (Col 7) -->
            <div class="lg:col-span-7 space-y-7">
                
                <!-- Counters -->
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-pepper border border-white/5 rounded-2xl p-5 shadow-lg flex flex-col">
                        <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">All Work</span>
                        <span class="text-2xl font-black text-white mt-2 mono leading-none">{{ stats.total }}</span>
                    </div>
                    <div class="bg-pepper border border-white/5 rounded-2xl p-5 shadow-lg flex flex-col">
                        <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active</span>
                        <span class="text-2xl font-black text-neutral-400 mt-2 mono leading-none">{{ stats.pending }}</span>
                    </div>
                    <div class="bg-pepper border border-white/5 rounded-2xl p-5 shadow-lg flex flex-col">
                        <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Done</span>
                        <span class="text-2xl font-black text-white mt-2 mono leading-none">{{ stats.completed }}</span>
                    </div>
                </div>

                <!-- List Section -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between px-1">
                        <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest">Task Directory</h2>
                    </div>

                    <div class="space-y-3.5">
                        {% if tasks %}
                            {% for task in tasks %}
                                <div class="bg-pepper border border-white/5 {% if task.completed %}opacity-45{% else %}hover:border-white/15 hover:bg-neutral-900/40{% endif %} rounded-2xl p-5 shadow-lg transition-all flex items-start justify-between gap-5 relative overflow-hidden group">
                                    <!-- Monochromatic High-Contrast Bar -->
                                    <div class="absolute left-0 top-0 bottom-0 w-1 {% if task.completed %}bg-neutral-800{% elif task.priority == 'High' %}bg-white{% elif task.priority == 'Medium' %}bg-neutral-500{% else %}bg-neutral-700{% endif %}"></div>
                                    
                                    <div class="flex items-start space-x-4 flex-grow pl-1">
                                        <!-- Complete/Incomplete Toggle -->
                                        <form action="{{ url_for('toggle_task', task_id=task.id) }}" method="POST" class="mt-0.5">
                                            <button type="submit" class="w-6 h-6 rounded-lg border border-white/10 {% if task.completed %}bg-white text-black border-white{% else %}bg-black hover:border-white text-transparent{% endif %} flex items-center justify-center transition-all focus:outline-none cursor-pointer">
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </button>
                                        </form>

                                        <!-- Text Elements -->
                                        <div class="flex-grow">
                                            <h3 class="text-sm font-bold tracking-tight {% if task.completed %}line-through text-slate-500{% else %}text-white{% endif %}">
                                                {{ task.title }}
                                            </h3>
                                            {% if task.description %}
                                                <p class="text-xs text-slate-400 mt-1.5 leading-relaxed {% if task.completed %}line-through text-slate-600{% endif %}">
                                                    {{ task.description }}
                                                </p>
                                            {% endif %}
                                            
                                            <!-- Mini Badges -->
                                            <div class="flex items-center space-x-2 mt-4">
                                                <span class="px-2.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border {% if task.priority == 'High' %}bg-white/10 border-white/25 text-white{% else %}bg-black/40 border-white/5 text-slate-400{% endif %}">
                                                    {{ task.priority }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Delete Button -->
                                    <form action="{{ url_for('delete_task', task_id=task.id) }}" method="POST" class="flex-shrink-0 mt-0.5">
                                        <button type="submit" class="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all focus:outline-none cursor-pointer">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            {% endfor %}
                        {% else %}
                            <!-- Empty Directory State -->
                            <div class="bg-pepper border border-dashed border-white/5 rounded-3xl py-14 px-6 text-center shadow-inner">
                                <div class="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                </div>
                                <h4 class="text-sm font-bold text-slate-300 uppercase tracking-widest">No Active Tasks</h4>
                                <p class="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">Your backlog is clear. Feed new tasks into the registry from the control board.</p>
                            </div>
                        {% endif %}
                    </div>
                </div>

            </div>

        </div>
    </main>

    <!-- FOOTER -->
    <footer class="bg-black text-slate-500 border-t border-white/5 py-10 mt-20 relative z-20">
        <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs gap-6">
            <div>
                <p class="font-bold text-slate-300 uppercase tracking-wider">Salt & Pepper Engine Suite</p>
                <p class="mt-1 text-slate-600">Premium design standards integrated into containerized Micro-workloads.</p>
            </div>
            <div class="flex items-center space-x-3">
                <span class="bg-neutral-900 border border-white/5 px-3 py-1.5 rounded-lg text-slate-300 font-semibold mono">Python 3.11</span>
                <span class="bg-neutral-900 border border-white/5 px-3 py-1.5 rounded-lg text-slate-300 font-semibold mono">Flask 3.0</span>
            </div>
        </div>
    </footer>
</body>
</html>
"""

@app.route("/")
def index():
    stats = {
        "total": len(tasks),
        "pending": len([t for t in tasks if not t["completed"]]),
        "completed": len([t for t in tasks if t["completed"]])
    }
    port = os.environ.get("PORT", "8080")
    return render_template_string(HTML_TEMPLATE, tasks=tasks, stats=stats, port=port)

@app.route("/add", methods=["POST"])
def add_task():
    global task_id_counter
    title = request.form.get("title")
    description = request.form.get("description", "")
    priority = request.form.get("priority", "Medium")
    
    if title:
        new_task = {
            "id": task_id_counter,
            "title": title,
            "description": description,
            "priority": priority,
            "completed": False
        }
        tasks.append(new_task)
        task_id_counter += 1
        
    return redirect(url_for("index"))

@app.route("/toggle/<int:task_id>", methods=["POST"])
def toggle_task(task_id):
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]
            break
    return redirect(url_for("index"))

@app.route("/delete/<int:task_id>", methods=["POST"])
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t["id"] != task_id]
    return redirect(url_for("index"))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=False)
