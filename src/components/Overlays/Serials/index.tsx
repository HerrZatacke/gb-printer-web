import React from 'react';
import Lightbox from '@/components/Lightbox';
import ConnectSerial from '@/components/Overlays/ConnectSerial';
import useInteractionsStore from '@/stores/interactionsStore';

function Serials() {
  const { setShowSerials } = useInteractionsStore();

  return <Lightbox
    header="WebUSB / Serial devices"
    // confirm={() => setShowSerials(false)}
    deny={() => setShowSerials(false)}
  >
    <ConnectSerial />
  </Lightbox>;
}

export default Serials;
