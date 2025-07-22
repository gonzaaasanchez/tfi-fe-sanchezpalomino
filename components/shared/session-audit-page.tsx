import React from 'react';
import { VStack, Text, Heading, Badge, Card, CardBody } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { SessionAudit } from 'lib/types/sessionAudit';
import { PaginationMetadata } from 'lib/types/response';
import TableComponent from './table';
import { Column } from './table';
import { colors } from 'styles/foundations/colors';

interface SessionAuditPageProps {
  sessions: SessionAudit[];
  subtitle: string;
  isLoading?: boolean;
  emptyText?: string;
  pagination?: PaginationMetadata;
  onChangePage?: (page: number) => void;
}

export const SessionAuditPage: React.FC<SessionAuditPageProps> = ({
  sessions,
  subtitle,
  isLoading,
  emptyText,
  pagination,
  onChangePage,
}) => {
  const sessionAuditT = useTranslations('components.shared.sessionAudit');
  const fieldsT = useTranslations('components.shared.sessionAudit.fields');
  const actionsT = useTranslations('components.shared.sessionAudit.actions');
  const sectionsT = useTranslations('components.shared.sessionAudit.sections');

  const columns: Column[] = [
    {
      key: 'action',
      label: fieldsT('action'),
      type: 'custom',
      renderCell: (session: SessionAudit) => (
        <Badge
          bg={getActionColor(session.action, session.success)}
          color="white"
          variant="solid"
          fontSize="x-small"
        >
          {getActionLabel(session.action)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: fieldsT('createdAt'),
      type: 'date',
      dateFormat: 'dd/MM/yyyy HH:mm',
    },
    {
      key: 'failureReason',
      label: fieldsT('failureReason'),
      type: 'custom',
      renderCell: (session: SessionAudit) => {
        if (session.success || !session.failureReason) return '-';
        return (
          <Text
            fontSize="xs"
            color="red.700"
          >
            {session.failureReason}
          </Text>
        );
      },
    },
  ];

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'login':
        return actionsT('login');
      case 'logout':
        return actionsT('logout');
      case 'login_failed':
        return actionsT('loginFailed');
      case 'token_invalidated':
        return actionsT('tokenInvalidated');
      default:
        return action;
    }
  };

  const getActionColor = (action: string, success: boolean) => {
    switch (action) {
      case 'login':
        return colors.green[500];
      case 'logout':
        return colors.brand1[500];
      case 'login_failed':
        return colors.red[700];
      case 'token_invalidated':
        return colors.orange[500];
      default:
        return colors.gray[500];
    }
  };

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
            {sectionsT('sessionAudit')}
          </Heading>
          {subtitle && (
            <Text
              color="gray.600"
              fontSize="sm"
            >
              {subtitle}
            </Text>
          )}

          <TableComponent
            rows={sessions}
            columns={columns}
            loading={isLoading}
            emptyText={emptyText || sessionAuditT('noSessions')}
            metadata={pagination}
            onChangePage={onChangePage}
            shadow={false}
          />
        </VStack>
      </CardBody>
    </Card>
  );
};
