import { cn } from "../../../lib/utils";

interface HeaderSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  leftArea?: React.ReactNode;
  rightArea?: React.ReactNode;
}

export function HeaderSection({
  className,
  leftArea,
  rightArea,
  ...props
}: HeaderSectionProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="container flex h-14 items-center">
        {leftArea && <div className="mr-4 flex">{leftArea}</div>}
        {rightArea && <div className="ml-auto flex items-center">{rightArea}</div>}
      </div>
    </header>
  );
} 