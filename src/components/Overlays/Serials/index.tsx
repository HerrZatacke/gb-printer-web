import { useTranslations } from 'next-intl';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import ConnectSerial from '@/components/Overlays/ConnectSerial';
import useInteractionsStore from '@/stores/interactionsStore';

function Serials() {
  const t = useTranslations('Serials');
  const { setShowSerials } = useInteractionsStore();

  return <Lightbox
    header={t('dialogHeader')}
    // confirm={() => setShowSerials(false)}
    deny={() => setShowSerials(false)}
  >
    <ConnectSerial />
  </Lightbox>;
}

export default Serials;
