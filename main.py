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

# HTML/CSS (Jinja2 テンプレート) - 超プレミアムな「サイバー・スレート」テーマ
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flask Task Manager | Cloud Run Suite</title>
    <!-- Tailwind CSS (CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #030712; /* 超ダークグレー */
        }
        .mono {
            font-family: 'JetBrains Mono', monospace;
        }
        .glass-panel {
            background: rgba(17, 24, 39, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .neon-glow-blue {
            box-shadow: 0 0 25px -5px rgba(59, 130, 246, 0.2);
        }
        .neon-glow-indigo {
            box-shadow: 0 0 35px -10px rgba(99, 102, 241, 0.15);
        }
    </style>
</head>
<body class="min-h-screen text-slate-200 flex flex-col antialiased relative">
    <!-- 装飾的な背景のネオンオーラ -->
    <div class="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
    
    <!-- 細かいデジタルグリッド背景 -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

    <!-- ヘッダー -->
    <header class="glass-panel sticky top-0 z-40 border-b border-white/5 bg-gray-950/80 backdrop-blur-md">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/20">
                    F
                </div>
                <div>
                    <h1 class="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                        Flask Console
                        <span class="text-[9px] bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-md font-bold">LIVE</span>
                    </h1>
                    <p class="text-[10px] text-slate-400 font-medium">GCP Cloud Run Ready Deployment App</p>
                </div>
            </div>
            
            <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="mono text-[11px]">Port: {{ port }}</span>
                </div>
            </div>
        </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="flex-grow max-w-5xl w-full mx-auto px-6 py-10 relative z-10">
        <!-- プロダクション通知バナー -->
        <div class="mb-8 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex items-start space-x-3.5 shadow-lg">
            <div class="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div>
                <h4 class="text-xs font-bold text-slate-100">GCP Cloud Run デプロイ用にチューニング済み</h4>
                <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    本構成は完全なステートレス・サーバーレス実行に対応しています。データの完全な永続化を行いたい場合は、GCPが提供する <strong>Cloud Firestore</strong> や <strong>Cloud SQL (PostgreSQL)</strong> への接続を追加してください。
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- タスク追加フォーム (左側/12列中4列) -->
            <div class="lg:col-span-4">
                <div class="glass-panel rounded-3xl p-6 shadow-xl shadow-black/40 sticky top-28 neon-glow-indigo">
                    <div class="flex items-center space-x-2.5 mb-6">
                        <div class="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                        </div>
                        <h2 class="text-sm font-bold tracking-wide text-white">タスクの作成</h2>
                    </div>
                    
                    <form action="{{ url_for('add_task') }}" method="POST" class="space-y-5">
                        <div class="space-y-1.5">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">タスクタイトル *</label>
                            <input type="text" name="title" required placeholder="例: main.py のバインド変更を確認" 
                                   class="w-full px-4 py-3 bg-slate-900/60 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-white placeholder-slate-600">
                        </div>
                        
                        <div class="space-y-1.5">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">詳細説明 (任意)</label>
                            <textarea name="description" placeholder="作業内容のメモやログを入力してください..." rows="3"
                                      class="w-full px-4 py-3 bg-slate-900/60 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-white placeholder-slate-600"></textarea>
                        </div>
                        
                        <div class="space-y-2">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">優先度</label>
                            <div class="grid grid-cols-3 gap-2">
                                <label class="border border-white/5 bg-slate-900/40 rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 transition-all select-none relative group">
                                    <input type="radio" name="priority" value="Low" class="sr-only peer">
                                    <span class="text-xs font-semibold text-slate-400 peer-checked:text-blue-400 transition-colors">Low</span>
                                    <span class="w-2 h-2 rounded-full bg-slate-600 mt-1.5 group-hover:scale-110 transition-transform"></span>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-blue-500/50 rounded-xl pointer-events-none"></div>
                                </label>
                                <label class="border border-white/5 bg-slate-900/40 rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 transition-all select-none relative group">
                                    <input type="radio" name="priority" value="Medium" checked class="sr-only peer">
                                    <span class="text-xs font-semibold text-slate-400 peer-checked:text-amber-400 transition-colors">Medium</span>
                                    <span class="w-2 h-2 rounded-full bg-amber-400/80 mt-1.5 group-hover:scale-110 transition-transform"></span>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-amber-500/50 rounded-xl pointer-events-none"></div>
                                </label>
                                <label class="border border-white/5 bg-slate-900/40 rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 transition-all select-none relative group">
                                    <input type="radio" name="priority" value="High" class="sr-only peer">
                                    <span class="text-xs font-semibold text-slate-400 peer-checked:text-rose-400 transition-colors">High</span>
                                    <span class="w-2 h-2 rounded-full bg-rose-500 mt-1.5 group-hover:scale-110 transition-transform"></span>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-rose-500/50 rounded-xl pointer-events-none"></div>
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold tracking-wider shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:translate-y-[-1px] active:translate-y-0 transition-all flex items-center justify-center space-x-2 cursor-pointer border border-white/10">
                            <span>タスクを追加する</span>
                        </button>
                    </form>
                </div>
            </div>

            <!-- タスク一覧 (右側/12列中8列) -->
            <div class="lg:col-span-8 space-y-6">
                <!-- 統計情報 -->
                <div class="grid grid-cols-3 gap-4">
                    <div class="glass-panel rounded-2xl p-5 shadow-lg flex flex-col">
                        <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">すべてのタスク</span>
                        <span class="text-2xl font-extrabold text-white mt-2 mono leading-none">{{ stats.total }}</span>
                    </div>
                    <div class="glass-panel rounded-2xl p-5 shadow-lg flex flex-col">
                        <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">進行中</span>
                        <span class="text-2xl font-extrabold text-amber-400 mt-2 mono leading-none">{{ stats.pending }}</span>
                    </div>
                    <div class="glass-panel rounded-2xl p-5 shadow-lg flex flex-col">
                        <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">完了</span>
                        <span class="text-2xl font-extrabold text-emerald-400 mt-2 mono leading-none">{{ stats.completed }}</span>
                    </div>
                </div>

                <!-- タスクリスト -->
                <div class="space-y-3.5">
                    {% if tasks %}
                        {% for task in tasks %}
                            <div class="glass-panel {% if task.completed %}opacity-60 bg-slate-900/40{% else %}hover:border-white/10 hover:bg-slate-900/50{% endif %} rounded-2xl p-5 shadow-lg transition-all flex items-start justify-between gap-5 relative overflow-hidden group">
                                <!-- 優先度に応じたサイドカラーバー -->
                                <div class="absolute left-0 top-0 bottom-0 w-1 {% if task.completed %}bg-slate-800{% elif task.priority == 'High' %}bg-gradient-to-b from-rose-500 to-rose-600{% elif task.priority == 'Medium' %}bg-gradient-to-b from-amber-400 to-amber-500{% else %}bg-slate-600{% endif %}"></div>
                                
                                <div class="flex items-start space-x-4 flex-grow pl-1">
                                    <!-- 完了トグル -->
                                    <form action="{{ url_for('toggle_task', task_id=task.id) }}" method="POST" class="mt-0.5">
                                        <button type="submit" class="w-6 h-6 rounded-lg border border-white/10 {% if task.completed %}bg-emerald-500 border-emerald-500 text-slate-950{% else %}bg-slate-900 hover:border-blue-500 text-transparent{% endif %} flex items-center justify-center transition-all focus:outline-none cursor-pointer">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </button>
                                    </form>

                                    <!-- タイトルと説明 -->
                                    <div class="flex-grow">
                                        <h3 class="text-sm font-bold tracking-tight {% if task.completed %}line-through text-slate-500{% else %}text-slate-100{% endif %}">
                                            {{ task.title }}
                                        </h3>
                                        {% if task.description %}
                                            <p class="text-xs text-slate-400 mt-1.5 leading-relaxed {% if task.completed %}line-through text-slate-600{% endif %}">
                                                {{ task.description }}
                                            </p>
                                        {% endif %}
                                        
                                        <!-- バッジ -->
                                        <div class="flex items-center space-x-2 mt-3.5">
                                            {% if task.priority == 'High' %}
                                                <span class="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-500/10 border border-rose-500/20 text-rose-400 tracking-wider">HIGH</span>
                                            {% elif task.priority == 'Medium' %}
                                                <span class="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-500/10 border border-amber-500/20 text-amber-400 tracking-wider">MEDIUM</span>
                                            {% else %}
                                                <span class="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-800 border border-slate-700/60 text-slate-400 tracking-wider">LOW</span>
                                            {% endif %}
                                        </div>
                                    </div>
                                </div>

                                <!-- 削除ボタン -->
                                <form action="{{ url_for('delete_task', task_id=task.id) }}" method="POST" class="flex-shrink-0 mt-0.5">
                                    <button type="submit" class="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all focus:outline-none cursor-pointer border border-transparent hover:border-rose-500/10">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        {% endfor %}
                    {% else %}
                        <!-- タスクなし空ステート -->
                        <div class="glass-panel border-dashed border-white/5 rounded-3xl py-14 px-6 text-center shadow-inner">
                            <div class="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-bold text-slate-300">アクティブタスクがありません</h4>
                            <p class="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">左側のコントロールパネルから、新しいタスクを登録してシミュレーションを開始してください。</p>
                        </div>
                    {% endif %}
                </div>
            </div>

        </div>
    </main>

    <!-- フッター -->
    <footer class="bg-gray-950 text-slate-500 border-t border-white/5 py-10 mt-20 relative z-20">
        <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs gap-6">
            <div>
                <p class="font-bold text-slate-300">Flask &amp; GCP Cloud Run Engine</p>
                <p class="mt-1 text-slate-500">本番運用に必要な構成はすべて完璧にロードされています。</p>
            </div>
            <div class="flex items-center space-x-3">
                <span class="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg text-slate-300 font-semibold mono">Python 3.11</span>
                <span class="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg text-slate-300 font-semibold mono">Flask 3.0</span>
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
