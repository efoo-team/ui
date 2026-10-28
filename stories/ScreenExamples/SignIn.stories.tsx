import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Anchor,
  Button,
  Card,
  Center,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

const meta = {
  title: '画面例 / サインイン',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function LoginPage() {
  return (
    <Center mih="100dvh" p={{ base: 'lg', sm: 'xl' }} bg="var(--mantine-color-body)">
      <Card w="100%" maw={384} padding="lg" radius="lg" shadow="sm">
        <Stack gap="lg">
          <Stack gap={6}>
            <Text component="h1" fw={600}>
              アカウントにログイン
            </Text>
            <Text fz="sm" c="dimmed">
              登録したメールアドレスを入力してください
            </Text>
          </Stack>
          <form onSubmit={(event) => event.preventDefault()}>
            <Stack gap="lg">
              <TextInput
                size="sm"
                type="email"
                label="メールアドレス"
                placeholder="user@example.com"
                autoComplete="email"
                required
                withAsterisk={false}
              />
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text component="label" htmlFor="login-password" fz="sm" fw={500}>
                    パスワード
                  </Text>
                  <Anchor href="#" fz="sm" c="var(--mantine-color-text)">
                    パスワードを忘れた場合
                  </Anchor>
                </Group>
                <PasswordInput
                  id="login-password"
                  size="sm"
                  autoComplete="current-password"
                  required
                />
              </Stack>
              <Stack gap="sm">
                <Button type="submit" size="sm" fullWidth>
                  ログイン
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  シングルサインオンでログイン
                </Button>
              </Stack>
              <Text fz="sm" c="dimmed" ta="center">
                アカウントをお持ちでない場合は{' '}
                <Anchor href="#" inherit c="var(--mantine-color-text)" underline="always">
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
  render: () => <LoginPage />,
};
