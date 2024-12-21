'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export const Overview = () => {
  const globals = useTranslations('globals');
  const content = useTranslations('content');

  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <h3 className="flex flex-row justify-center gap-4 items-center font-bold text-lg">
          { globals('site_title') }
        </h3>
        <p>
          { content('overview_notice') }{'.'}
        </p>
      </div>
    </motion.div>
  );
};
