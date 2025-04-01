import {
    Pagination,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { MaintenancePaginationMetaData } from "@/type/maintenance";

interface PaginationProps {
    paginationMetaData: MaintenancePaginationMetaData;
}

export default function MaintenancePagination({ paginationMetaData }: PaginationProps) {
    const { page, limit, nextPageExists } = paginationMetaData;
    const router = useRouter();

    const prevPage = () => {
        router.push(`?page=${page - 1}&limit=${limit}`);
    };

    const nextPage = () => {
        router.push(`?page=${page + 1}&limit=${limit}`);
    };

    return (
        <Pagination className="mt-3">
            {/* Prev Button */}
            {page > 1 && <PaginationPrevious onClick={prevPage} />}

            {/* Prev Page */}
            {page > 1 && <PaginationLink onClick={prevPage}>{page - 1}</PaginationLink>}

            {/* Current Page */}
            <PaginationLink isActive>{page}</PaginationLink>

            {/* Next Page */}
            {nextPageExists && <PaginationLink onClick={nextPage}>{page + 1}</PaginationLink>}

            {/* Next Button */}
            {nextPageExists && <PaginationNext onClick={nextPage} />}
        </Pagination>
    );
}
