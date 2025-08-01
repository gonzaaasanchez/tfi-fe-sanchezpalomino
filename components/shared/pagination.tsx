import React from 'react';
import {
  Flex,
  Button,
  HStack,
  IconButton,
  Text,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { PaginationMetadata } from '@interfaces/response';
import { useTranslations } from 'next-intl';

export interface PaginationProps {
  metadata: PaginationMetadata;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  metadata,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
}) => {
  const { page, limit, total, totalPages } = metadata;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');

  const t = useTranslations('components.shared.pagination');

  const translations = {
    showingResults: t('showingResults', {
      startItem,
      endItem,
      total,
    }),
    perPage: t('perPage'),
    previousPage: t('previousPage'),
    nextPage: t('nextPage'),
  };

  // Don't render pagination controls if there's only one page or no pages
  if (totalPages <= 1) {
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
        <Text
          fontSize="sm"
          color="gray.600"
        >
          {translations.showingResults}
        </Text>

        {onPageSizeChange && (
          <HStack spacing={2}>
            <Text
              fontSize="sm"
              color="gray.600"
            >
              {translations.perPage}
            </Text>
            <Select
              size="sm"
              w="70px"
              value={metadata.limit}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option
                  key={size}
                  value={size}
                >
                  {size}
                </option>
              ))}
            </Select>
          </HStack>
        )}
      </Flex>
    );
  }

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
      <Text
        fontSize="sm"
        color="gray.600"
      >
        {translations.showingResults}
      </Text>

      <HStack spacing={2}>
        {onPageSizeChange && (
          <HStack spacing={2}>
            <Text
              fontSize="sm"
              color="gray.600"
            >
              {translations.perPage}
            </Text>
            <Select
              size="sm"
              w="70px"
              value={metadata.limit}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option
                  key={size}
                  value={size}
                >
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
            aria-label={translations.previousPage}
            isDisabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            variant="ghost"
          />

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
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
            aria-label={translations.nextPage}
            isDisabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            variant="ghost"
          />
        </HStack>
      </HStack>
    </Flex>
  );
};

export default Pagination;
