import supportedCanvasImageFormats from '../supportedCanvasImageFormats/index';

const supportsWebmWriter = () => (
  supportedCanvasImageFormats().includes('webp')
);

export default supportsWebmWriter;
