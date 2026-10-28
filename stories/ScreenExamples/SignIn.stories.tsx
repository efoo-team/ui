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

const meta = {
  title: '画面例 / サインイン',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SignInPage() {
  return (
    <Center mih="100dvh" p="md">
      <Card w="100%" maw={384}>
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={3} component="h1">
              サインイン
            </Title>
            <Text size="sm" c="dimmed">
              登録したメールアドレスとパスワードを入力してください
            </Text>
          </Stack>
          <form onSubmit={(event) => event.preventDefault()}>
            <Stack gap="md">
              <TextInput
                type="email"
                label="メールアドレス"
                placeholder="user@example.com"
                autoComplete="email"
                required
              />
              <Stack gap={4}>
                <PasswordInput label="パスワード" autoComplete="current-password" required />
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
