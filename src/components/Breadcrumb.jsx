import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { getMovieById } from '../services/movie-service';
import { getEventById } from '../services/event-service';

const ID_PATTERN = /^(\d+|[0-9a-fA-F-]{6,})$/;

const isLikelyId = (segment) => ID_PATTERN.test(segment);

const toReadableLabel = (segment) => {
  const decoded = decodeURIComponent(segment || '');
  const normalized = decoded
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\bpage\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return 'Unknown';
  }

  return normalized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getDynamicType = (segment, previousSegment) => {
  if (!isLikelyId(segment)) {
    return null;
  }

  const context = (previousSegment || '').toLowerCase();
  if (['movies', 'movie', 'editmovie', 'moviedetails'].includes(context)) {
    return 'movie';
  }
  if (['events', 'eventdetails', 'editevent'].includes(context)) {
    return 'event';
  }

  return null;
};

const Breadcrumb = () => {
  const location = useLocation();
  const [resolvedLabels, setResolvedLabels] = useState({});

  const breadcrumbItems = useMemo(() => {
    const cleanPath = location.pathname.split('?')[0] || '/';
    const segments = cleanPath.split('/').filter(Boolean);
    let cumulativePath = '';

    const items = segments.map((segment, index) => {
      cumulativePath += `/${segment}`;
      const previousSegment = index > 0 ? segments[index - 1] : '';

      return {
        path: cumulativePath,
        segment,
        defaultLabel: toReadableLabel(segment),
        dynamicType: getDynamicType(segment, previousSegment),
      };
    });

    return [
      {
        path: '/',
        segment: '',
        defaultLabel: 'Home',
        dynamicType: null,
      },
      ...items,
    ];
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;

    const resolveDynamicLabels = async () => {
      const pending = breadcrumbItems.filter(
        (item) => item.dynamicType && !resolvedLabels[item.path]
      );

      if (pending.length === 0) {
        return;
      }

      const entries = await Promise.all(
        pending.map(async (item) => {
          try {
            if (item.dynamicType === 'movie') {
              const movie = await getMovieById(item.segment);
              const movieTitle = movie?.title || movie?.movieName;
              return [item.path, movieTitle || item.defaultLabel];
            }

            if (item.dynamicType === 'event') {
              const event = await getEventById(item.segment);
              return [item.path, event?.title || item.defaultLabel];
            }

            return [item.path, item.defaultLabel];
          } catch (error) {
            console.error('Failed to resolve breadcrumb label:', error);
            return [item.path, item.defaultLabel];
          }
        })
      );

      if (cancelled) {
        return;
      }

      setResolvedLabels((prev) => {
        const next = { ...prev };
        entries.forEach(([path, label]) => {
          if (label) {
            next[path] = label;
          }
        });
        return next;
      });
    };

    resolveDynamicLabels();

    return () => {
      cancelled = true;
    };
  }, [breadcrumbItems, resolvedLabels]);

  return (
    <nav
      aria-label='Breadcrumb'
      className='w-full border-b border-gray-200/80 bg-white/95 px-2.5 py-2 backdrop-blur sm:px-4 md:px-6 lg:px-8'
    >
      <ol className='mx-auto flex w-full max-w-[1280px] items-center gap-1.5 overflow-x-auto pr-1 text-[11px] text-gray-500 sm:gap-2 sm:text-xs md:text-sm'>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const label = resolvedLabels[item.path] || item.defaultLabel;

          return (
            <li key={item.path || 'home'} className='flex items-center gap-1 whitespace-nowrap'>
              {index === 0 ? (
                <Home size={14} className='shrink-0 text-gray-500' />
              ) : null}

              {isLast ? (
                <span className='max-w-[42vw] truncate font-semibold text-red-600 sm:max-w-[240px] md:max-w-[320px]'>
                  {label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className='max-w-[34vw] truncate rounded px-0.5 py-0.5 transition-colors hover:text-red-500 sm:max-w-[200px] md:max-w-[280px]'
                >
                  {label}
                </Link>
              )}

              {!isLast ? <span className='shrink-0 text-gray-400'>&gt;</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
