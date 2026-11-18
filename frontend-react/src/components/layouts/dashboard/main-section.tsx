import { cn } from "../../../lib/utils";

interface MainSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MainSection({ className, children, ...props }: MainSectionProps) {
  return (
    <main
      className={cn(
        "flex-1 space-y-4 p-4 pt-6 md:p-8 md:pt-6",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
} 