import { useState, useEffect } from 'react';
import { Gauge, User, Clock } from 'lucide-react';

export function TopNavbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

  return (
    <header className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <Gauge className="w-5 h-5 text-sky-400" />
        <span className="text-base font-bold text-slate-100 tracking-wide">
          压缩机预测性维护驾驶舱
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-mono">{formatTime(time)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <User className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-medium">工程师: 张工</span>
        </div>
      </div>
    </header>
  );
}
