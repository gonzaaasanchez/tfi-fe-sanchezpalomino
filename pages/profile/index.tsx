import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  HStack,
  Divider,
  useDisclosure,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { PrivateLayout } from 'layouts';
import { ChangePasswordModal } from 'components/shared/change-password-modal';

const ProfilePage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const t = useTranslations('pages.profile');
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
      />

      <Container
        maxW="container.md"
        py={8}
      >
        <VStack
          spacing={6}
          align="stretch"
        >
          {/* Header */}
          <Box>
            <Heading
              size="lg"
              color="gray.800"
              mb={2}
            >
              {t('title')}
            </Heading>
            <Text color="gray.600">{t('description')}</Text>
          </Box>

          {/* Profile Information */}
          <Card>
            <CardBody>
              <VStack
                spacing={4}
                align="stretch"
              >
                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.firstName')}:
                  </Text>
                  <Text color="gray.600">
                    {session?.user?.firstName || '-'}
                  </Text>
                </HStack>

                <Divider />

                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.lastName')}:
                  </Text>
                  <Text color="gray.600">{session?.user?.lastName || '-'}</Text>
                </HStack>

                <Divider />

                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.email')}:
                  </Text>
                  <Text color="gray.600">{session?.user?.email || '-'}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Change Password Button */}
          <Button
            onClick={onOpen}
            colorScheme="brand1"
            size="sm"
            alignSelf="flex-start"
          >
            {t('actions.changePassword')}
          </Button>
        </VStack>
      </Container>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isOpen}
        onClose={onClose}
        email={session?.user?.email || ''}
      />
    </>
  );
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.profile',
        'lib.shared.changePassword',
        'general.form.errors',
        'lib.hooks.auth.responses',
        'layouts.private.header',
      ]),
    },
  };
};

export default ProfilePage;
