'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function TestimonialCard({ testimonial, index = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03 }}
      className="relative overflow-hidden rounded-xl shadow-md cursor-pointer aspect-square"
      onClick={() => onClick && onClick(testimonial)}
    >
      <Image
        src={testimonial.pet_photo_url}
        alt={testimonial.pet_name || 'Pet photo'}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          {testimonial.pet_name && (
            <p className="text-white font-semibold text-sm truncate">{testimonial.pet_name}</p>
          )}
          {testimonial.owner_name && (
            <p className="text-white/80 text-xs truncate">{testimonial.owner_name}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
