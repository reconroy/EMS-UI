import { useThemeStore } from '../store/themeStore';

const Footer = () => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <footer className={`p-4 text-center ${theme === 'dark' ? 'bg-black/40 backdrop-blur-xl border-t border-purple-500/20 text-purple-300' : 'bg-slate-100 border-t border-slate-200 text-slate-600'}`}>
      <p>© 2024 EMS System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
