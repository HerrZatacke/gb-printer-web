import supportedCanvasImageFormats from '../supportedCanvasImageFormats/îndex';

const supportsWebmWriter = () => (
  supportedCanvasImageFormats().includes('webp')
);

export default supportsWebmWriter;
