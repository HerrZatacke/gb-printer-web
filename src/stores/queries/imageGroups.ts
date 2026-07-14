import { getItemsSource } from '@/items/client';

const baseKeys = ['items', 'imagegroups'] as const;

export const imageGroupsKeys = {
  all: baseKeys,
  fullTree: [...baseKeys, 'fullTree'] as const,
};

export const imageGroupsFullTreeQueryOptions = () => {
  return {
    queryKey: imageGroupsKeys.fullTree,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getImageGroupsFullTree();
    },
    staleTime: 30000,
  };
};
