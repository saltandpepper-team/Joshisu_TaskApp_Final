import os
from flask import Flask, render_template_string, request, redirect, url_for

app = Flask(__name__)

# インメモリのタスクデータストア (簡単なデモ用、サーバー再起動でリセットされます)
tasks = [
    {
        "id": 1,
        "title": "Cloud Run のポート設定を確認する",
        "description": "環境変数 PORT からポート番号を読み取り、0.0.0.0 でバインドする設定にする。",
        "priority": "High",
        "completed": True
    },
    {
        "id": 2,
        "title": "requirements.txt をデプロイ環境に含める",
        "description": "Flask と gunicorn を requirements.txt に記載し、Cloud Run のビルド時にインストールされるようにする。",
        "priority": "High",
        "completed": True
    },
    {
        "id": 3,
        "title": "Dockerfile を作成してビルドする",
        "description": "python:3.11-slim をベースにした軽量な Dockerfile を作成して本番用にビルド・プッシュする。",
        "priority": "Medium",
        "completed": False
    },
    {
        "id": 4,
        "title": "タスク管理アプリの UI をさらにブラッシュアップする",
        "description": "Tailwind CSS を使って、モダンで視認性の高い、レスポンシブなダッシュボードを構築する。",
        "priority": "Low",
        "completed": False
    }
]
task_id_counter = 5

# HTML/CSS (Jinja2 テンプレート)
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flask Task Manager (Cloud Run)</title>
    <!-- Tailwind CSS (CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
        }
        .mono {
            font-family: 'JetBrains Mono', monospace;
        }
    </style>
</head>
<body class="min-h-screen text-slate-800 flex flex-col">
    <!-- ヘッダー -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">
                    T
                </div>
                <div>
                    <h1 class="text-xl font-bold tracking-tight text-slate-900">Flask Task Manager</h1>
                    <p class="text-xs text-slate-500">GCP Cloud Run Production Mode</p>
                </div>
            </div>
            <div class="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Port: {{ port }} (Active)</span>
            </div>
        </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="flex-grow max-w-4xl w-full mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <!-- タスク追加フォーム (左側/上部) -->
            <div class="md:col-span-1">
                <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                    <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        新規タスク追加
                    </h2>
                    
                    <form action="{{ url_for('add_task') }}" method="POST" class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">タスク名 *</label>
                            <input type="text" name="title" required placeholder="例: 報告書の作成" 
                                   class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all">
                        </div>
                        
                        <div>
                            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">説明 (任意)</label>
                            <textarea name="description" placeholder="タスクの詳細を入力..." rows="3"
                                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">優先度</label>
                            <div class="grid grid-cols-3 gap-2">
                                <label class="border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="radio" name="priority" value="Low" class="sr-only peer">
                                    <span class="text-xs font-medium text-slate-600">Low</span>
                                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1"></span>
                                </label>
                                <label class="border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="radio" name="priority" value="Medium" checked class="sr-only peer">
                                    <span class="text-xs font-medium text-slate-600">Medium</span>
                                    <span class="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1"></span>
                                </label>
                                <label class="border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="radio" name="priority" value="High" class="sr-only peer">
                                    <span class="text-xs font-medium text-slate-600">High</span>
                                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1"></span>
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-100 transition-all flex items-center justify-center">
                            タスクを追加
                        </button>
                    </form>
                </div>
            </div>

            <!-- タスク一覧 (右側/下部) -->
            <div class="md:col-span-2 space-y-4">
                <!-- 統計情報 -->
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">合計タスク</span>
                        <span class="text-2xl font-bold text-slate-800 mt-1 mono">{{ stats.total }}</span>
                    </div>
                    <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">進行中</span>
                        <span class="text-2xl font-bold text-yellow-600 mt-1 mono">{{ stats.pending }}</span>
                    </div>
                    <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">完了済み</span>
                        <span class="text-2xl font-bold text-green-600 mt-1 mono">{{ stats.completed }}</span>
                    </div>
                </div>

                <!-- タスクリスト -->
                <div class="space-y-3">
                    {% if tasks %}
                        {% for task in tasks %}
                            <div class="bg-white border {% if task.completed %}border-slate-100 bg-slate-50/50{% else %}border-slate-200 hover:shadow-md{% endif %} rounded-2xl p-5 shadow-sm transition-all flex items-start justify-between gap-4">
                                <div class="flex items-start space-x-3.5 flex-grow">
                                    <!-- 完了トグル -->
                                    <form action="{{ url_for('toggle_task', task_id=task.id) }}" method="POST" class="mt-1">
                                        <button type="submit" class="w-6 h-6 rounded-lg border-2 {% if task.completed %}bg-green-500 border-green-500 text-white{% else %}border-slate-300 hover:border-slate-400 text-transparent{% endif %} flex items-center justify-center transition-all focus:outline-none">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </button>
                                    </form>

                                    <!-- タイトルと説明 -->
                                    <div class="flex-grow">
                                        <h3 class="text-sm font-semibold {% if task.completed %}line-through text-slate-400{% else %}text-slate-900{% endif %}">
                                            {{ task.title }}
                                        </h3>
                                        {% if task.description %}
                                            <p class="text-xs text-slate-500 mt-1 {% if task.completed %}line-through text-slate-300{% endif %}">
                                                {{ task.description }}
                                            </p>
                                        {% endif %}
                                        
                                        <!-- バッジ -->
                                        <div class="flex items-center space-x-2 mt-3">
                                            {% if task.priority == 'High' %}
                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">High</span>
                                            {% elif task.priority == 'Medium' %}
                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">Medium</span>
                                            {% else %}
                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Low</span>
                                            {% endif %}
                                        </div>
                                    </div>
                                </div>

                                <!-- 削除ボタン -->
                                <form action="{{ url_for('delete_task', task_id=task.id) }}" method="POST" class="flex-shrink-0">
                                    <button type="submit" class="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        {% endfor %}
                    {% else %}
                        <div class="bg-white border border-dashed border-slate-200 rounded-2xl py-12 px-4 text-center">
                            <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            <h4 class="text-sm font-semibold text-slate-600">タスクがありません</h4>
                            <p class="text-xs text-slate-400 mt-1">左のフォームから最初のタスクを追加してみましょう！</p>
                        </div>
                    {% endif %}
                </div>
            </div>

        </div>
    </main>

    <!-- フッター -->
    <footer class="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-12">
        <div class="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs gap-4">
            <div>
                <p class="font-medium text-slate-300">Flask Cloud Run App</p>
                <p class="mt-1 text-slate-500">Designed to be built with a light-weight container and executed serverlessly.</p>
            </div>
            <div class="flex items-center space-x-4">
                <span class="bg-slate-800 px-2.5 py-1 rounded text-slate-300 mono">Python 3.11</span>
                <span class="bg-slate-800 px-2.5 py-1 rounded text-slate-300 mono">Flask 3.0</span>
            </div>
        </div>
    </footer>
</body>
</html>
"""

@app.route("/")
def index():
    # 統計情報の計算
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
    # Cloud Run では環境変数 PORT で指定されたポートで待機する必要があります
    # デフォルトのポートは 8080 です
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=False)
