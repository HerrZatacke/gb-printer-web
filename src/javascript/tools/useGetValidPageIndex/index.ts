import { useParams } from 'react-router-dom';

interface ValidPageIndexQuery {
  pageSize: number,
  imageCount: number,
}

interface ValidPageIndex {
  page: number,
  valid: boolean,
}

const useGetValidPageIndex = ({ pageSize, imageCount }: ValidPageIndexQuery): ValidPageIndex => {
  const { page: pageParam } = useParams();

  const currentPage = pageParam ? parseInt(pageParam, 10) - 1 : 0;
  const totalPages = pageSize ? Math.ceil(imageCount / pageSize) : 1;
  const maxPage = Math.max(0, totalPages - 1);

  const page = Math.max(0, Math.min(currentPage, maxPage));

  return {
    valid: page === currentPage,
    page,
  };
};

export default useGetValidPageIndex;
