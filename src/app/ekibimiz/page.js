'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTeam } from '@/lib/queries';
import TeamMemberCard from '@/components/TeamMemberCard';
import Loading from '@/components/Loading';

export default function TeamPage() {
  const { t } = useLanguage();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeam()
      .then(setTeam)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="pt-28 md:pt-32 min-h-screen">
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('Uzman Ekibimiz', 'Our Expert Team')}
          </motion.h1>
          <motion.p
            className="text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t(
              'Alanında uzman, deneyimli veteriner hekimlerimiz',
              'Our experienced veterinarians who are experts in their field'
            )}
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {team.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <TeamMemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-dark py-20">
              {t('Henüz ekip üyesi bulunmamaktadır.', 'No team members available yet.')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
