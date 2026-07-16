import { getItemsSource } from '@/items/client';
import { type NewTreeImageGroup } from '@/types/ImageGroup';

const baseKeys = ['items', 'imagegroups'] as const;

export const findGroupByFullSlug = (
  group: NewTreeImageGroup,
  fullSlug: string,
): NewTreeImageGroup | null => {
  if (group.fullSlug === fullSlug) {
    return group;
  }

  for (const child of group.groups) {
    const found = findGroupByFullSlug(child, fullSlug);
    if (found) {
      return found;
    }
  }

  return null;
};


export const imageGroupsKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
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

export const imageGroupsListQueryOptions = () => {
  return {
    queryKey: imageGroupsKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getImageGroupsList();
    },
    staleTime: 30000,
  };
};
