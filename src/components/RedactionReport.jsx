import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'

const TYPE_META = {
  PERSON:   { label: 'Имена',     color: '#ef4444', statBg: '#eff6ff', statText: '#1d4ed8' },
  PHONE:    { label: 'Телефоны',  color: '#f97316', statBg: '#fff7ed', statText: '#c2410c' },
  EMAIL:    { label: 'Email',     color: '#a855f7', statBg: '#faf5ff', statText: '#7e22ce' },
  ADDRESS:  { label: 'Адреса',    color: '#3b82f6', statBg: '#eff6ff', statText: '#1d4ed8' },
  SNILS:    { label: 'СНИЛС',     color: '#2dd4bf', statBg: '#f0fdfa', statText: '#0f766e' },
  PASSPORT: { label: 'Паспорт',   color: '#a78bfa', statBg: '#f5f3ff', statText: '#6d28d9' },
  INN:      { label: 'ИНН',       color: '#facc15', statBg: '#fefce8', statText: '#a16207' },
}

function getLabel(type) {
  return TYPE_META[type]?.label ?? type
}

function getColor(type) {
  return TYPE_META[type]?.color ?? '#6b7280'
}

export default function RedactionReport({ entities = [], log = [] }) {
  // Группируем по типу
  const byType = entities.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(byType).map(([type, value]) => ({
    name: getLabel(type),
    value,
    color: getColor(type),
  }))

  const typesCount = Object.keys(byType).length

  // Средняя точность — бэкенд не возвращает accuracy, показываем N/A если нет
  const stats = [
    { label: 'Всего редакций', value: String(entities.length), bg: '#eff6ff', text: '#1d4ed8' },
    { label: 'Типов данных',   value: String(typesCount),       bg: '#f5f3ff', text: '#6d28d9' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Отчет по редакциям</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: stat.bg }}>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold" style={{ color: stat.text }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">Распределение по типам данных</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                formatter={(v) => [v, 'Количество']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={80}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {log.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-4">Детальный список редакций</p>
          <div className="space-y-4">
            {log.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getColor(item.type) }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{getLabel(item.type)}</p>
                    <p className="text-xs text-gray-400">{item.text}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Заменено на</p>
                  <p className="text-sm font-semibold text-gray-600">{item.replaced_with}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {entities.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">Персональные данные не обнаружены</p>
      )}
    </div>
  )
}
