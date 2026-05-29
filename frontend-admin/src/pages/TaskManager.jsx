import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Zap, Edit3, Check, X, Clock } from 'lucide-react';
import client from '../api/client';

const inputClass = "w-full px-3 py-2 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500";

function formatTime(time) {
  if (!time) return '-';
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function StatusBadge({ status }) {
  const isRunning = status === 'RUNNING';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
      isRunning
        ? 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
        : 'bg-stone-200/80 dark:bg-stone-700/40 text-stone-600 dark:text-stone-400'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
      {isRunning ? '运行中' : '已暂停'}
    </span>
  );
}

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingCron, setEditingCron] = useState(false);
  const [cronInput, setCronInput] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = useCallback(() => {
    client.get('/admin/tasks')
      .then((res) => {
        const list = res || [];
        setTasks(list);
        // 保持选中状态
        if (selectedName && !list.find(t => t.name === selectedName)) {
          setSelectedName(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedName]);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const selectedTask = tasks.find(t => t.name === selectedName);

  const handleSelect = (name) => {
    setSelectedName(name);
    setEditingCron(false);
  };

  const handlePause = async (name) => {
    try {
      await client.post(`/admin/tasks/${name}/pause`);
      showToast('任务已暂停', 'success');
      fetchTasks();
    } catch {
      showToast('暂停失败', 'error');
    }
  };

  const handleResume = async (name) => {
    try {
      await client.post(`/admin/tasks/${name}/resume`);
      showToast('任务已恢复', 'success');
      fetchTasks();
    } catch {
      showToast('恢复失败', 'error');
    }
  };

  const handleTrigger = async (name) => {
    try {
      await client.post(`/admin/tasks/${name}/trigger`);
      showToast('任务已触发，正在后台执行', 'success');
      fetchTasks();
    } catch {
      showToast('触发失败', 'error');
    }
  };

  const startEditCron = () => {
    if (selectedTask) {
      setCronInput(selectedTask.cronExpression);
      setEditingCron(true);
    }
  };

  const cancelEditCron = () => {
    setEditingCron(false);
    setCronInput('');
  };

  const saveCron = async () => {
    if (!selectedTask || !cronInput.trim()) return;
    try {
      await client.put(`/admin/tasks/${selectedTask.name}/cron`, {
        cronExpression: cronInput.trim(),
      });
      showToast('Cron 表达式已更新', 'success');
      setEditingCron(false);
      fetchTasks();
    } catch (e) {
      showToast(e?.message || '更新失败，请检查 cron 表达式格式', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">定时任务</h1>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : (
        <div className="flex gap-6">
          {/* 左侧任务列表 */}
          <div className="w-80 shrink-0 flex flex-col gap-2">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-stone-400 dark:text-stone-500 text-sm">暂无定时任务</div>
            ) : (
              tasks.map((task) => (
                <button
                  key={task.name}
                  onClick={() => handleSelect(task.name)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    selectedName === task.name
                      ? 'bg-white dark:bg-stone-900 border-amber-500/60 dark:border-amber-500/40 shadow-md'
                      : 'bg-white/60 dark:bg-stone-900/50 border-stone-900/[0.06] dark:border-white/[0.06] hover:bg-white dark:hover:bg-stone-900 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-stone-900 dark:text-stone-100">{task.name}</span>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 space-y-0.5">
                    <div className="flex items-center gap-1">
                      <span className="text-stone-400 dark:text-stone-500">Cron:</span>
                      <code className="text-[11px] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">{task.cronExpression}</code>
                    </div>
                    {task.nextExecutionTime && (
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span>下次: {formatTime(task.nextExecutionTime)}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* 右侧详情面板 */}
          <div className="flex-1">
            {!selectedTask ? (
              <div className="flex items-center justify-center h-64 text-stone-400 dark:text-stone-500 text-sm bg-white/40 dark:bg-stone-900/30 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06]">
                请从左侧选择一个任务
              </div>
            ) : (
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] p-6 space-y-6">
                {/* 基本信息 */}
                <div>
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">任务详情</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">任务名称</span>
                      <p className="font-medium text-stone-900 dark:text-stone-100 mt-0.5">{selectedTask.name}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">状态</span>
                      <p className="mt-0.5"><StatusBadge status={selectedTask.status} /></p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-500 dark:text-stone-400">描述</span>
                      <p className="text-stone-900 dark:text-stone-100 mt-0.5">{selectedTask.description || '-'}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">上次执行</span>
                      <p className="text-stone-900 dark:text-stone-100 mt-0.5">{formatTime(selectedTask.lastExecutionTime)}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">下次执行</span>
                      <p className="text-stone-900 dark:text-stone-100 mt-0.5">
                        {selectedTask.nextExecutionTime ? formatTime(selectedTask.nextExecutionTime) : '-'}
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">上次结果</span>
                      <p className="mt-0.5">
                        {selectedTask.lastResult ? (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            selectedTask.lastResult === 'SUCCESS'
                              ? 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                              : 'bg-red-100/80 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                          }`}>{selectedTask.lastResult}</span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-3">
                  {selectedTask.status === 'RUNNING' ? (
                    <button
                      onClick={() => handlePause(selectedTask.name)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white border-none rounded-xl cursor-pointer shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all"
                    >
                      <Pause size={14} />
                      暂停任务
                    </button>
                  ) : (
                    <button
                      onClick={() => handleResume(selectedTask.name)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-gradient-to-b from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600 text-white border-none rounded-xl cursor-pointer shadow-sm hover:from-emerald-700 hover:to-emerald-800 dark:hover:from-emerald-400 dark:hover:to-emerald-500 hover:shadow-md active:scale-[0.98] transition-all"
                    >
                      <Play size={14} />
                      启动任务
                    </button>
                  )}
                  <button
                    onClick={() => handleTrigger(selectedTask.name)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-white/70 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 text-stone-700 dark:text-stone-300 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-stone-800/70 hover:shadow-sm transition-all"
                  >
                    <Zap size={14} />
                    立即执行
                  </button>
                </div>

                {/* Cron 编辑区 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">Cron 表达式</h4>
                    {!editingCron && (
                      <button
                        onClick={startEditCron}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/70 dark:border-stone-700/50 hover:border-amber-300 dark:hover:border-amber-600 hover:text-amber-700 dark:hover:text-amber-400"
                      >
                        <Edit3 size={11} />
                        编辑
                      </button>
                    )}
                  </div>
                  {editingCron ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className={inputClass}
                        value={cronInput}
                        onChange={(e) => setCronInput(e.target.value)}
                        placeholder="例如: 0 */30 * * * ?"
                      />
                      <button
                        onClick={saveCron}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-all"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEditCron}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/60 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <code className="text-sm bg-stone-100 dark:bg-stone-800 px-3 py-2 rounded-xl block text-stone-700 dark:text-stone-300">
                      {selectedTask.cronExpression}
                    </code>
                  )}
                </div>

                {/* 执行历史 */}
                <div>
                  <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">执行历史（最近 20 条）</h4>
                  {(!selectedTask.executionHistory || selectedTask.executionHistory.length === 0) ? (
                    <div className="text-center py-6 text-stone-400 dark:text-stone-500 text-sm">暂无执行记录</div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-stone-200/50 dark:border-stone-700/50">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-stone-50 dark:bg-stone-800/50">
                            <th className="text-left px-4 py-2.5 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">执行时间</th>
                            <th className="text-center px-4 py-2.5 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">结果</th>
                            <th className="text-left px-4 py-2.5 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">消息</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTask.executionHistory.map((record, index) => (
                            <tr key={index} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                              <td className="px-4 py-2.5 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-700 dark:text-stone-300 whitespace-nowrap">{formatTime(record.time)}</td>
                              <td className="px-4 py-2.5 border-b border-stone-200/50 dark:border-stone-700/50 text-center">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  record.result === 'SUCCESS'
                                    ? 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-red-100/80 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                                }`}>{record.result}</span>
                              </td>
                              <td className="px-4 py-2.5 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400 max-w-[300px] truncate" title={record.message}>{record.message}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast 提示 */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl text-sm shadow-lg z-50 backdrop-blur-sm transition-all ${
          toast.type === 'success'
            ? 'bg-green-100/90 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
            : 'bg-red-100/90 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
