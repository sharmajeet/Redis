import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { BookFilters } from '@/types/Book';

interface SearchBarProps {
  filters: BookFilters;
  onFiltersChange: (filters: BookFilters) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange }) => {
  const genres = [
    'All Genres',
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Biography',
    'History',
    'Self-Help',
    'Technology',
    'Business'
  ];

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleGenreChange = (value: string) => {
    onFiltersChange({ ...filters, genre: value === 'All Genres' ? '' : value });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({ ...filters, sortBy: value as BookFilters['sortBy'] });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search books, authors, or genres..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-blue-400 rounded-xl"
          />
        </div>
        
        <div className="flex gap-3 items-center">
          <Select value={filters.genre || 'All Genres'} onValueChange={handleGenreChange}>
            <SelectTrigger className="w-48 h-12 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48 h-12 rounded-xl">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
