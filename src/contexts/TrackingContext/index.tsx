'use client';
import Script from 'next/script';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
} from 'react';
import {
  ConsentState,
  TrackingContextType,
  UMAMI_SRC,
  UMAMI_WEBSITE_ID,
  useContextHook,
} from '@/contexts/TrackingContext/hook';


const trackingContext = createContext<TrackingContextType | null>(null);

export function TrackingProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();
  return (
    <trackingContext.Provider value={contextValue}>
      {children}

      {/* Conditionally load Umami script */}
      {contextValue.trackingAvailable && UMAMI_SRC && UMAMI_WEBSITE_ID && (contextValue.consentState === ConsentState.ACCEPTED) && (
        <Script src={UMAMI_SRC} data-website-id={UMAMI_WEBSITE_ID} strategy="afterInteractive" />
      )}
    </trackingContext.Provider>
  );
}

const useTracking = () => {
  const context = useContext(trackingContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};

export default useTracking;
