import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Heading,
  Text,
  VStack
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';
import { UserForm } from 'components/forms/user';
import { useCustomToast } from '@hooks/use-custom-toast';
import { PrivateLayout } from 'layouts';
import { NextSeo } from 'next-seo';
import { useGetUser, useUpdateUser } from 'lib/hooks';
import { UserFormType } from 'lib/types/forms';

interface EditUserPageProps {
  id: string;
}

const EditUserPage: NextPage<EditUserPageProps> = ({ id }) => {
  const t = useTranslations('pages.users.edit');
  const router = useRouter();
  const { successToast } = useCustomToast();
  const { user, isPending } = useGetUser({ id });
  const updateUserMutation = useUpdateUser(id);

  const handleSuccess = () => {
    successToast('Usuario actualizado exitosamente');
    router.push('/users');
  };

  const handleCancel = () => {
    router.push('/users');
  };

  if (isPending) {
    return (
      <Container maxW="container.lg" py={8}>
        <Text>Cargando...</Text>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxW="container.lg" py={8}>
        <Text>Usuario no encontrado</Text>
      </Container>
    );
  }

  const defaultValues: UserFormType = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: '', // No mostrar contraseña actual
    role: user.role?.id || 'user'
  };

  return (
    <PrivateLayout>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
      />

      <Container maxW="container.lg" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" color="gray.500">
                {t('breadcrumb.home')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/users" color="gray.500">
                {t('breadcrumb.users')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="brand1.700" fontWeight="medium">
                {t('breadcrumb.edit')}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box>
            <Text color="gray.600" fontSize="lg">
              {t('description')}
            </Text>
          </Box>

          {/* Form */}
          <UserForm
            mode="edit"
            title={t('title')}
            defaultValues={defaultValues}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            updateMutation={updateUserMutation}
          />
        </VStack>
      </Container>
    </PrivateLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const id = params?.id as string;
  
  return {
    props: {
      id,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.users.edit',
        'pages.users.index',
        'layouts.private.header',
        'components.forms.user',
        'general.form.errors'
      ])
    }
  };
};

export default EditUserPage; 