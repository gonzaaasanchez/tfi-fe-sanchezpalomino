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
import { signIn } from 'next-auth/react';
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
      <VStack spacing={{ base: 6, sm: 8 }} w="full">
        <Heading 
          as="h2" 
          color="brand1.700" 
          size={{ base: "lg", sm: "xl", md: "h2" }}
          textAlign="center"
          mb={{ base: 2, sm: 4 }}
        >
          {t('title')}
        </Heading>
        
        <Box as="form" noValidate onSubmit={handleSubmit(onSubmit)} w="full">
          <VStack spacing={{ base: 4, sm: 6 }} w="full">
            <FormControl isInvalid={!!errors.email} w="full">
              <FormLabel 
                htmlFor="email"
                fontSize="md"
                mb={{ base: 2, sm: 3 }}
              >
                {t('labels.email')}
              </FormLabel>
              <Input
                id="email"
                placeholder={t('placeholders.email')}
                size="md"
                fontSize="md"
                {...register('email', {
                  required: te('required'),
                  pattern: emailPattern(te('email'))
                })}
              />
              <FormErrorMessage fontSize={{ base: "xs", sm: "sm" }}>
                <FormErrorIcon me={1} />
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!errors.password} w="full">
              <FormLabel 
                htmlFor="password"
                fontSize="md"
                mb={{ base: 2, sm: 3 }}
              >
                {t('labels.password')}
              </FormLabel>
              <Input
                id="password"
                type="password"
                placeholder={t('placeholders.password')}
                size="md"
                fontSize="md"
                {...register('password', {
                  required: te('required'),
                  // pattern: passwordPattern(te('password'))
                })}
              />
              <FormErrorMessage fontSize={{ base: "xs", sm: "sm" }}>
                <FormErrorIcon me={1} />
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            
            <Button
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              type="submit"
              w="full"
              size="md"
              mt={{ base: 4, sm: 6 }}
              colorScheme="brand1"
            >
              {t('cta.submit')}
            </Button>
          </VStack>
        </Box>
      </VStack>
    </FormProvider>
  );
};
