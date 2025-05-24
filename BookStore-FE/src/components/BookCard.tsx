
import React from 'react';
import { Book } from '@/types/Book';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Share2, ShoppingCart, Heart, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onShare: (book: Book) => void;
  onBuy: (book: Book) => void;
  onFavorite: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onShare, onBuy, onFavorite }) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden">
      <div className="relative overflow-hidden">
        <img 
          src={book.coverUrl} 
          alt={book.title}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={() => onFavorite(book)}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        {book.originalPrice && book.originalPrice > book.price && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white">
            {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% OFF
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className="text-xs">
            {book.genre}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{book.rating}</span>
            <span className="text-xs text-gray-500">({book.reviewCount})</span>
          </div>
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        
        <p className="text-gray-600 mb-2">by {book.author}</p>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {book.description}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <BookOpen className="w-3 h-3" />
          <span>{book.pages} pages</span>
          <span>•</span>
          <span>{book.publishedYear}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">${book.price}</span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-sm text-gray-400 line-through">${book.originalPrice}</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {book.isAvailableForShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(book)}
                className="hover:bg-blue-50"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            )}
            {book.isForSale && (
              <Button
                size="sm"
                onClick={() => onBuy(book)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Buy
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
