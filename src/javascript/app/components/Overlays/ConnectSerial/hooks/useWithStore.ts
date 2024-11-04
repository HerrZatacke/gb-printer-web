import useSettingsStore from '../../../../stores/settingsStore';
import useInteractionsStore from '../../../../stores/interactionsStore';

interface UseWithStore {
  lightBoxOpen: boolean,
  hideSerials: () => void,
}

const useWithStore = (): UseWithStore => {

  const { useSerials } = useSettingsStore();
  const { showSerials, setShowSerials } = useInteractionsStore();
  const lightBoxOpen = showSerials && useSerials;

  return {
    lightBoxOpen,
    hideSerials: () => setShowSerials(false),
  };
};

export default useWithStore;
