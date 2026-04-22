import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ className = '', fallbackTo = '/', label = 'Back' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof window === 'undefined') {
      navigate(fallbackTo, { replace: true });
      return;
    }

    const historyIndex = window.history.state?.idx ?? 0;
    const canGoBack = historyIndex > 0 || window.history.length > 1;

    if (canGoBack) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo, { replace: true });
  };

  return (
    <button
      type='button'
      onClick={handleBack}
      className={`inline-flex min-h-10 max-w-full items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-red-600 sm:gap-2 sm:px-3 sm:text-sm ${className}`.trim()}
      aria-label='Go back'
    >
      <ArrowLeft size={15} className='shrink-0 sm:h-4 sm:w-4' />
      <span className='truncate'>{label}</span>
    </button>
  );
};

export default BackButton;
