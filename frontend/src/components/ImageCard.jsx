import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ImageCard = ({ image }) => {
  const isReady = image.status === 'READY';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] shadow-sm hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          alt={image.filename} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!isReady ? 'grayscale' : ''}`}
          src={image.thumbnailUrl}
          referrerPolicy="no-referrer"
        />
        
        {!isReady && (
          <div className="absolute inset-0 bg-on-surface/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white font-bold text-sm bg-black/40 px-3 py-1 rounded-full">
              Processing...
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
            isReady ? 'bg-green-100 text-green-700' : 'bg-tertiary-fixed text-tertiary'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-green-500' : 'bg-tertiary animate-pulse'}`}></span>
            {isReady ? 'Ready' : 'Pending'}
          </span>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-headline font-bold text-on-surface truncate max-w-[140px]">
            {image.filename}
          </h3>
          <p className="text-xs text-on-surface-variant font-body">
            {image.size} • {image.resolution}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <Edit2 size={18} />
          </button>
          <button className="p-2 text-on-surface-variant hover:text-error transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
