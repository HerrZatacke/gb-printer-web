const mapCartFrameToName = (frameNumber, savFrameTypes) => (
  [
    savFrameTypes === 'jp' ? 'jp01' : 'int01',
    savFrameTypes === 'jp' ? 'jp02' : 'int02',
    'int03',
    'int04',
    'int05',
    'int06',
    savFrameTypes === 'jp' ? 'jp07' : 'int07',
    'int08',
    savFrameTypes === 'jp' ? 'jp09' : 'int09',
    'int10',
    'int11',
    'int12',
    'int13',
    'int14',
    'int15',
    'int16',
    'int17',
    'int18',
  ][frameNumber]
);

export default mapCartFrameToName;
