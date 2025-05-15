
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import DocumentCard from "@/components/DocumentCard";
import { elasticSearchService } from "@/services/elasticSearchService";
import { SearchResult } from "@/types/document";

const Search = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await elasticSearchService.searchDocuments(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">البحث في المستندات</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} isSearching={isSearching} />
        </div>
        
        <div className="space-y-4">
          {isSearching ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">جاري البحث...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold text-right">نتائج البحث ({searchResults.length})</h2>
              <div className="grid gap-4">
                {searchResults.map((result) => (
                  <DocumentCard key={result.id} document={result} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                قم بإدخال كلمة البحث للعثور على المستندات
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
