'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { defaultSiteSettings, SiteSettings } from '@/lib/default-settings';

export function useSiteSettings() {
  const firestore = useFirestore();

  const settingsDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'siteSettings', 'general');
  }, [firestore]);

  const { data: remoteData, isLoading, error } = useDoc<Partial<SiteSettings>>(settingsDocRef);

  const raw = remoteData || {};
  const settings: SiteSettings = {
    ...defaultSiteSettings,
    ...raw,
    // Normalización de aliases para compatibilidad total CMS <-> Portada
    heroTitleHighlight1: raw.heroTitleHighlight1 || raw.heroHighlight1 || defaultSiteSettings.heroTitleHighlight1,
    heroTitleHighlight2: raw.heroTitleHighlight2 || raw.heroHighlight2 || defaultSiteSettings.heroTitleHighlight2,
    heroButtonPrimaryText: raw.heroButtonPrimaryText || raw.heroPrimaryBtnText || defaultSiteSettings.heroButtonPrimaryText,
    heroButtonPrimaryLink: raw.heroButtonPrimaryLink || raw.heroPrimaryBtnLink || defaultSiteSettings.heroButtonPrimaryLink,
    heroButtonSecondaryText: raw.heroButtonSecondaryText || raw.heroSecondaryBtnText || defaultSiteSettings.heroButtonSecondaryText,
    heroButtonSecondaryLink: raw.heroButtonSecondaryLink || raw.heroSecondaryBtnLink || defaultSiteSettings.heroButtonSecondaryLink,
    missionImage: raw.missionImage || raw.missionImageUrl || defaultSiteSettings.missionImage,
    missionText: raw.missionText || raw.missionDescription || defaultSiteSettings.missionText,
    navLinks: (raw.navLinks && raw.navLinks.length > 0) ? raw.navLinks : defaultSiteSettings.navLinks,
    // Ensure featuredVideos is properly populated
    featuredVideos: ((raw.featuredVideos && raw.featuredVideos.length > 0)
      ? raw.featuredVideos
      : defaultSiteSettings.featuredVideos).map(v => {
        if ((v.id === '0DmyalU2zL4' || v.youtubeId === '0DmyalU2zL4') && (!v.title || v.title.includes('HAY FESTIVAL') || v.title === 'Diálogos de Cambio')) {
          return { ...v, title: 'COP 16' };
        }
        return v;
      })
  };

  return {
    settings,
    isLoading,
    error
  };
}
