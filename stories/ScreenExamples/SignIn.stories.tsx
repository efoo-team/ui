import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Anchor,
  Button,
  Card,
  Center,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, type FormErrors } from '@mantine/form';

const meta = {
  title: '画面例 / サインイン',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface SignInValues {
  email: string;
  password: string;
}

const FIELD_ORDER = ['email', 'password'] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string) {
  if (value.trim() === '') return 'メールアドレスを入力してください';
  return EMAIL_PATTERN.test(value) ? null : 'メールアドレスの形式が正しくありません';
}

function validatePassword(value: string) {
  return value === '' ? 'パスワードを入力してください' : null;
}

function SignInPage({
  initialValues = { email: '', password: '' },
  initialErrors,
}: {
  initialValues?: SignInValues;
  initialErrors?: FormErrors;
}) {
  const form = useForm<SignInValues>({
    mode: 'uncontrolled',
    initialValues,
    initialErrors,
    validate: { email: validateEmail, password: validatePassword },
    validateInputOnBlur: true,
  });

  return (
    <Center mih="100dvh" p="md">
      <Card w="100%" maw={384}>
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={1} size="h5">
              サインイン
            </Title>
            <Text size="sm" c="dimmed">
              メールアドレスとパスワードを入力します
            </Text>
          </Stack>
          {/* noValidate replaces the browser's English bubbles with the Japanese messages below each field. */}
          <form
            noValidate
            onSubmit={form.onSubmit(
              () => undefined,
              // Move focus to the first field with an error so keyboard users land on it.
              (errors) => {
                const first = FIELD_ORDER.find((field) => errors[field]);
                if (first) form.getInputNode(first)?.focus();
              },
            )}
          >
            <Stack gap="md">
              <TextInput
                type="email"
                label="メールアドレス"
                placeholder="user@example.com"
                autoComplete="email"
                required
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <Stack gap={4}>
                <PasswordInput
                  label="パスワード"
                  autoComplete="current-password"
                  required
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                  // Mantine 9 sets aria-invalid on TextInput but not on the inner field of PasswordInput.
                  aria-invalid={form.errors.password ? true : undefined}
                />
                <Anchor href="#" size="sm" ta="right">
                  パスワードを忘れた場合
                </Anchor>
              </Stack>
              <Stack gap="sm">
                <Button type="submit" fullWidth>
                  サインイン
                </Button>
                <Button variant="outline" fullWidth>
                  シングルサインオンでサインイン
                </Button>
              </Stack>
              <Text size="sm" c="dimmed" ta="center">
                アカウントをお持ちでない場合は{' '}
                <Anchor href="#" inherit>
                  新規登録
                </Anchor>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Center>
  );
}

export const SignIn: Story = {
  name: 'サインイン',
  render: () => <SignInPage />,
};

export const SignInWithErrors: Story = {
  name: '入力に誤りがあるとき',
  parameters: {
    docs: {
      description: {
        story: '送信したときに、欄ごとに日本語の理由を表示します。',
      },
    },
  },
  render: () => (
    <SignInPage
      initialValues={{ email: 'user@example', password: '' }}
      initialErrors={{
        email: validateEmail('user@example'),
        password: validatePassword(''),
      }}
    />
  ),
};
