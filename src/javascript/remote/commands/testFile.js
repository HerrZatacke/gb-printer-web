const testFile = () => (
  import(/* webpackChunkName: "dmy" */ '../../app/components/Import/dummy')
    .then(({ default: lines }) => ({ lines }))
);

export default testFile;
