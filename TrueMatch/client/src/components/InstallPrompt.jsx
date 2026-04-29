import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after 30 seconds
      setTimeout(() => setShow(true), 30000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50"
        >
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-brand-100/30 dark:border-dark-border/30 p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl">📱</span>
              <div className="flex-1">
                <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm">Add TrueMatch to Home Screen</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get quick access and a native app experience</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleInstall} className="btn-primary text-xs !px-4 !py-2">Install</button>
                  <button onClick={() => setShow(false)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 font-semibold">Later</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
