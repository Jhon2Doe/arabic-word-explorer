
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const SearchBar = ({ onSearch, isSearching }: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-3xl gap-2">
      <Input
        type="text"
        placeholder="ابحث في المستندات..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow text-right"
        dir="rtl"
      />
      <Button type="submit" disabled={isSearching}>
        <Search className="h-4 w-4 mr-2" />
        {isSearching ? "جاري البحث..." : "بحث"}
      </Button>
    </form>
  );
};

export default SearchBar;
