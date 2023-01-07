import { useParams } from 'react-router-dom';

const useGetValidPageIndex = ({ pageSize, imageCount }) => {
  const { page: pageParam } = useParams();

  const currentPage = parseInt(pageParam || '0', 10) - 1;
  const totalPages = pageSize ? Math.ceil(imageCount / pageSize) : 1;
  const maxPage = Math.max(0, totalPages - 1);

  const page = Math.max(0, Math.min(currentPage, maxPage));

  return {
    valid: page === currentPage,
    page,
  };
};

export default useGetValidPageIndex;
