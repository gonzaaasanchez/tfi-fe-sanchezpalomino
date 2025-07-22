import React from 'react';
import { VStack, Text, Card, CardBody, Heading } from '@chakra-ui/react';
import { Log } from '@interfaces/log';
import { AuditChangeCard } from './audit-change-card';
import { useTranslations } from 'next-intl';

interface AuditPageProps {
  logs: Log[];
  subtitle: string;
  t: (key: string) => string;
  isLoading?: boolean;
  emptyText?: string;
}

export const AuditPage: React.FC<AuditPageProps> = ({
  logs,
  subtitle,
  t,
  isLoading,
  emptyText,
}) => {
  const generalT = useTranslations('general.audit');

  const getFieldLabelLocal = (field: string) => {
    switch (field) {
      case 'name':
        return t('fields.name');
      case 'description':
        return t('fields.description');
      case 'permissions':
        return t('sections.permissions');
      default:
        return field;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <VStack
            spacing={6}
            align="stretch"
          >
            <Heading
              size="sm"
              color="brand1.700"
            >
              {generalT('title')}
            </Heading>
            <Text
              color="gray.500"
              textAlign="center"
              py={4}
            >
              {generalT('loading')}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardBody>
          <VStack
            spacing={6}
            align="stretch"
          >
            <Heading
              size="sm"
              color="brand1.700"
            >
              {generalT('title')}
            </Heading>
            {subtitle && (
              <Text
                color="gray.600"
                fontSize="sm"
              >
                {subtitle}
              </Text>
            )}
            <Text
              color="gray.500"
              textAlign="center"
              py={4}
            >
              {emptyText || generalT('noChanges')}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <VStack
          spacing={6}
          align="stretch"
        >
          <Heading
            size="sm"
            color="brand1.700"
          >
            {generalT('title')}
          </Heading>
          {subtitle && (
            <Text
              color="gray.600"
              fontSize="sm"
            >
              {subtitle}
            </Text>
          )}
          <VStack
            spacing={3}
            align="stretch"
          >
            {logs.map((log) => (
              <AuditChangeCard
                key={log.id}
                log={log}
                t={t}
                getFieldLabel={getFieldLabelLocal}
              />
            ))}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
