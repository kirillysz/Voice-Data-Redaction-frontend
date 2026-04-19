import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'

const STATS = [
  { label: 'Всего редакций', value: '4', bg: '#eff6ff', text: '#1d4ed8' },
  { label: 'Типов данных', value: '4', bg: '#f5f3ff', text: '#6d28d9' },
  { label: 'Средняя точность', value: '88.3%', bg: '#f0fdf4', text: '#15803d' },
]

const CHART_DATA = [
  { name: 'Имена', value: 1, color: '#ef4444' },
  { name: 'Телефоны', value: 1, color: '#f97316' },
  { name: 'Адреса', value: 1, color: '#3b82f6' },
  { name: 'Email адреса', value: 1, color: '#a855f7' },
]

const DETAILS = [
  { label: 'Имена', time: '1.7s - 3.0s', accuracy: '85.6%', color: '#ef4444' },
  { label: 'Телефоны', time: '5.1s - 6.8s', accuracy: '89.3%', color: '#f97316' },
  { label: 'Адреса', time: '8.9s - 11.8s', accuracy: '91.3%', color: '#3b82f6' },
  { label: 'Email адреса', time: '13.2s - 14.8s', accuracy: '86.9%', color: '#a855f7' },
]

export default function RedactionReport() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Отчет по редакциям</h2>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4"
            style={{ backgroundColor: stat.bg }}
          >
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold" style={{ color: stat.text }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-700 mb-4">Распределение по типам данных</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CHART_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
            />
            <Tooltip
              formatter={(v) => [v, 'Количество']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={80}>
              {CHART_DATA.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail list */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-4">Детальный список редакций</p>
        <div className="space-y-4">
          {DETAILS.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Точность</p>
                <p className="text-sm font-semibold text-green-600">{item.accuracy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
