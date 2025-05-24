import React, { useEffect, useRef, useCallback } from 'react';
import { Book } from '@/types/Book';
import BookCard from './BookCard';
import { Loader2 } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onShare: (book: Book) => void;
  onBuy: (book: Book) => void;
  onFavorite: (book: Book) => void;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  loading,
  hasMore,
  onLoadMore,
  onShare,
  onBuy,
  onFavorite
}) => {
  const observer = useRef<IntersectionObserver>();
  
  const lastBookElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {books.map((book, index) => (
          <div
            key={book.id}
            ref={index === books.length - 1 ? lastBookElementRef : null}
            className="animate-fade-in"
            style={{ animationDelay: `${(index % 12) * 100}ms` }}
          >
            <BookCard
              book={book}
              onShare={onShare}
              onBuy={onBuy}
              onFavorite={onFavorite}
            />
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading more books...</span>
        </div>
      )}
      
      {!hasMore && books.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">You've reached the end of our collection!</p>
        </div>
      )}
    </div>
  );
};

export default BookGrid;