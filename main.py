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

# HTML/CSS (Jinja2 テンプレート) - 劇的に洗練されたモダンデザイン
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flask Task Manager | Cloud Run Ready</title>
    <!-- Tailwind CSS (CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: radial-gradient(at top left, #f8fafc, #f1f5f9);
        }
        .mono {
            font-family: 'JetBrains Mono', monospace;
        }
        .glass {
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
    </style>
</head>
<body class="min-h-screen text-slate-800 flex flex-col antialiased">
    <!-- 装飾的な背景の光（SaaS風） -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- ヘッダー -->
    <header class="glass sticky top-0 z-30 border-b border-slate-200/80 shadow-sm transition-all">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-3.5">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10">
                    F
                </div>
                <div>
                    <h1 class="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Flask Task Manager</h1>
                    <p class="text-[10px] font-bold text-indigo-600/80 uppercase tracking-widest">GCP Cloud Run Production Mode</p>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-700">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="mono">Port: {{ port }} (Active)</span>
                </div>
            </div>
        </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="flex-grow max-w-5xl w-full mx-auto px-6 py-10 relative z-10">
        <!-- アナウンスメントバー -->
        <div class="mb-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start space-x-3">
            <div class="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div>
                <h4 class="text-xs font-bold text-slate-900">ステートレスコンテナ上のご注意</h4>
                <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    本アプリは Cloud Run 用に軽量化されています。現在はデモ用としてインメモリ保存を行っているため、アイドル時や自動スケーリングによるコンテナ再起動のタイミングでタスクは初期状態にリセットされます。本番運用では Cloud Firestore や Cloud SQL などのデータベースをご利用ください。
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- タスク追加フォーム (左側/3分割中4列) -->
            <div class="lg:col-span-4">
                <div class="glass border border-white/60 rounded-3xl p-6 shadow-xl shadow-slate-200/50 sticky top-28">
                    <div class="flex items-center space-x-2 mb-6">
                        <div class="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2".5 d="M12 4v16m8-8H4"></path>
                            </svg>
                        </div>
                        <h2 class="text-base font-bold text-slate-900">タスクを作成</h2>
                    </div>
                    
                    <form action="{{ url_for('add_task') }}" method="POST" class="space-y-5">
                        <div class="space-y-1.5">
                            <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">タスクタイトル *</label>
                            <input type="text" name="title" required placeholder="例: Dockerfileのテストビルド" 
                                   class="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm transition-all placeholder-slate-400">
                        </div>
                        
                        <div class="space-y-1.5">
                            <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">詳細説明 (任意)</label>
                            <textarea name="description" placeholder="作業内容やメモを入力してください..." rows="3"
                                      class="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm transition-all placeholder-slate-400"></textarea>
                        </div>
                        
                        <div class="space-y-2">
                            <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">優先度レベル</label>
                            <div class="grid grid-cols-3 gap-2.5">
                                <label class="border border-slate-200 rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50 transition-all select-none relative group">
                                    <input type="radio" name="priority" value="Low" class="sr-only peer">
                                    <span class="text-xs font-semibold text-slate-500 peer-checked:text-blue-600 transition-colors">Low</span>
                                    <span class="w-2 h-2 rounded-full bg-slate-300 mt-1.5 group-hover:scale-110 transition-transform"></span>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-blue-500/80 rounded-xl pointer-events-none"></div>
                                </label>
                                <label class="border border-slate-200 rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50 transition-all select-none relative group">
                                    <input type="radio" name="priority" value="Medium" checked class="sr-only peer">
                                    <span class="text-xs font-semibold text-slate-500 peer-checked:text-amber-600 transition-colors">Medium</span>
                                    <span class="w-2 h-2 rounded-full bg-amber-400 mt-1.5 group-hover:scale-110 transition-transform"></span>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-amber-500/80 rounded-xl pointer-events-none"></div>
                                </label>
                                <label class="border border-slate-200 rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50 transition-all select-none relative group">
                                    <input type="radio" name="priority" value="High" class="sr-only peer">
                                    <span class="text-xs font-semibold text-slate-500 peer-checked:text-rose-600 transition-colors">High</span>
                                    <span class="w-2 h-2 rounded-full bg-rose-500 mt-1.5 group-hover:scale-110 transition-transform"></span>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-rose-500/80 rounded-xl pointer-events-none"></div>
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold tracking-wider shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 hover:translate-y-[-1px] active:translate-y-0 transition-all flex items-center justify-center space-x-2 cursor-pointer">
                            <span>タスクを追加する</span>
                        </button>
                    </form>
                </div>
            </div>

            <!-- タスク一覧 (右側/3分割中8列) -->
            <div class="lg:col-span-8 space-y-6">
                <!-- 統計情報 -->
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-white/60 border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">すべてのタスク</span>
                        <span class="text-3xl font-extrabold text-slate-900 mt-2 mono leading-none">{{ stats.total }}</span>
                    </div>
                    <div class="bg-white/60 border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">進行中</span>
                        <span class="text-3xl font-extrabold text-amber-600 mt-2 mono leading-none">{{ stats.pending }}</span>
                    </div>
                    <div class="bg-white/60 border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">完了</span>
                        <span class="text-3xl font-extrabold text-emerald-600 mt-2 mono leading-none">{{ stats.completed }}</span>
                    </div>
                </div>

                <!-- タスクリスト -->
                <div class="space-y-3.5">
                    {% if tasks %}
                        {% for task in tasks %}
                            <div class="bg-white/80 border {% if task.completed %}border-slate-100 bg-slate-50/40{% else %}border-slate-200/80 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100/80{% endif %} rounded-2xl p-5 shadow-sm transition-all flex items-start justify-between gap-5 relative overflow-hidden group">
                                <!-- 優先度に応じたサイドカラーバー -->
                                <div class="absolute left-0 top-0 bottom-0 w-1.5 {% if task.completed %}bg-slate-200{% elif task.priority == 'High' %}bg-rose-500{% elif task.priority == 'Medium' %}bg-amber-400{% else %}bg-slate-300{% endif %}"></div>
                                
                                <div class="flex items-start space-x-4 flex-grow pl-2">
                                    <!-- 完了トグル -->
                                    <form action="{{ url_for('toggle_task', task_id=task.id) }}" method="POST" class="mt-0.5">
                                        <button type="submit" class="w-6 h-6 rounded-lg border-2 {% if task.completed %}bg-emerald-500 border-emerald-500 text-white{% else %}border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-transparent{% endif %} flex items-center justify-center transition-all focus:outline-none cursor-pointer">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </button>
                                    </form>

                                    <!-- タイトルと説明 -->
                                    <div class="flex-grow">
                                        <h3 class="text-sm font-bold tracking-tight {% if task.completed %}line-through text-slate-400{% else %}text-slate-900{% endif %}">
                                            {{ task.title }}
                                        </h3>
                                        {% if task.description %}
                                            <p class="text-xs text-slate-500 mt-1.5 leading-relaxed {% if task.completed %}line-through text-slate-300{% endif %}">
                                                {{ task.description }}
                                            </p>
                                        {% endif %}
                                        
                                        <!-- バッジ -->
                                        <div class="flex items-center space-x-2 mt-3.5">
                                            {% if task.priority == 'High' %}
                                                <span class="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500/10 text-rose-600 border border-rose-500/10">HIGH</span>
                                            {% elif task.priority == 'Medium' %}
                                                <span class="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/10 text-amber-700 border border-amber-500/10">MEDIUM</span>
                                            {% else %}
                                                <span class="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-500/10 text-slate-600 border border-slate-500/10">LOW</span>
                                            {% endif %}
                                        </div>
                                    </div>
                                </div>

                                <!-- 削除ボタン -->
                                <form action="{{ url_for('delete_task', task_id=task.id) }}" method="POST" class="flex-shrink-0 mt-0.5">
                                    <button type="submit" class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50/80 rounded-xl transition-all focus:outline-none cursor-pointer">
                                        <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        {% endfor %}
                    {% else %}
                        <!-- タスクなしステート -->
                        <div class="bg-white/50 border border-dashed border-slate-200 rounded-3xl py-14 px-6 text-center shadow-inner">
                            <div class="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-bold text-slate-700">準備は完了です</h4>
                            <p class="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">左側のフォームからタスクを登録して、プロダクション運用のシミュレーションを始めましょう。</p>
                        </div>
                    {% endif %}
                </div>
            </div>

        </div>
    </main>

    <!-- フッター -->
    <footer class="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 mt-20 relative z-20">
        <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs gap-6">
            <div>
                <p class="font-bold text-slate-200">Flask &amp; GCP Cloud Run Suite</p>
                <p class="mt-1 text-slate-500">デプロイ設定を最適化したメインファイルと依存関係ファイルを別ファイルとして書き出しています。</p>
            </div>
            <div class="flex items-center space-x-3.5">
                <span class="bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 font-semibold border border-slate-700/50 mono">Python 3.11</span>
                <span class="bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 font-semibold border border-slate-700/50 mono">Flask 3.0</span>
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
