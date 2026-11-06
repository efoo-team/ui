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
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      // The screen fills the viewport height (100dvh), so each story is drawn in an iframe of its own.
      story: { inline: false, height: '720px' },
      description: {
        component:
          '架空の販売管理サービスのサインインの画面です。\n\n' +
          '**目的と読み手**　このサービスを使う社員が、使い始めるときに開く画面です。毎日使う人も通りますが、初めて使う人も必ず通る画面なので、慣れた人の速さよりも、初めて見る人が迷わず 1 つの行動に進めることを優先しています。\n\n' +
          '**情報構造**　扱う対象は、これから入る利用者のアカウント 1 つだけです。主はメールアドレスとパスワードの組で、シングルサインオン・パスワードの再設定・新規登録は、その組で入れないときの別の道として従に置きます。\n\n' +
          '**データパターン**　項目はメールアドレスとパスワードの 2 つで、どちらも必須です。状態は、何も入力していないとき（story『サインイン』）と、入力に誤りがあるとき（story『入力に誤りがあるとき』。形式の誤りと未入力）です。認証に失敗したとき（メールアドレスかパスワードが違う）と送信中の story はありません。\n\n' +
          '**情報の流れ**　利用者は見出しで何の画面かを知り、メールアドレスとパスワードを入れてサインインします。その道で入れないと分かったとき（パスワードを忘れた、シングルサインオンを使う、アカウントが無い）にだけ、主な道のすぐ下にある別の道を探します。\n\n' +
          '**主役**　流れの中心である 2 つの欄と、塗りの「サインイン」のボタンです。画面の中央に幅を絞ったカードを 1 枚だけ置き、塗りのボタンをこの 1 つに限っています。\n\n' +
          '**抑えたもの・使わなかったもの**　サインインの前は組織も利用者も決まっておらず、サイドバー・全体検索・アカウントのメニューのどれも使えないため、外枠（AppFrame）は使っていません。見出しはカードの見出しと同じ大きさに抑え、シングルサインオンは枠線のボタン、パスワードの再設定と新規登録は小さなリンクにして、主な道より目立たないようにしています。\n\n' +
          '**目的が違えば変わるところ**　組織の全員がシングルサインオンで入るサービスなら、パスワードの欄を置かず、シングルサインオンのボタンを塗りにして主役にします。アカウントを管理者だけが発行する社内のサービスなら、新規登録のリンクは置きません。',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story:
          'データパターンのうち、開いた直後の、何も入力していない状態です。エラーや追加の案内は出さず、メールアドレスの欄に薄く出す入力例（user@example.com）で、入れる形だけを示しています。',
      },
    },
  },
  render: () => <SignInPage />,
};

export const SignInWithErrors: Story = {
  name: '入力に誤りがあるとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンのうち、送信した入力に誤りがある状態（メールアドレスの形式の誤りと、パスワードの未入力）です。ブラウザの英語の吹き出しを使わず、誤りのある欄の真下に日本語で理由を出し、キーボードで操作する人がそのまま直せるよう、誤りのある最初の欄へフォーカスを移します。',
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
