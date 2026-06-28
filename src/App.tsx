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
    title: "Cloud Run のポート設定を確認する",
    description: "環境変数 PORT からポート番号を読み取り、0.0.0.0 でバインドする設定にする。",
    priority: "High",
    completed: true
  },
  {
    id: 2,
    title: "requirements.txt をデプロイ環境に含める",
    description: "Flask と gunicorn を requirements.txt に記載し、Cloud Run のビルド時にインストールされるようにする。",
    priority: "High",
    completed: true
  },
  {
    id: 3,
    title: "Dockerfile を作成してビルドする",
    description: "python:3.11-slim をベースにした軽量な Dockerfile を作成して本番用にビルド・プッシュする。",
    priority: "Medium",
    completed: false
  },
  {
    id: 4,
    title: "タスク管理アプリの UI をさらにブラッシュアップする",
    description: "Tailwind CSS を使って、モダンで視認性の高い、レスポンシブなダッシュボードを構築する。",
    priority: "Low",
    completed: false
  }
];

const DOCKERFILE_CONTENT = `# 軽量な Python スリムイメージをベースに使用
FROM python:3.11-slim

# コンテナ内の作業ディレクトリを設定
WORKDIR /app

# 依存関係ファイルをコピーしてインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY main.py .

# 本番環境用に環境変数を最適化
ENV PYTHONUNBUFFERED=1

# gunicorn を使用して起動（Cloud Run の PORT 環境変数に対応）
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--threads", "8", "--timeout", "0", "main:app"]`;

const DEPLOY_COMMANDS = `# 1. gcloud CLI のログインとプロジェクト設定
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]

# 2. ソースコードから直接 Cloud Run にデプロイ (自動ビルド＆デプロイ)
# 起動ポートは自動的に検出されます
gcloud run deploy flask-task-manager \\
  --source . \\
  --region asia-northeast1 \\
  --allow-unauthenticated`;

const FLASK_MAIN_PREVIEW = `import os
from flask import Flask, render_template_string, request, redirect, url_for

app = Flask(__name__)

# インメモリのタスクストア (Cloud Runの特性に合わせたステートレス設計を推奨)
tasks = [...]

@app.route("/")
def index():
    stats = {...}
    port = os.environ.get("PORT", "8080")
    return render_template_string(HTML_TEMPLATE, tasks=tasks, stats=stats, port=port)

# ... (中略: /add, /toggle/<id>, /delete/<id> エンドポイント)

if __name__ == "__main__":
    # Cloud Run では $PORT 環境変数でバインドするポート番号を受け取る必要があります
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* 魅惑的なネオンバックドロップオーラ */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* 未来的なデジタルグリッド（極細・高精度） */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* ヘッダー */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl" id="main-header">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-500/10">
              F
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Flask Cloud Run Suite
                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-lg font-bold tracking-wider">PREVIEW</span>
              </h1>
              <p className="text-xs text-slate-400">GCP Cloud Run に最適化された最高峰のデザイン ＆ デプロイメントガイド</p>
            </div>
          </div>

          {/* 洗練されたプレミアム・ネオンタブ */}
          <div className="flex bg-slate-900/60 border border-white/5 p-1.5 rounded-2xl shadow-2xl backdrop-blur-md relative">
            <button 
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-300 flex items-center space-x-2 relative cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'dashboard' && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10 shadow-lg shadow-blue-500/20 border border-blue-400/20"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <Layers className="w-3.5 h-3.5" />
              <span>ダッシュボード</span>
            </button>
            <button 
              id="tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-300 flex items-center space-x-2 relative cursor-pointer ${
                activeTab === 'guide' 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'guide' && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10 shadow-lg shadow-blue-500/20 border border-blue-400/20"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <Server className="w-3.5 h-3.5" />
              <span>デプロイメント構成</span>
            </button>
          </div>
        </div>
      </header>

      {/* メインレイアウト */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-10 relative z-10">
        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 左側: コントロール ＆ 統計サマリー */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* 美しいインフォグラフィックカード */}
              <div className="relative overflow-hidden bg-slate-900/40 border border-indigo-500/10 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-start space-x-4">
                  <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl shadow-lg shadow-blue-500/5">
                    <CloudLightning className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                      ステートレス同期
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      現在ワークスペースのルート直下に <strong>main.py</strong> と <strong>requirements.txt</strong> が生成済みです。そのまま本番デプロイが可能です。
                    </p>
                  </div>
                </div>
              </div>

              {/* タスク登録カード */}
              <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>タスクを作成</span>
                </h2>
                
                <form onSubmit={addTask} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">タスク名 *</label>
                    <input 
                      id="input-task-title"
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required 
                      placeholder="例: main.py の動作検証" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-white placeholder-slate-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">詳細・ログ情報 (任意)</label>
                    <textarea 
                      id="input-task-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="詳細なタスク情報やメモ..." 
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-white placeholder-slate-700"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">優先度</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Low', 'Medium', 'High'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`border rounded-2xl py-2.5 flex flex-col items-center justify-center cursor-pointer transition-all relative text-xs font-extrabold ${
                            priority === p 
                              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 ring-2 ring-indigo-500/15' 
                              : 'border-slate-800 bg-slate-950 text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                          }`}
                        >
                          <span>{p}</span>
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                            p === 'High' ? 'bg-rose-500' : p === 'Medium' ? 'bg-amber-400' : 'bg-slate-600'
                          }`}></span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    id="btn-add-task"
                    type="submit" 
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:brightness-110 active:scale-[0.99] text-white rounded-2xl text-xs font-bold tracking-wider shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center cursor-pointer border border-white/5"
                  >
                    登録する
                  </button>
                </form>
              </div>
            </div>

            {/* 右カラム: 統計 ＆ タスクビュー */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 統計表示カード */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 shadow-xl flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">すべてのタスク</span>
                  <span className="text-3xl font-extrabold text-white mt-1.5 font-mono">{stats.total}</span>
                </div>
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 shadow-xl flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">実行中</span>
                  <span className="text-3xl font-extrabold text-amber-400 mt-1.5 font-mono">{stats.pending}</span>
                </div>
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 shadow-xl flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">完了</span>
                  <span className="text-3xl font-extrabold text-emerald-400 mt-1.5 font-mono">{stats.completed}</span>
                </div>
              </div>

              {/* タスクの美麗表示エリア */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">タスク一覧</h2>
                  <button 
                    id="btn-reset"
                    onClick={() => setTasks(INITIAL_TASKS)}
                    className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1.5 font-bold transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    初期サンプルに戻す
                  </button>
                </div>

                <div className="space-y-3.5">
                  <AnimatePresence mode="popLayout">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <motion.div
                          layout
                          key={task.id}
                          initial={{ opacity: 0, scale: 0.98, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`bg-slate-900/40 border relative overflow-hidden transition-all duration-300 ${
                            task.completed 
                              ? 'border-white/5 bg-slate-950/20 opacity-60' 
                              : 'border-white/5 bg-slate-900/30 hover:border-white/10 hover:shadow-xl hover:shadow-slate-950'
                          } rounded-3xl p-5 flex items-start justify-between gap-4`}
                        >
                          {/* 優先度別に側面に美しいグローカラーバー */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            task.completed 
                              ? 'bg-slate-800' 
                              : task.priority === 'High' 
                                ? 'bg-gradient-to-b from-rose-500 to-rose-600' 
                                : task.priority === 'Medium' 
                                  ? 'bg-gradient-to-b from-amber-400 to-amber-500' 
                                  : 'bg-slate-600'
                          }`} />

                          <div className="flex items-start space-x-4 flex-grow pl-2">
                            {/* 完了状態チェックボタン */}
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                task.completed 
                                  ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105' 
                                  : 'border-white/10 hover:border-indigo-400 hover:bg-indigo-500/5 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                            </button>

                            {/* 内容情報 */}
                            <div className="flex-grow">
                              <h3 className={`text-sm font-bold tracking-tight transition-all duration-200 ${
                                task.completed ? 'line-through text-slate-600' : 'text-slate-100'
                              }`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className={`text-xs text-slate-400 mt-2 leading-relaxed ${
                                  task.completed ? 'line-through text-slate-700' : ''
                                }`}>
                                  {task.description}
                                </p>
                              )}
                              
                              {/* 優先度別バッジ */}
                              <div className="flex items-center space-x-2 mt-4">
                                {task.priority === 'High' ? (
                                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-500/10 border border-rose-500/20 text-rose-400 tracking-wider">HIGH</span>
                                ) : task.priority === 'Medium' ? (
                                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-500/10 border border-amber-500/20 text-amber-400 tracking-wider">MEDIUM</span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-800 border border-slate-700/60 text-slate-400 tracking-wider">LOW</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 削除ボタン */}
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all flex-shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl py-14 px-4 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <h4 className="text-sm font-bold text-slate-400">現在タスクはありません</h4>
                        <p className="text-xs text-slate-600 mt-1.5">左のパネルからタスクを登録してください。</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* デプロイ手順タブ (ハイエンドなコードコンソール設計) */
          <div className="bg-slate-950 border border-white/5 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[580px] backdrop-blur-xl">
            {/* 左側ファイルブラウザ */}
            <div className="md:col-span-1 bg-slate-950/80 border-r border-white/5 p-5 space-y-1.5">
              <div className="px-3 py-2 mb-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">構成ファイル</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">デプロイを完璧に行うための全ファイル構成です</p>
              </div>
              
              <button 
                id="btn-subtab-main"
                onClick={() => setActiveGuideSubTab('main')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'main' 
                    ? 'bg-slate-900 border border-white/5 text-blue-400 shadow-md shadow-slate-950/40' 
                    : 'text-slate-500 hover:bg-slate-900/40 hover:text-slate-300'
                }`}
              >
                <Code className="w-4 h-4" />
                <div className="flex-grow">
                  <p>main.py</p>
                  <p className="text-[9px] font-normal text-slate-500">Flask エントリポイント</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button 
                id="btn-subtab-req"
                onClick={() => setActiveGuideSubTab('requirements')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'requirements' 
                    ? 'bg-slate-900 border border-white/5 text-blue-400 shadow-md shadow-slate-950/40' 
                    : 'text-slate-500 hover:bg-slate-900/40 hover:text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <div className="flex-grow">
                  <p>requirements.txt</p>
                  <p className="text-[9px] font-normal text-slate-500">外部パッケージ依存関係</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button 
                id="btn-subtab-dock"
                onClick={() => setActiveGuideSubTab('dockerfile')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'dockerfile' 
                    ? 'bg-slate-900 border border-white/5 text-blue-400 shadow-md shadow-slate-950/40' 
                    : 'text-slate-500 hover:bg-slate-900/40 hover:text-slate-300'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <div className="flex-grow">
                  <p>Dockerfile</p>
                  <p className="text-[9px] font-normal text-slate-500">コンテナ構成定義</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button 
                id="btn-subtab-deploy"
                onClick={() => setActiveGuideSubTab('deploy')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'deploy' 
                    ? 'bg-slate-900 border border-white/5 text-blue-400 shadow-md shadow-slate-950/40' 
                    : 'text-slate-500 hover:bg-slate-900/40 hover:text-slate-300'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <div className="flex-grow">
                  <p>Deploy コマンド</p>
                  <p className="text-[9px] font-normal text-slate-500">最速コマンドライン指示</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>
            </div>

            {/* 右側コード＆指示説明 */}
            <div className="md:col-span-3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {activeGuideSubTab === 'main' && 'main.py (Flask 起動本体)'}
                      {activeGuideSubTab === 'requirements' && 'requirements.txt (パッケージ構成)'}
                      {activeGuideSubTab === 'dockerfile' && 'Dockerfile (コンテナ設定)'}
                      {activeGuideSubTab === 'deploy' && 'GCP Cloud Run デプロイコマンド'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {activeGuideSubTab === 'main' && '環境変数から自動で PORT 番号を取得し、Cloud Run のネットワーク要件を満たす本番仕様のコードです。'}
                      {activeGuideSubTab === 'requirements' && '軽量化された Flask サーバーと、デプロイ時に必須となる Web サーバーである gunicorn を定義。'}
                      {activeGuideSubTab === 'dockerfile' && 'Cloud Run のコールドスタート（起動速度）を最速にするための最小構成スリムイメージベース設定。'}
                      {activeGuideSubTab === 'deploy' && 'gcloud コマンドを使って、ローカル環境または GCP Cloud Shell から直接デプロイする最も簡単な手順。'}
                    </p>
                  </div>

                  {/* コピーボタン */}
                  <button
                    onClick={() => {
                      let text = '';
                      if (activeGuideSubTab === 'main') text = FLASK_MAIN_PREVIEW;
                      else if (activeGuideSubTab === 'requirements') text = `Flask==3.0.3\ngunicorn==22.0.0`;
                      else if (activeGuideSubTab === 'dockerfile') text = DOCKERFILE_CONTENT;
                      else text = DEPLOY_COMMANDS;
                      copyToClipboard(text, activeGuideSubTab);
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all border border-white/5 cursor-pointer"
                  >
                    {copiedText === activeGuideSubTab ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-extrabold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>コピー</span>
                      </>
                    )}
                  </button>
                </div>

                {/* コード表示窓 (擬似シンタックスハイライト) */}
                <div className="mt-5 bg-slate-950 rounded-2xl p-5 overflow-x-auto border border-white/5 shadow-inner max-h-[380px] relative">
                  <div className="absolute top-3.5 right-4 text-[9px] bg-slate-900 border border-white/5 text-slate-500 font-mono px-2.5 py-1 rounded uppercase font-extrabold tracking-wider">
                    {activeGuideSubTab}
                  </div>
                  <pre className="text-slate-300 font-mono text-xs leading-relaxed pt-2">
                    {activeGuideSubTab === 'main' && (
                      <code>
                        <span className="text-purple-400">import</span> os{"\n"}
                        <span className="text-purple-400">from</span> flask <span className="text-purple-400">import</span> Flask, render_template_string, request, redirect, url_for{"\n\n"}
                        app = Flask(__name__){"\n\n"}
                        <span className="text-slate-500"># インメモリのタスクストア</span>{"\n"}
                        tasks = {"[...]"} {"\n\n"}
                        <span className="text-blue-400">@app.route</span>(<span className="text-emerald-400">"/"</span>){"\n"}
                        <span className="text-purple-400">def</span> <span className="text-yellow-400">index</span>():{"\n"}
                        {"    "}stats = {"{...}"}{"\n"}
                        {"    "}port = os.environ.get(<span className="text-emerald-400">"PORT"</span>, <span className="text-emerald-400">"8080"</span>){"\n"}
                        {"    "}<span className="text-purple-400">return</span> render_template_string(HTML_TEMPLATE, tasks=tasks, stats=stats, port=port){"\n\n"}
                        <span className="text-slate-500"># ... (中略: エンドポイントの実装)</span>{"\n\n"}
                        <span className="text-purple-400">if</span> __name__ == <span className="text-emerald-400">"__main__"</span>:{"\n"}
                        {"    "}<span className="text-slate-500"># Cloud Run では環境変数 PORT からバインド先を動的に決定します。</span>{"\n"}
                        {"    "}port = <span className="text-yellow-400">int</span>(os.environ.get(<span className="text-emerald-400">"PORT"</span>, <span className="text-cyan-400">8080</span>)){"\n"}
                        {"    "}app.run(host=<span className="text-emerald-400">"0.0.0.0"</span>, port=port, debug=<span className="text-purple-400">False</span>)
                      </code>
                    )}
                    {activeGuideSubTab === 'requirements' && (
                      <code>
                        <span className="text-blue-400">Flask</span>==<span className="text-emerald-400">3.0.3</span>{"\n"}
                        <span className="text-blue-400">gunicorn</span>==<span className="text-emerald-400">22.0.0</span>
                      </code>
                    )}
                    {activeGuideSubTab === 'dockerfile' && (
                      <code>
                        <span className="text-purple-400">FROM</span> python:3.11-slim{"\n\n"}
                        <span className="text-purple-400">WORKDIR</span> /app{"\n\n"}
                        <span className="text-purple-400">COPY</span> requirements.txt .{"\n"}
                        <span className="text-purple-400">RUN</span> pip install --no-cache-dir -r requirements.txt{"\n\n"}
                        <span className="text-purple-400">COPY</span> main.py .{"\n\n"}
                        <span className="text-purple-400">ENV</span> PYTHONUNBUFFERED=1{"\n\n"}
                        <span className="text-purple-400">CMD</span> [<span className="text-emerald-400">"gunicorn"</span>, <span className="text-emerald-400">"--bind"</span>, <span className="text-emerald-400">"0.0.0.0:8080"</span>, <span className="text-emerald-400">"--workers"</span>, <span className="text-emerald-400">"1"</span>, <span className="text-emerald-400">"main:app"</span>]
                      </code>
                    )}
                    {activeGuideSubTab === 'deploy' && (
                      <code>
                        <span className="text-slate-500"># 1. gcloud CLI ログイン設定</span>{"\n"}
                        gcloud auth login{"\n"}
                        gcloud config set project <span className="text-emerald-400">[YOUR_PROJECT_ID]</span>{"\n\n"}
                        <span className="text-slate-500"># 2. 自動デプロイコマンドを実行</span>{"\n"}
                        gcloud run deploy flask-task-manager \<span className="text-purple-400"></span>{"\n"}
                        {"  "}--source . \<span className="text-purple-400"></span>{"\n"}
                        {"  "}--region asia-northeast1 \<span className="text-purple-400"></span>{"\n"}
                        {"  "}--allow-unauthenticated
                      </code>
                    )}
                  </pre>
                </div>
              </div>

              {/* プロのアドバイス */}
              <div className="mt-6 p-4 bg-indigo-950/20 border border-indigo-500/10 rounded-2xl flex items-start space-x-3.5 text-xs text-indigo-300">
                <Info className="w-4.5 h-4.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-200">GCP 本番開発のアドバイス:</h4>
                  <p className="mt-1.5 leading-relaxed text-slate-400">
                    Cloud Run はコンテナへのアクセスがない場合に、自動でインスタンスを「0」まで縮小（スケールダウン）します。
                    これにより、Flask メモリ上のデータは初期化されます。実際のプロダクション開発においては、<strong>Cloud Firestore</strong> や <strong>Cloud SQL (PostgreSQL)</strong> をバックエンドデータベースとして接続することを推奨します。
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-slate-950 border-t border-white/5 py-10 mt-12 text-xs text-slate-500 relative z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-bold text-slate-300">Flask &amp; GCP Cloud Run Suite &copy; 2026</p>
            <p className="mt-1 text-slate-500">本番構成ファイルはすべてすでにルートディレクトリ（/main.py, /requirements.txt）に作成完了しています。</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg text-slate-400 border border-white/5 font-mono">Python 3.11</span>
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg text-slate-400 border border-white/5 font-mono">Flask 3.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
