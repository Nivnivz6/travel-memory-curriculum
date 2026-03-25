import React, { useState } from 'react';
import { Upload, Search, Calendar, Trash2, Plus, ChevronDown } from 'lucide-react';
import { MOCK_IMAGES } from '../constants';
import { ImageCard } from './ImageCard';
import { motion } from 'motion/react';

export const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-12">
      {/* Hero Section: Drag and Drop */}
      <section className="relative group">
        <div className="w-full h-64 border-2 border-dashed border-outline-variant bg-surface-container-low rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:bg-surface-container-high group-hover:border-primary/40">
          <div className="bg-surface-container-lowest p-4 rounded-full shadow-sm mb-4">
            <Upload className="text-primary w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight mb-2">
            Drag and drop your images here
          </h2>
          <p className="text-on-surface-variant font-body mb-6">
            Support for RAW, PNG, JPG up to 50MB
          </p>
          <button className="primary-gradient text-on-primary px-8 py-3 rounded-lg font-semibold shadow-lg active:scale-95 transition-all">
            Upload Image
          </button>
        </div>
      </section>

      {/* Horizontal Toolbar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center bg-surface-container px-4 py-2 rounded-lg border border-transparent focus-within:border-primary/30 transition-all w-full md:w-auto min-w-[280px]">
            <Search className="text-outline w-5 h-5 mr-2" />
            <input 
              className="bg-transparent border-none focus:outline-none text-sm font-body w-full" 
              placeholder="Search gallery..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <select className="appearance-none bg-surface-container text-sm font-medium px-4 py-2 pr-10 rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-on-surface-variant cursor-pointer outline-none">
              <option>All Status</option>
              <option>Pending</option>
              <option>Ready</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline w-5 h-5" />
          </div>
          <div className="flex items-center bg-surface-container px-4 py-2 rounded-lg gap-2 cursor-pointer hover:bg-surface-container-high transition-colors">
            <Calendar className="text-outline w-4 h-4" />
            <span className="text-sm font-medium text-on-surface-variant">Date Range</span>
          </div>
        </div>
        <button className="text-error font-semibold text-sm flex items-center gap-2 px-4 py-2 hover:bg-error-container/30 rounded-lg transition-colors active:scale-95">
          <Trash2 className="w-4 h-4" />
          Delete All
        </button>
      </section>

      {/* Image Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {MOCK_IMAGES.filter(img => img.filename.toLowerCase().includes(searchQuery.toLowerCase())).map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </section>

      {/* Pagination / Footer Status */}
      <footer className="flex items-center justify-between pt-12 border-t border-outline-variant/20">
        <div className="flex items-center gap-4">
          <p className="text-sm font-body text-on-surface-variant">
            Showing {MOCK_IMAGES.length} of 1,284 images
          </p>
        </div>
      </footer>

      {/* Floating Action Button for Upload (Mobile) */}
      <div className="fixed bottom-8 right-8 z-40 lg:hidden">
        <button className="w-14 h-14 rounded-full primary-gradient text-on-primary shadow-2xl flex items-center justify-center active:scale-90 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </main>
  );
};
