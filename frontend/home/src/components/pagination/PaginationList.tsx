
import { FC, useEffect, useRef, useState } from 'react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";

interface IPagination {
  current_page: number;
  items_per_page?: number;
  total_item: number;
  onPerPageSelector: (perPage: number) => void;
  pageDirectHandler: (index: number) => void;
  slidePagination?: (status: 'prev' | 'next') => void;
}

const PaginationList: FC<IPagination> = ({
  current_page,
  items_per_page = 12,
  total_item,
  onPerPageSelector,
  pageDirectHandler,
  // slidePagination,
}) => {
  const [toggleDropup, setToggleDropup] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(total_item / items_per_page));
  const totalPerPage = [5, 10, 20, 25, 50, 100]

  const pageRange = () => {

    const max = Math.ceil(total_item / items_per_page)
    const min = 0
    return [min, max]
  }

  const dropupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handle = (e: Event) => {
      if (!dropupRef.current?.contains(e.target as Node)) {
        setToggleDropup(false);
      }
    };

    document.addEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    setToggleDropup(false);
  }, [items_per_page]);

  useEffect(() => {
    setTotalPages(Math.ceil(total_item / items_per_page))
  }, [total_item, items_per_page]);

  // const renderPagination = () => {
  //   const paginationItems = [];

  //   // หน้าแรก
  //   // paginationItems.push(
  //   //   <PaginationItem key="first" className='hidden lg:block' >
  //   //     <PaginationLink href="#" isActive={current_page === 1} onClick={(event) => {
  //   //       event.preventDefault();
  //   //       pageDirectHandler(0);
  //   //     }}>
  //   //       1
  //   //     </PaginationLink>
  //   //   </PaginationItem>
  //   // );

  //   // Ellipsis ก่อนเลขหน้าใกล้ currentPage
  //   if (current_page > 3) {
  //     paginationItems.push(
  //       <PaginationItem key="ellipsis-start" className='hidden lg:block'>
  //         <PaginationEllipsis />
  //       </PaginationItem>
  //     );
  //   }

  //   // แสดงหน้าปัจจุบัน และรอบข้าง
  //   for (let i = current_page - 2; i <= current_page + 2; i++) {
  //     if (i > 1 && i < totalPages) {
  //       paginationItems.push(
  //         <PaginationItem key={i} className='hidden lg:block'>
  //           <PaginationLink href="#" className={`${current_page === i && 'bg-gray-100'}`} isActive={current_page === i} onClick={(event) => {
  //             event.preventDefault();
  //             pageDirectHandler(i - 1);
  //           }}>
  //             {i}
  //           </PaginationLink>
  //         </PaginationItem>
  //       );
  //     }
  //   }

  //   // Ellipsis หลังเลขหน้าใกล้ currentPage
  //   if (current_page < totalPages - 1) {
  //     paginationItems.push(
  //       <PaginationItem key="ellipsis-end" className='hidden lg:block'>
  //         <PaginationEllipsis />
  //       </PaginationItem>
  //     );
  //   }

  //   // หน้าสุดท้าย
  //   if (totalPages > 1) {
  //     paginationItems.push(
  //       <PaginationItem key="last" className='hidden lg:block'>
  //         <PaginationLink href="#" isActive={current_page === totalPages} onClick={(event) => {
  //           event.preventDefault();
  //           pageDirectHandler(totalPages - 1);
  //         }}>
  //           {totalPages}
  //         </PaginationLink>
  //       </PaginationItem>
  //     );
  //   }

  //   return paginationItems;
  // };

  return (
    <div className="flex items-center justify-between py-3 w-full">
      <div className="flex flex-col md:flex-row justify-between w-full items-center gap-2">
        <div>
          {total_item ? (
            <p className="text-gray-700 font-medium text-sm">
              Page&nbsp;{current_page}&nbsp;/&nbsp;{pageRange()[1]}&nbsp;
              Showing&nbsp;{(current_page - 1) * items_per_page + 1}&nbsp;-&nbsp;
              {current_page * items_per_page > total_item
                ? total_item
                : current_page * items_per_page}
              &nbsp;/&nbsp;{total_item}
            </p>
          ) : (
            <p>0&nbsp;</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-row gap-2 items-center relative">
            {toggleDropup && (
              <div
                className="w-14 h-[160px] ring-1 ring-inset ring-gray-300 absolute rounded-md bottom-10 right-0 bg-white flex flex-col object-contain"
                ref={dropupRef}
              >
                {totalPerPage.map((total, index) => (
                  <div
                    key={index}
                    className={`h-1/6 flex items-center justify-center cursor-pointer text-center hover:bg-standswork-zeus-black-100/10 ${index === 0 && 'rounded-t-lg'
                      } ${index === totalPerPage.length - 1 && 'rounded-b-lg'
                      } text-[14px]  hover:bg-gray-100 `}
                    onClick={() => onPerPageSelector(total)}
                  >
                    <span className='my-auto'>{total}</span>
                  </div>
                ))}
              </div>
            )}
            {items_per_page && items_per_page != 12 && (
              <>
                <p>per page : </p>
                <div
                  className="ring-1 bg-white  ring-inset ring-gray-300 w-fit px-2 h-8 rounded-md hover:ring-2 cursor-pointer flex justify-center items-center"
                  onClick={() => setToggleDropup(!toggleDropup)}
                >
                  <p>{items_per_page}</p>
                </div>
              </>
            )}
          </div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem key="first"  >
                  <PaginationLink href="#"
                    className={`border ${current_page === 1 && 'opacity-50 cursor-default'}`}
                    onClick={(event) => {
                      event.preventDefault();
                      pageDirectHandler(0);
                    }}>
                    <RxDoubleArrowLeft className="h-5 w-5" aria-hidden="true" />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={`border ${current_page === 1 && 'opacity-50 cursor-default'}`}
                    onClick={(event) => {
                      event.preventDefault();
                      if (current_page > 1) pageDirectHandler(current_page - 2);
                    }}
                  >
                    {/* <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" /> */}
                  </PaginationPrevious>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={`border ${current_page === totalPages && 'opacity-50 cursor-default'}`}
                    onClick={(event) => {
                      event.preventDefault();
                      if (current_page < totalPages) pageDirectHandler(current_page);
                    }}
                  >
                    {/* <ChevronRightIcon className="h-5 w-5" aria-hidden="true" /> */}
                  </PaginationNext>
                </PaginationItem>
                <PaginationItem key="last">
                  <PaginationLink
                    href="#"
                    className={`border ${current_page === totalPages && 'opacity-50 cursor-default'}`}
                    onClick={(event) => {
                      event.preventDefault();
                      pageDirectHandler(totalPages - 1);
                    }}>
                    <RxDoubleArrowRight className="h-5 w-5" aria-hidden="true" />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </nav>
        </div>
      </div>
    </div>
  );
};


export default PaginationList;
