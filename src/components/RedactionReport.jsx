import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'

const TYPE_META = {
  PERSON:   { label: 'Имена',    color: '#ef4444' },
  PHONE:    { label: 'Телефоны', color: '#f97316' },
  EMAIL:    { label: 'Email',    color: '#a855f7' },
  ADDRESS:  { label: 'Адреса',   color: '#3b82f6' },
  SNILS:    { label: 'СНИЛС',    color: '#2dd4bf' },
  PASSPORT: { label: 'Паспорт',  color: '#a78bfa' },
  INN:      { label: 'ИНН',      color: '#facc15' },
}

function getLabel(type) { return TYPE_META[type]?.label ?? type }
function getColor(type) { return TYPE_META[type]?.color ?? '#6b7280' }

export default function RedactionReport({ entities = [], log = [] }) {
  const byType = entities.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(byType).map(([type, value]) => ({
    name: getLabel(type), value, color: getColor(type),
  }))

  const stats = [
    { label: 'Всего редакций', value: entities.length, bg: '#eff6ff', text: '#1d4ed8' },
    { label: 'Типов данных',   value: Object.keys(byType).length, bg: '#f5f3ff', text: '#6d28d9' },
  ]

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', padding: '1.5rem', transition: 'background-color 0.2s' }}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ border: '2px solid var(--border)' }}>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-faint)' }} />
        </div>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Отчет по редакциям</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: stat.bg }}>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold" style={{ color: stat.text }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Распределение по типам данных</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip formatter={v => [v, 'Количество']} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text)', fontSize: 12 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={80}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {log.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Детальный список редакций</p>
          <div className="space-y-4">
            {log.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getColor(item.type) }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{getLabel(item.type)}</p>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{item.text}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Заменено на</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{item.replaced_with}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {entities.length === 0 && (
        <p className="text-sm text-center py-4" style={{ color: 'var(--text-faint)' }}>Персональные данные не обнаружены</p>
      )}
    </div>
  )
}
