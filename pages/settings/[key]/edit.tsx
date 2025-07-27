import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  HStack,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Textarea,
  FormHelperText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import {
  useGetConfig,
  useUpdateConfig,
  useGetEntityLogs,
  usePermissions,
} from 'lib/hooks';
import { Loader, AuditPage } from 'components/shared';
import { Config } from 'lib/types/config';
import { useConfigDisplayName } from 'lib/helpers/config-utils';
import { useState, useEffect } from 'react';

interface EditConfigPageProps {
  key: string;
}

const EditConfigPage: NextPageWithLayout<EditConfigPageProps> = ({ key }) => {
  const t = useTranslations('pages.settings.edit');
  const router = useRouter();
  const { canRead, isSuperAdmin } = usePermissions();
  const getConfigDisplayName = useConfigDisplayName();

  // Get key from router params as fallback
  const configKey = key || (router.query.key as string);

  const { config, isPending } = useGetConfig(configKey);
  const updateConfigMutation = useUpdateConfig(configKey);
  const { data: logsData, isPending: isLogsPending } = useGetEntityLogs(
    'Config',
    config?.id || ''
  );

  const [value, setValue] = useState<any>(config?.value || '');
  const canViewChangesLogs = isSuperAdmin() || canRead('logs');

  // Update local state when config is loaded
  useEffect(() => {
    if (config) {
      setValue(config.value);
    }
  }, [config]);

  const handleBack = () => {
    router.push('/settings');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!config) return;

    try {
      await updateConfigMutation.mutateAsync({
        value: value,
        type: config.type,
        description: config.description,
      });
      router.push('/settings');
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const renderField = (config: Config) => {
    const fieldId = `config-${config.key}`;

    switch (config.type) {
      case 'number':
        return (
          <NumberInput
            value={value || 0}
            onChange={(_, val) => setValue(val)}
            min={0}
            max={100}
            size="md"
            variant="outline"
            focusBorderColor="brand1.500"
            borderColor="gray.300"
            _hover={{ borderColor: 'gray.400' }}
          >
            <NumberInputField
              borderRadius="sm"
              fontSize="sm"
              _focus={{
                borderColor: 'brand1.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand1-500)',
              }}
            />
            <NumberInputStepper>
              <NumberIncrementStepper
                border="none"
                bg="gray.50"
                color="gray.600"
                _hover={{ bg: 'brand1.50', color: 'brand1.600' }}
                _active={{ bg: 'brand1.100' }}
              >
                +
              </NumberIncrementStepper>
              <NumberDecrementStepper
                border="none"
                bg="gray.50"
                color="gray.600"
                _hover={{ bg: 'brand1.50', color: 'brand1.600' }}
                _active={{ bg: 'brand1.100' }}
              >
                -
              </NumberDecrementStepper>
            </NumberInputStepper>
          </NumberInput>
        );

      case 'boolean':
        return (
          <Switch
            isChecked={value}
            onChange={(e) => setValue(e.target.checked)}
            colorScheme="blue"
          />
        );

      case 'object':
        return (
          <Textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                setValue(JSON.parse(e.target.value));
              } catch {
                // Keep the string value if JSON is invalid
                setValue(e.target.value);
              }
            }}
            rows={6}
            fontFamily="mono"
            fontSize="sm"
          />
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          />
        );
    }
  };

  if (isPending) {
    return <Loader fullHeight />;
  }

  if (!config) {
    return (
      <Container
        maxW="container.lg"
        py={8}
      >
        <Text>{t('notFound')}</Text>
      </Container>
    );
  }

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
      />

      <Container
        maxW="container.lg"
        py={8}
      >
        <VStack
          spacing={6}
          align="stretch"
        >
          {/* Breadcrumb */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                color="gray.500"
              >
                {t('breadcrumb.home')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/settings"
                color="gray.500"
              >
                {t('breadcrumb.settings')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink
                color="brand1.700"
                fontWeight="medium"
              >
                {t('breadcrumb.edit')}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

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
                  {t('title')}: {config ? getConfigDisplayName(config.key) : ''}
                </Heading>
                <Text
                  color="gray.600"
                  fontSize="sm"
                >
                  {t('description')}
                </Text>
              </Box>
              <Button
                leftIcon={<ArrowBackIcon />}
                variant="outline"
                onClick={handleBack}
              >
                {t('actions.back')}
              </Button>
            </HStack>
          </Box>

          {/* Tabs */}
          <Tabs
            variant="enclosed"
            colorScheme="brand1"
            borderColor="brand1.300"
          >
            <TabList>
              <Tab
                bg="brand1.200"
                color="brand1.700"
                fontSize="sm"
                _selected={{
                  bg: 'brand1.600',
                  color: 'white',
                }}
                _hover={{ bg: 'brand1.300' }}
              >
                {t('tabs.edit')}
              </Tab>
              {/* TODO: TFI content */}
              {/* {canViewChangesLogs && (
                <Tab
                  bg="brand1.200"
                  color="brand1.700"
                  fontSize="sm"
                  _selected={{
                    bg: 'brand1.600',
                    color: 'white',
                  }}
                  _hover={{ bg: 'brand1.300' }}
                >
                  {t('tabs.audit')}
                </Tab>
              )} */}
            </TabList>

            <TabPanels>
              {/* Edit Tab */}
              <TabPanel>
                <Card>
                  <CardBody>
                    <Box
                      as="form"
                      onSubmit={handleSubmit}
                    >
                      <VStack
                        spacing={6}
                        align="stretch"
                      >
                        <FormControl isRequired>
                          <FormLabel htmlFor={`config-${config.key}`}>
                            {getConfigDisplayName(config.key)}
                          </FormLabel>
                          {renderField(config)}
                          <FormHelperText>{config.description}</FormHelperText>
                        </FormControl>

                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          gap={3}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                          >
                            {t('form.cta.cancel')}
                          </Button>
                          <Button
                            type="submit"
                            colorScheme="blue"
                            isLoading={updateConfigMutation.isPending}
                            loadingText={t('form.loading.updating')}
                          >
                            {t('form.cta.update')}
                          </Button>
                        </Box>
                      </VStack>
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Audit Tab */}
              {canViewChangesLogs && (
                <TabPanel>
                  <AuditPage
                    logs={logsData?.data || []}
                    subtitle={t('audit.description')}
                    t={t}
                    isLoading={isLogsPending}
                    emptyText={t('audit.noChanges')}
                  />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </>
  );
};

EditConfigPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const errors: any = await handlePermission(
    ctx.req,
    ctx.res,
    '/settings/edit'
  );
  if (errors) {
    return errors;
  }

  const key = params?.key as string;

  return {
    props: {
      key,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.settings.edit',
        'pages.settings.index',
        'layouts.private.header',
        'lib.hooks.configs',
        'general.common',
        'general.sidebar',
        'general.audit',
        'general.configKeys',
      ]),
    },
  };
};

export default EditConfigPage;
