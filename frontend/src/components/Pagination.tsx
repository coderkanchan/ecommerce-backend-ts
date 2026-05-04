import Link from 'next/link';

interface Props {
  pages: number;
  page: number;
  isAdmin?: boolean;
}

const Pagination = ({ pages, page, isAdmin = false }: Props) => {
  return pages > 1 ? (
    <div className="flex justify-center my-8 gap-2">
      
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          href={
            isAdmin
              ? `/admin/products?pageNumber=${x + 1}`
              : `/?pageNumber=${x + 1}`
          }
        >
          <button
            className={`px-4 py-2 rounded-lg font-bold transition ${x + 1 === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
          >
            {x + 1}
          </button>
        </Link>
      ))}
    </div>
  ) : null;
};

export default Pagination;