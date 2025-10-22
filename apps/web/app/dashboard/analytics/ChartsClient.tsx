"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#60a5fa",
  "#34d399",
  "#f59e0b",
  "#f43f5e",
  "#a78bfa",
  "#22d3ee",
  "#f472b6",
  "#4ade80",
];

export default function ChartsClient({
  trend,
  priority,
  tags,
}: {
  trend: { date: string; total: number; open: number; done: number }[];
  priority: { name: string; value: number }[];
  tags: { name: string; value: number }[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {/* Area Chart */}
      <div className="h-64 xl:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#60a5fa"
              fillOpacity={1}
              fill="url(#g1)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Priority Distribution */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priority}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {priority.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Tags Pie Chart */}
      <div className="h-72 xl:col-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tags}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {tags.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
