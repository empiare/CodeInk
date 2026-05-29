import { useState, useEffect, useRef } from 'react';
import { FileText, MessageSquare, BookOpen, Eye } from 'lucide-react';
import * as echarts from 'echarts';
import client from '../api/client';

const PERIODS = [
  { key: '24h', label: '24小时' },
  { key: 'day', label: '今日' },
  { key: 'month', label: '本月' },
  { key: 'year', label: '本年' },
];

const PERIOD_LABELS = {
  '24h': '最近24小时',
  'day': '今日',
  'month': '本月',
  'year': '本年',
};

const TREND_RANGES = [
  { key: '24h', label: '24小时' },
  { key: '7d', label: '7天' },
  { key: '30d', label: '30天' },
  { key: '1y', label: '1年' },
];

const TREND_SERIES = [
  { key: 'commentCounts', label: '评论数', color: '#22c55e' },
  { key: 'articleViewCounts', label: '文章浏览', color: '#f59e0b' },
  { key: 'pageVisitCounts', label: '总浏览数', color: '#a855f7' },
];

const CARD_DEFS = [
  { key: 'articleCount',    label: '文章数',   icon: FileText,     color: '#6366f1' },
  { key: 'commentCount',    label: '评论数',   icon: MessageSquare, color: '#22c55e' },
  { key: 'articleViewCount', label: '文章浏览', icon: BookOpen,     color: '#f59e0b' },
  { key: 'pageVisitCount',  label: '总浏览数',  icon: Eye,          color: '#a855f7' },
];

function useDarkMode() {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

function EChart({ option, style }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    instanceRef.current = echarts.init(chartRef.current);
    return () => { instanceRef.current?.dispose(); };
  }, []);

  useEffect(() => {
    if (instanceRef.current && option) {
      instanceRef.current.setOption(option, true);
    }
  }, [option]);

  useEffect(() => {
    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={chartRef} style={style} />;
}

export default function Dashboard() {
  const [period, setPeriod] = useState('24h');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendRange, setTrendRange] = useState('24h');
  const [trend, setTrend] = useState(null);
  const isDark = useDarkMode();

  useEffect(() => {
    setLoading(true);
    client.get(`/stats/period?period=${period}`)
      .then((res) => setStats(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  useEffect(() => {
    client.get(`/stats/trend?range=${trendRange}`)
      .then((res) => setTrend(res))
      .catch(() => {});
  }, [trendRange]);

  const textColor = isDark ? '#d6d3d1' : '#44403c';
  const bgColor = isDark ? '#1c1917' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const barOption = {
    backgroundColor: bgColor,
    tooltip: { trigger: 'axis' },
    grid: { top: 30, right: 20, bottom: 30, left: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: CARD_DEFS.map(c => c.label),
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: borderColor } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: borderColor } },
    },
    series: [{
      type: 'bar',
      barWidth: '45%',
      data: CARD_DEFS.map(c => ({
        value: stats?.[c.key] ?? 0,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: c.color },
            { offset: 1, color: c.color + '66' },
          ]),
          borderRadius: [6, 6, 0, 0],
        },
      })),
    }],
  };

  const pieOption = {
    backgroundColor: bgColor,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: {
      bottom: 0,
      textStyle: { color: textColor },
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold', color: textColor },
      },
      data: CARD_DEFS.map(c => ({
        name: c.label,
        value: stats?.[c.key] ?? 0,
        itemStyle: { color: c.color },
      })),
    }],
    graphic: [{
      type: 'text',
      left: 'center',
      top: '38%',
      style: {
        text: `${((stats?.articleCount ?? 0) + (stats?.commentCount ?? 0))}`,
        textAlign: 'center',
        fill: textColor,
        fontSize: 24,
        fontWeight: 'bold',
      },
    }, {
      type: 'text',
      left: 'center',
      top: '48%',
      style: {
        text: '文章+评论',
        textAlign: 'center',
        fill: isDark ? '#a8a29e' : '#78716c',
        fontSize: 12,
      },
    }],
  };

  const lineOption = trend ? {
    backgroundColor: bgColor,
    tooltip: { trigger: 'axis' },
    legend: {
      data: TREND_SERIES.map(s => s.label),
      textStyle: { color: textColor },
      top: 0,
    },
    grid: { top: 40, right: 20, bottom: 30, left: 50, containLabel: true },
    xAxis: {
      type: 'category',
      data: trend.labels,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: borderColor } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: borderColor } },
    },
    series: TREND_SERIES.map(s => ({
      name: s.label,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2, color: s.color },
      itemStyle: { color: s.color },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: s.color + '40' },
          { offset: 1, color: s.color + '05' },
        ]),
      },
      data: trend[s.key] ?? [],
    })),
  } : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">仪表盘</h1>
        <div className="flex bg-stone-100 dark:bg-stone-800 rounded-xl p-1 gap-1">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                period === key
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {CARD_DEFS.map(({ key, label, icon: Icon, color }) => (
              <div
                key={key}
                className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={20} style={{ color }} />
                  <span className="text-sm text-stone-500 dark:text-stone-400">{label}</span>
                </div>
                <div className="text-3xl font-bold tabular-nums text-stone-900 dark:text-stone-100">
                  {stats?.[key] ?? 0}
                </div>
                <div className="text-xs text-stone-400 dark:text-stone-500 mt-1">{PERIOD_LABELS[period]}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-4">数据对比</h2>
              <EChart option={barOption} style={{ width: '100%', height: 300 }} />
            </div>
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-4">数据分布</h2>
              <EChart option={pieOption} style={{ width: '100%', height: 300 }} />
            </div>
          </div>

          <div className="mt-6">
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">趋势分析</h2>
                <div className="flex bg-stone-100 dark:bg-stone-800 rounded-lg p-1 gap-1">
                  {TREND_RANGES.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setTrendRange(key)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        trendRange === key
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                          : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {lineOption && <EChart option={lineOption} style={{ width: '100%', height: 350 }} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}