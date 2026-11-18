import { TooltipProps } from 'recharts';

interface ChartTooltipContentProps {
  hideLabel?: boolean;
}

export function ChartTooltipContent({ active, payload, hideLabel }: TooltipProps<any, any> & ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        {!hideLabel && (
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {data.name}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Value
          </span>
          <span className="font-bold text-muted-foreground">
            {data.value}
          </span>
        </div>
      </div>
    </div>
  );
} 