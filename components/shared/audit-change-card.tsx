import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Log } from '@interfaces/log';
import { PermissionChange, detectPermissionChanges } from 'lib/helpers/utils';
import { useTranslations } from 'next-intl';

interface AuditChangeCardProps {
  log: Log;
  t: (key: string) => string;
  getFieldLabel: (field: string) => string;
}

export const AuditChangeCard: React.FC<AuditChangeCardProps> = ({
  log,
  t,
  getFieldLabel,
}) => {
  const generalT = useTranslations('general.audit');
  const permissionsT = useTranslations('general.permissions');
  
  const getPermissionLabel = (module: string, action: string) => {
    try {
      const moduleLabel = permissionsT(`modules.${module}`);
      const actionLabel = permissionsT(`actions.${action}`);
      return `${moduleLabel}/${actionLabel}`;
    } catch (error) {
      // Fallback si no encuentra las traducciones
      return `${module}/${action}`;
    }
  };
  
  // Detectar cambios específicos si es un cambio de permisos
  let permissionChanges: PermissionChange[] = [];
  if (log.oldValue && log.newValue) {
    try {
      // Si los valores ya son objetos, usarlos directamente
      const oldPermissions =
        typeof log.oldValue === 'string'
          ? JSON.parse(log.oldValue)
          : log.oldValue;
      const newPermissions =
        typeof log.newValue === 'string'
          ? JSON.parse(log.newValue)
          : log.newValue;

      permissionChanges = detectPermissionChanges(
        oldPermissions,
        newPermissions
      );
    } catch (error) {
      // Si no se puede parsear como JSON, continuar con el formato original
    }
  }

  return (
    <Box
      mb={4}
      p={4}
      bg="white"
      borderRadius="md"
      border="1px"
      borderColor="gray.200"
    >
      <Text color="gray.700">
        {generalT('text.userPrefix')}
        <Text
          as="span"
          fontWeight="bold"
        >
          {log.userName}
        </Text>
        {generalT('text.changesSuffix')}
        <Text
          as="span"
          fontWeight="bold"
        >
          {new Date(log.timestamp).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Text>

      {permissionChanges.length > 0 ? (
        <Box mt={2}>
          <Text
            fontWeight="semibold"
            color="gray.800"
            mb={2}
          >
            {getFieldLabel(log.field)}:
          </Text>
          <Text
            color="gray.700"
            mb={2}
          >
            <Text
              as="span"
              fontWeight="medium"
            >
              {generalT('labels.oldValue')}:
            </Text>
          </Text>
          <Box
            p={2}
            bg="gray.50"
            borderRadius="md"
            mb={2}
          >
            {permissionChanges.map((change, index) => (
              <Text
                key={index}
                fontSize="smaller"
                fontFamily="mono"
                color="gray.600"
              >
                {getPermissionLabel(change.module, change.action)} : {change.oldValue ? 'true' : 'false'}
              </Text>
            ))}
          </Box>
          <Text
            color="gray.700"
            mb={2}
          >
            <Text
              as="span"
              fontWeight="medium"
            >
              {generalT('labels.newValue')}:
            </Text>
          </Text>
          <Box
            p={2}
            bg="gray.50"
            borderRadius="md"
          >
            {permissionChanges.map((change, index) => (
              <Text
                key={index}
                fontSize="smaller"
                fontFamily="mono"
                color="gray.600"
              >
                {getPermissionLabel(change.module, change.action)} : {change.newValue ? 'true' : 'false'}
              </Text>
            ))}
          </Box>
        </Box>
      ) : (
        <Box mt={2}>
          <Text
            fontWeight="semibold"
            color="gray.800"
            mb={2}
          >
            {getFieldLabel(log.field)}:
          </Text>
          <Text
            color="gray.700"
            mb={2}
          >
            <Text
              as="span"
              fontWeight="medium"
              fontSize="sm"
            >
              {generalT('labels.oldValue')}
            </Text>
          </Text>
          <Box
            p={2}
            bg="gray.50"
            borderRadius="md"
            mb={2}
          >
            <Text
              fontSize="smaller"
              fontFamily="mono"
              color="gray.600"
            >
              {typeof log.oldValue === 'object'
                ? JSON.stringify(log.oldValue, null, 2)
                : String(log.oldValue || 'N/A')}
            </Text>
          </Box>
          <Text
            color="gray.700"
            mb={2}
          >
            <Text
              as="span"
              fontWeight="medium"
            >
              {generalT('labels.newValue')}
            </Text>
          </Text>
          <Box
            p={2}
            bg="gray.50"
            borderRadius="md"
          >
            <Text
              fontSize="smaller"
              fontFamily="mono"
              color="gray.600"
            >
              {typeof log.newValue === 'object'
                ? JSON.stringify(log.newValue, null, 2)
                : String(log.newValue || 'N/A')}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};
