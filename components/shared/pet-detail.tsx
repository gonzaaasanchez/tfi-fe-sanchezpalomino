import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  Divider,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Pet } from 'lib/types/pet';
import { useTranslations } from 'next-intl';

interface PetDetailProps {
  pet: Pet;
  onBack?: () => void;
  showBackButton?: boolean;
  backButtonText?: string;
}

export const PetDetail: React.FC<PetDetailProps> = ({
  pet,
  onBack,
  showBackButton = true,
  backButtonText = 'Volver',
}) => {
  const t = useTranslations('pages.pets.view');
  return (
    <VStack
      spacing={6}
      align="stretch"
    >
      {/* Header */}
      <Box>
        <HStack
          justify="space-between"
          align="flex-start"
        >
          <Box>
            <Heading
              size="lg"
              mb={2}
              color="gray.800"
            >
              {t('title')}
            </Heading>
            <Text color="gray.600">{t('description')}</Text>
          </Box>
          {showBackButton && onBack && (
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="outline"
              onClick={onBack}
            >
              {backButtonText}
            </Button>
          )}
        </HStack>
      </Box>

      {/* Pet Details */}
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
              {t('sections.petInfo')}
            </Heading>

            <VStack
              spacing={4}
              align="stretch"
            >
              <HStack justify="space-between">
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                >
                  {t('fields.id')}:
                </Text>
                <Text color="gray.600">{pet.id}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                >
                  {t('fields.name')}:
                </Text>
                <Text color="gray.600">{pet.name}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                >
                  {t('fields.petType')}:
                </Text>
                <Text color="gray.600">{pet.petType?.name || '-'}</Text>
              </HStack>

              {pet.comment && (
                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.comment')}:
                  </Text>
                  <Text color="gray.600">{pet.comment}</Text>
                </HStack>
              )}

              <HStack justify="space-between">
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                >
                  {t('fields.owner')}:
                </Text>
                <Text color="gray.600">
                  {pet.owner?.firstName} {pet.owner?.lastName}
                </Text>
              </HStack>

              {pet.characteristics && pet.characteristics.length > 0 && (
                <Box>
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                    mb={2}
                  >
                    {t('fields.characteristics')}:
                  </Text>
                  <VStack
                    align="start"
                    spacing={1}
                  >
                    {pet.characteristics.map((char, index) => (
                      <Text
                        key={index}
                        color="gray.600"
                      >
                        • {char.name}: {char.value}
                      </Text>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>

            <Divider />

            {/* Timestamps */}
            <VStack
              spacing={4}
              align="stretch"
            >
              {pet.createdAt && (
                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.createdAt')}:
                  </Text>
                  <Text color="gray.600">
                    {new Date(pet.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </HStack>
              )}

              {pet.updatedAt && (
                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.updatedAt')}:
                  </Text>
                  <Text color="gray.600">
                    {new Date(pet.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
