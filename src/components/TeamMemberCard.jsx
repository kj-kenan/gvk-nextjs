'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TeamMemberCard({ member, index = 0 }) {
  const { getField } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-64 bg-gray-light">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary text-3xl font-bold">
                {member.name?.charAt(0) || '?'}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="p-6 text-center">
        <h3 className="font-heading font-bold text-xl text-dark mb-1">{member.name}</h3>
        {getField(member, 'title') && (
          <p className="text-primary font-medium text-sm mb-2">{getField(member, 'title')}</p>
        )}
        {getField(member, 'specialty') && (
          <p className="text-gray-dark text-sm">{getField(member, 'specialty')}</p>
        )}
      </div>
    </motion.div>
  );
}
