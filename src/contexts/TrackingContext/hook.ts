import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useInteractionsStore, useItemsStore } from '@/stores/stores';
import { nextPowerOfTwo } from '@/tools/nextPowerOfTwo';
import EventData = umami.EventData;

const CONSENT_STORAGE_KEY = 'gbp-z-web-analytics-consent';

export enum ConsentState {
  UNKNOWN = 'unknown',
  ACCEPTED = 'accepted',
  DENIED = 'denied',
}

export interface TrackingContextType {
  consentState: ConsentState;
  setConsent: (consent: ConsentState) => void;
  sendEvent: (eventName: string, eventData: EventData) => void;
  trackingAvailable: boolean;
  showPopup: boolean;
}

export const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC || null;
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || null;
const trackingAvailable = Boolean(UMAMI_SRC && UMAMI_WEBSITE_ID);

export const useContextHook = (): TrackingContextType => {
  const [consentState, setConsentGiven] = useState<ConsentState>(ConsentState.DENIED);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (!trackingAvailable) return;
      const state = localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentState || ConsentState.UNKNOWN;
      setConsentGiven(state);
    }, 1);

    return () => window.clearTimeout(handle);
  }, []);

  const setConsent = useCallback((consent: ConsentState) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, String(consent));
    setConsentGiven(consent);
  }, []);

  const showPopup = useMemo((() => (
    consentState === ConsentState.UNKNOWN
  )), [consentState]);

  const sendEventHandlesRef = useRef<Record<string, number>>({});
  const sendEvent = useCallback((eventName: string, eventData: EventData) => {
    if (!trackingAvailable || consentState !== ConsentState.ACCEPTED || !window.umami) {
      return;
    }

    window.clearTimeout(sendEventHandlesRef.current[eventName]);

    sendEventHandlesRef.current[eventName] = window.setTimeout(() => {
      window.umami.track(eventName, eventData);
    }, 1000);
  }, [consentState]);


  const itemsState = useItemsStore();
  const { errors } = useInteractionsStore();

  // Send stats event when itemState changes
  useEffect(() => {
    const {
      images,
      imageGroups,
      frames,
      frameGroups,
      palettes,
      plugins,
    } = itemsState;

    sendEvent('global-stats', {
      images: nextPowerOfTwo(images.length),
      imageGroups: nextPowerOfTwo(imageGroups.length),
      frames: nextPowerOfTwo(frames.length),
      frameGroups: nextPowerOfTwo(frameGroups.length),
      palettes: nextPowerOfTwo(palettes.length),
      plugins: nextPowerOfTwo(plugins.length),
    });
  }, [itemsState, sendEvent]);


  // Send error event when error occurs
  useEffect(() => {
    if (!errors.length) { return; }

    const { error } = errors[errors.length - 1];

    sendEvent('error', {
      message: error.message,
      stack: error.stack || '',
    });
  }, [errors, sendEvent]);


  // const timeoutRefRoute = useRef<number | null>(null);
  // const pathname = usePathname();
  //
  // // Send error event when error occurs
  // useEffect(() => {
  //   sendEvent('navigate', {
  //     url: `${window.location.origin}${pathname}`,
  //   });
  // }, [pathname, sendEvent]);

  return {
    consentState,
    setConsent,
    sendEvent,
    trackingAvailable,
    showPopup,
  };
};
