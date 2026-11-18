import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';

interface ChartData {
  status: string;
  value: number;
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface PieStatusChartProps {
  data: ChartData[];
  config: ChartConfig;
  className?: string;
}

export function PieStatusChart({ data, config, className }: PieStatusChartProps) {
  return (
    <ChartContainer config={config} className={`min-h-[400px] w-full ${className || ''}`}>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          <Pie
            data={data}
            dataKey="value"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={120}
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={config[entry.status]?.color || '#8884d8'}
              />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
} 