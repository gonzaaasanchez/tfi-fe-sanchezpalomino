import React from 'react';
import {
  Flex,
  Button,
  HStack,
  IconButton,
  Text,
  Select,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export interface PaginationMetadata {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface PaginationProps {
  metadata: PaginationMetadata;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  translations?: {
    showingResults: string;
    perPage: string;
    previousPage: string;
    nextPage: string;
  };
}

const Pagination: React.FC<PaginationProps> = ({
  metadata,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  translations
}) => {
  const { page, pageCount, total } = metadata;
  const startItem = (page - 1) * metadata.pageSize + 1;
  const endItem = Math.min(page * metadata.pageSize, total);
  
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');

  // Default translations
  const defaultTranslations = {
    showingResults: `Mostrando ${startItem} a ${endItem} de ${total} resultados`,
    perPage: 'Por página:',
    previousPage: 'Página anterior',
    nextPage: 'Página siguiente'
  };

  const t = translations || defaultTranslations;

  return (
    <Flex
      justify="space-between"
      align="center"
      px={6}
      py={4}
      borderTop="1px"
      borderColor={borderColor}
      bg={bgColor}
    >
      <Text fontSize="sm" color="gray.600">
        {t.showingResults}
      </Text>

      <HStack spacing={2}>
        {onPageSizeChange && (
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.600">
              {t.perPage}
            </Text>
            <Select
              size="sm"
              w="70px"
              value={metadata.pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </HStack>
        )}

        <HStack spacing={1}>
          <IconButton
            size="sm"
            icon={<ChevronLeftIcon />}
            aria-label={t.previousPage}
            isDisabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            variant="ghost"
          />
          
          {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
            let pageNum: number;
            if (pageCount <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= pageCount - 2) {
              pageNum = pageCount - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                size="sm"
                variant={page === pageNum ? 'solid' : 'ghost'}
                colorScheme={page === pageNum ? 'brand1' : 'gray'}
                onClick={() => onPageChange(pageNum)}
                minW="40px"
              >
                {pageNum}
              </Button>
            );
          })}

          <IconButton
            size="sm"
            icon={<ChevronRightIcon />}
            aria-label={t.nextPage}
            isDisabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            variant="ghost"
          />
        </HStack>
      </HStack>
    </Flex>
  );
};

export default Pagination; 