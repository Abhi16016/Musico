"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);

    // Set platform-specific key hint on the client
    if (typeof navigator !== "undefined") {
      setIsMac(navigator.platform.includes("Mac"));
    }

    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value);
    },
    [onSearch]
  );

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          className="h-10 w-full rounded-md bg-gray-800 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Search songs..."
          onChange={handleSearch}
          type="search"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-400 opacity-100 sm:flex">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      </div>
    </div>
  );
}
