import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/web/components/shadcn-ui/popover";
import { cn } from "@/web/lib/utils";
import { useState } from "react";

type CustomColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  onThemeColorSelect: (color: string) => void;
  className?: string;
};

export default function CustomColorPicker({
  color,
  onChange,
  onThemeColorSelect,
  className,
}: CustomColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen)
        if (!isOpen) {
          onThemeColorSelect(color)
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex size-8 items-center justify-center",
            "rounded-md border border-input hover:bg-accent hover:text-accent-foreground",
            className
          )}
        >
          <div
            className="size-4 rounded-sm"
            style={{ backgroundColor: color }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-3"
        align="center"
        sideOffset={4}
      >
        <HexColorPicker
          color={color}
          onChange={onChange}
          className="size-[200px]"
        />
      </PopoverContent>
    </Popover>
  );
}
