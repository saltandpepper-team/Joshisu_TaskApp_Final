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
  CloudLightning
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* 煌びやかな背景グラデーション装飾 */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* グリッド風オーバーレイ背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* ヘッダー */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md" id="main-header">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-500/10">
              F
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Flask Cloud Run Suite
                <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full font-bold">PRO</span>
              </h1>
              <p className="text-xs text-slate-400">GCP Cloud Run に最適化された、超美麗なタスク管理システムと構成ガイド</p>
            </div>
          </div>

          {/* 洗練されたタブコントローラー */}
          <div className="flex bg-slate-950 border border-slate-800 p-1.2 rounded-2xl shadow-inner relative">
            <button 
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center space-x-2 relative cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'dashboard' && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10 shadow-lg shadow-blue-500/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Layers className="w-3.5 h-3.5" />
              <span>プレビュー</span>
            </button>
            <button 
              id="tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center space-x-2 relative cursor-pointer ${
                activeTab === 'guide' 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'guide' && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10 shadow-lg shadow-blue-500/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Server className="w-3.5 h-3.5" />
              <span>本番デプロイ手順</span>
            </button>
          </div>
        </div>
      </header>

      {/* メインセクション */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-10 relative z-10">
        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 左カラム: コントロール & フォーム */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* 美しいインフォカード */}
              <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950/40 to-slate-950 border border-indigo-500/20 rounded-3xl p-6 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shadow-md">
                    <CloudLightning className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">本番環境シミュレーター</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      この画面は GCP Cloud Run にデプロイした時と全く同じ挙動をエミュレートするフロントエンドプレビューです。右上のデプロイ手順タブから即座に Python コードを取得できます。
                    </p>
                  </div>
                </div>
              </div>

              {/* フォームカード */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>タスクを追加</span>
                </h2>
                
                <form onSubmit={addTask} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">タスクタイトル</label>
                    <input 
                      id="input-task-title"
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required 
                      placeholder="例: main.py の動作検証" 
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-white placeholder-slate-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">説明 (任意)</label>
                    <textarea 
                      id="input-task-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="タスクの詳細を入力してください..." 
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-white placeholder-slate-600"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">優先度</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Low', 'Medium', 'High'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`border rounded-2xl py-2.5 flex flex-col items-center justify-center cursor-pointer transition-all relative text-xs font-bold ${
                            priority === p 
                              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 ring-2 ring-indigo-500/10' 
                              : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                        >
                          <span>{p}</span>
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                            p === 'High' ? 'bg-rose-500' : p === 'Medium' ? 'bg-amber-400' : 'bg-slate-500'
                          }`}></span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    id="btn-add-task"
                    type="submit" 
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:opacity-95 text-white rounded-2xl text-xs font-bold tracking-wider shadow-lg shadow-indigo-500/15 transition-all flex items-center justify-center cursor-pointer"
                  >
                    タスクを登録する
                  </button>
                </form>
              </div>
            </div>

            {/* 右カラム: 統計 ＆ タスクリスト */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 統計バッジ */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">すべてのタスク</span>
                  <span className="text-3xl font-extrabold text-white mt-1.5 font-mono">{stats.total}</span>
                </div>
                <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">実行中</span>
                  <span className="text-3xl font-extrabold text-amber-400 mt-1.5 font-mono">{stats.pending}</span>
                </div>
                <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">完了</span>
                  <span className="text-3xl font-extrabold text-emerald-400 mt-1.5 font-mono">{stats.completed}</span>
                </div>
              </div>

              {/* リストビュー */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">タスク一覧</h2>
                  <button 
                    id="btn-reset"
                    onClick={() => setTasks(INITIAL_TASKS)}
                    className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    初期状態にリセット
                  </button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <motion.div
                          layout
                          key={task.id}
                          initial={{ opacity: 0, scale: 0.98, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.22 }}
                          className={`bg-slate-950/40 border relative overflow-hidden ${
                            task.completed 
                              ? 'border-slate-800/40 bg-slate-950/10' 
                              : 'border-slate-800 hover:border-slate-700/80 hover:shadow-xl'
                          } rounded-3xl p-5 transition-all flex items-start justify-between gap-4`}
                        >
                          {/* 優先度別サイドカラーバー */}
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
                            {/* 完了ボタン */}
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                                task.completed 
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' 
                                  : 'border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/5 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                            </button>

                            {/* 内容 */}
                            <div className="flex-grow">
                              <h3 className={`text-sm font-bold tracking-tight transition-all ${
                                task.completed ? 'line-through text-slate-600' : 'text-slate-200'
                              }`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className={`text-xs text-slate-500 mt-1.5 leading-relaxed ${
                                  task.completed ? 'line-through text-slate-700' : ''
                                }`}>
                                  {task.description}
                                </p>
                              )}
                              
                              {/* タグ表示 */}
                              <div className="flex items-center space-x-2 mt-3.5">
                                {task.priority === 'High' ? (
                                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-500/10 border border-rose-500/20 text-rose-400 tracking-wider">HIGH</span>
                                ) : task.priority === 'Medium' ? (
                                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-500/10 border border-amber-500/20 text-amber-400 tracking-wider">MEDIUM</span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-800 border border-slate-700/80 text-slate-400 tracking-wider">LOW</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 削除 */}
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all flex-shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-slate-950/20 border border-dashed border-slate-800 rounded-3xl py-14 px-4 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <h4 className="text-sm font-bold text-slate-400">タスクが完了しました</h4>
                        <p className="text-xs text-slate-500 mt-1">タスクを入力するか、サンプル状態に戻してみてください。</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* デプロイ手順タブ */
          <div className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[580px]">
            {/* 左側サイドメニュー */}
            <div className="md:col-span-1 bg-slate-950/80 border-r border-slate-800 p-5 space-y-1">
              <div className="px-3 py-2 mb-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">構成ファイル</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">デプロイを完璧に行うための全ファイル構成です</p>
              </div>
              
              <button 
                id="btn-subtab-main"
                onClick={() => setActiveGuideSubTab('main')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'main' 
                    ? 'bg-slate-900 border border-slate-800 text-blue-400 shadow-md' 
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Code className="w-4 h-4" />
                <div className="flex-grow">
                  <p>main.py</p>
                  <p className="text-[9px] font-normal text-slate-500">Flask エントリポイント</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button 
                id="btn-subtab-req"
                onClick={() => setActiveGuideSubTab('requirements')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'requirements' 
                    ? 'bg-slate-900 border border-slate-800 text-blue-400 shadow-md' 
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <div className="flex-grow">
                  <p>requirements.txt</p>
                  <p className="text-[9px] font-normal text-slate-500">外部パッケージ依存定義</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button 
                id="btn-subtab-dock"
                onClick={() => setActiveGuideSubTab('dockerfile')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'dockerfile' 
                    ? 'bg-slate-900 border border-slate-800 text-blue-400 shadow-md' 
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <div className="flex-grow">
                  <p>Dockerfile</p>
                  <p className="text-[9px] font-normal text-slate-500">コンテナ起動構成定義</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button 
                id="btn-subtab-deploy"
                onClick={() => setActiveGuideSubTab('deploy')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer relative ${
                  activeGuideSubTab === 'deploy' 
                    ? 'bg-slate-900 border border-slate-800 text-blue-400 shadow-md' 
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <div className="flex-grow">
                  <p>Deploy コマンド</p>
                  <p className="text-[9px] font-normal text-slate-500">GCP CLI による最速デプロイ</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            </div>

            {/* 右側エディタ & 解説領域 */}
            <div className="md:col-span-3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {activeGuideSubTab === 'main' && 'main.py (Flask アプリケーション)'}
                      {activeGuideSubTab === 'requirements' && 'requirements.txt (パッケージ構成)'}
                      {activeGuideSubTab === 'dockerfile' && 'Dockerfile (コンテナ設定)'}
                      {activeGuideSubTab === 'deploy' && 'GCP Cloud Run デプロイ手順'}
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
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-800 cursor-pointer"
                  >
                    {copiedText === activeGuideSubTab ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">コピーしました！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>コピー</span>
                      </>
                    )}
                  </button>
                </div>

                {/* コード表示エリア */}
                <div className="mt-5 bg-slate-950 rounded-2xl p-4 overflow-x-auto border border-slate-800/80 shadow-inner max-h-[380px] relative">
                  <div className="absolute top-3 right-3 text-[9px] bg-slate-900 border border-slate-800 text-slate-500 font-mono px-2 py-0.5 rounded uppercase">
                    {activeGuideSubTab}
                  </div>
                  <pre className="text-slate-300 font-mono text-xs leading-relaxed pt-2">
                    {activeGuideSubTab === 'main' && <code>{FLASK_MAIN_PREVIEW}</code>}
                    {activeGuideSubTab === 'requirements' && (
                      <code>{`Flask==3.0.3\ngunicorn==22.0.0`}</code>
                    )}
                    {activeGuideSubTab === 'dockerfile' && <code>{DOCKERFILE_CONTENT}</code>}
                    {activeGuideSubTab === 'deploy' && <code>{DEPLOY_COMMANDS}</code>}
                  </pre>
                </div>
              </div>

              {/* 注意点アドバイス */}
              <div className="mt-6 p-4 bg-blue-950/20 border border-blue-500/10 rounded-2xl flex items-start space-x-3 text-xs text-blue-300">
                <Info className="w-4.5 h-4.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-200">GCP 運用のプロフェッショナルな知恵</h4>
                  <p className="mt-1 leading-relaxed text-slate-400">
                    Cloud Run はリクエストがなくなると自動的にインスタンスが終了し（スケールダウン）、必要に応じて再び自動起動（コールドスタート）します。このため、インメモリのタスクリストデータは起動ごとにリセットされます。本番環境でユーザーごとのタスクを完全に保持するには、<strong>GCP Firestore</strong> や <strong>Cloud SQL</strong> などの永続化層（データベース）を構築し、API 経由でデータを呼び出すように Flask 側を拡張してください。
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-slate-950 border-t border-slate-800/60 py-8 mt-12 text-xs text-slate-500 relative z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-400">Flask Cloud Run Suite &copy; 2026</p>
            <p className="mt-1">本プロダクトに必要なファイル（main.py、requirements.txt）は既にルートディレクトリに生成済みです。</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg text-slate-400 font-mono border border-slate-800">Python 3.11</span>
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg text-slate-400 font-mono border border-slate-800">Flask 3.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
