import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack
} from '@chakra-ui/react';
import { emailPattern } from '@helpers/field-validators';
import { getSession, signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useCustomToast } from '@hooks/use-custom-toast';
import { LoginFormType } from '@interfaces/forms';
import { FormErrorIcon } from 'components/icons/src/form-error-icon';

export const LoginForm: React.FC = () => {
  const t = useTranslations('components.forms.auth.login');
  const te = useTranslations('general.form.errors');
  const router = useRouter();
  const methods = useForm<LoginFormType>({ mode: 'all' });
  const {
    formState: { errors, isValid },
    handleSubmit,
    register
  } = methods;
  const { errorToast, successToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async ({ email, password }: LoginFormType) => {
    setIsSubmitting(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (res?.ok) {
        successToast(t('responses.success'));
        router.push('/dashboard');
      } else {
        errorToast(res?.error || t('responses.error'));
      }
    } catch (error) {
      errorToast('Error inesperado durante el login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <Box>
        <Heading as="h2" color="white" size="h2" textAlign="center">
          {t('title')}
        </Heading>
        <Box as="form" mt={8} noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">{t('labels.email')}</FormLabel>
            <Input
              id="email"
              placeholder={t('placeholders.email')}
              {...register('email', {
                required: te('required'),
                pattern: emailPattern(te('email'))
              })}
            />
            <FormErrorMessage>
              <FormErrorIcon me={1} />
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={!!errors.password} mt={4}>
            <FormLabel htmlFor="password">{t('labels.password')}</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder={t('placeholders.password')}
              {...register('password', {
                required: te('required'),
                // pattern: passwordPattern(te('password'))
              })}
            />
            <FormErrorMessage>
              <FormErrorIcon me={1} />
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          
          <VStack textAlign="center">
            <Button
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              mt={5}
              mx="auto"
              type="submit"
            >
              {t('cta.submit')}
            </Button>
          </VStack>
        </Box>
      </Box>
    </FormProvider>
  );
};
