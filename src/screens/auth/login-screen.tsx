import React from 'react';

import {KeyboardAvoidingView, ScrollView, TextInput as RNTextInput} from 'react-native';

import {z} from 'zod/v3';

import {is_ios} from '@app/constan/app';
import {SCREEN_HEIGHT} from '@app/constan/dimensions';
import {Box, Text, useTheme} from '@app/themes';
import {Button} from '@components/button';
import {IconButton} from '@components/button/icon-button';
import {Container} from '@components/container';
import {Divider} from '@components/divider';
import {TextInput} from '@components/inputs';
import {TKeys, translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';

type LoginForm = {
  email: string;
  password: string;
};

type LoginFormErrors = Partial<Record<keyof LoginForm, string>>;

const LoginScreen = () => {
  const t = translate;
  const {spacing} = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, setForm] = React.useState<LoginForm>({email: '', password: ''});
  const [errors, setErrors] = React.useState<LoginFormErrors>({});
  const emailRef = React.useRef<RNTextInput | null>(null);
  const passwordRef = React.useRef<RNTextInput | null>(null);

  const validationMessage = React.useMemo(
    () => ({
      emailInvalid: t('auth.login.emailInvalid'),
      emailRequired: t('auth.login.emailRequired'),
      passwordMinLength: t('auth.login.passwordMinLength'),
      passwordRequired: t('auth.login.passwordRequired'),
    }),
    [t],
  );

  const loginSchema = React.useMemo(
    () =>
      z.object({
        email: z.string().trim().min(1, validationMessage.emailRequired).email(validationMessage.emailInvalid),
        password: z
          .string()
          .trim()
          .min(1, validationMessage.passwordRequired)
          .min(6, validationMessage.passwordMinLength),
      }),
    [validationMessage],
  );

  const emailSchema = React.useMemo(
    () =>
      z.object({
        email: z.string().trim().min(1, validationMessage.emailRequired).email(validationMessage.emailInvalid),
      }),
    [validationMessage],
  );

  const setFieldValue = (field: keyof LoginForm, value: string) => {
    setForm(previous => ({...previous, [field]: value}));
    setErrors(previous => ({...previous, [field]: undefined}));
  };

  const validateEmailOnly = React.useCallback(() => {
    const parsed = emailSchema.safeParse({email: form.email});

    if (!parsed.success) {
      const emailIssue = parsed.error.issues.find(issue => issue.path[0] === 'email');

      setErrors(previous => ({...previous, email: emailIssue?.message ?? validationMessage.emailInvalid}));
      return false;
    }

    setErrors(previous => ({...previous, email: undefined}));
    return true;
  }, [emailSchema, form.email, validationMessage.emailInvalid]);

  const onEmailSubmitEditing = () => {
    const isEmailValid = validateEmailOnly();

    if (isEmailValid) {
      passwordRef.current?.focus();
    }
  };

  const onSubmit = () => {
    const parsed = loginSchema.safeParse(form);

    if (!parsed.success) {
      const nextErrors: LoginFormErrors = {};

      parsed.error.issues.forEach(issue => {
        const [path] = issue.path;

        if ((path === 'email' || path === 'password') && !nextErrors[path]) {
          nextErrors[path] = issue.message;
        }
      });

      setErrors(nextErrors);
      return;
    }

    setErrors({});
  };

  return (
    <Container withBackgroundImage>
      <KeyboardAvoidingView
        behavior={is_ios ? 'padding' : undefined}
        keyboardVerticalOffset={is_ios ? 54 : 0}
        style={{flex: 1}}
      >
        <IconButton
          iconName="chevron-left"
          ButtonStyle={{position: 'absolute', top: spacing.md, left: spacing.md, zIndex: 10000}}
          onPress={() => Navigation.back()}
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: spacing.md,
            marginTop: SCREEN_HEIGHT * 0.2,
            justifyContent: 'center',
          }}
        >
          <Text textAlign={'center'} color={'primary_dark'} variant={'h_2_poppins_bold'}>
            {t(TKeys['auth.login.title'])}
          </Text>
          <Text mt={'sm'} textAlign={'center'} color={'grey'} variant={'body_poppins_medium'}>
            {t(TKeys['auth.login.subtitle'])}
          </Text>
          <Box marginVertical={'xl'}>
            <TextInput
              ref={emailRef}
              value={form.email}
              label={t(TKeys['auth.login.emailLabel'])}
              placeholder={t(TKeys['auth.login.emailPlaceholder'])}
              returnKeyType="next"
              blurOnSubmit={false}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={onEmailSubmitEditing}
              onChangeText={value => setFieldValue('email', value)}
              error={errors.email}
            />
            <Divider vertical="lg" />
            <TextInput
              ref={passwordRef}
              value={form.password}
              label={t(TKeys['auth.login.passwordLabel'])}
              placeholder={t(TKeys['auth.login.passwordPlaceholder'])}
              secureTextEntry={!showPassword}
              iconRightName={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowPassword(prev => !prev)}
              onChangeText={value => setFieldValue('password', value)}
              error={errors.password}
            />
            <Divider vertical="sm" />
            <Text textAlign={'right'} color={'primary'} variant={'body_poppins_medium'}>
              {t(TKeys['auth.login.forgotPassword'])}
            </Text>
            <Divider vertical="xl" />
            <Button label={t(TKeys['auth.login.submit'])} onPress={onSubmit} />
            <Divider vertical="md" />
            <Text textAlign={'center'} color={'grey'} variant={'body_poppins_medium'}>
              {t(TKeys['auth.login.signupPrompt'])}{' '}
              <Text color={'primary'} variant={'body_poppins_medium'} onPress={() => {}}>
                {t(TKeys['auth.login.signup'])}
              </Text>
            </Text>
          </Box>
          <Text textAlign={'center'} color={'grey'} variant={'body_helper_poppins_medium'}>
            Version 1.0.0
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export {LoginScreen};
