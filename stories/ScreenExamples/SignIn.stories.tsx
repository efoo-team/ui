import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import {
  Alert,
  Anchor,
  Button,
  Card,
  Divider,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, type FormErrors } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { ATTENTION_COLOR, SERVICE_NAME } from './shared/constants';

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
          '**情報構造**　扱う対象は、これから入る利用者のアカウント 1 つだけです。主はメールアドレスとパスワードの組で、シングルサインオンとパスワードの再設定は、その組で入れないときの別の道として従に置きます。アカウントは管理者の招待で作られるので、アカウントが無い人には、この画面で作る道ではなく、管理者に招待を頼むことを最後に案内します。\n\n' +
          '**データパターン**　項目はメールアドレスとパスワードの 2 つで、どちらも必須です。状態は、何も入力していないとき（story『サインイン』）、入力に誤りがあるとき（story『入力に誤りがあるとき』。形式の誤りと未入力）、送信して確かめているあいだ（story『送信中』）、送った組がアカウントと合わなかったとき（story『メールアドレスかパスワードが違うとき』）の 4 つです。最後の状態がサインインで最も多い失敗です。\n\n' +
          '**情報の流れ**　利用者は見出しで、どのサービスのサインインの画面かを知り、メールアドレスとパスワードを入れてサインインします。入れなかったときは、フォームの上の知らせで理由を知り、入力し直します。カードは画面の上寄りに固定しているので、知らせが出ても見出しは動かず、欄が下へずれるだけです。その道で入れないと分かったとき（パスワードを忘れた、シングルサインオンを使う、アカウントが無い）にだけ、主な道のすぐ下にある別の道を探します。\n\n' +
          '**主役**　流れの中心である 2 つの欄と、塗りの「サインイン」のボタンです。幅を絞ったカードを 1 枚だけ置き、塗りのボタンをこの 1 つに限っています。見出しにはサービスの名前（架空の「販売管理」）を入れ、ほかの画面のページ見出しと同じ大きさにして、初めての人や、期限が切れて戻された人が、正しいサービスに来たかをその場で確かめられるようにしました。\n\n' +
          '**抑えたもの・使わなかったもの**　サインインの前は組織も利用者も決まっておらず、サイドバー・全体検索・アカウントのメニューのどれも使えないため、外枠（AppFrame）は使っていません。シングルサインオンは「または」の区切りの下に枠線のボタンで置いて、2 つを順に押すのではなくどちらか一方を選ぶものだと分かるようにし、パスワードの再設定は小さなリンクにして、主な道より目立たないようにしています。アカウントが無い人への案内は、リンクにせず 1 文だけにしました。サインインの前は組織も管理者も決まっておらず、この画面から頼みを送る先が無いためです。欄のラベルと同じことを言うだけの補足の文は置いていません。認証の失敗は、メールアドレスとパスワードのどちらが違うかを書かない 1 件の Alert にしました。どちらかを書くと、登録されたメールアドレスかどうかを他人が確かめられてしまうためです（アカウントの列挙）。\n\n' +
          '**目的が違えば変わるところ**　組織の全員がシングルサインオンで入るサービスなら、パスワードの欄を置かず、シングルサインオンのボタンを塗りにして主役にします。取引先や一般の人が自分でアカウントを作れるサービスなら、招待を頼む案内の代わりに新規登録のリンクを置きます。',
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
  if (value.trim() === '') return 'メールアドレスを入力してください。';
  return EMAIL_PATTERN.test(value)
    ? null
    : 'メールアドレスの形式が正しくありません。user@example.com の形で入力してください。';
}

function validatePassword(value: string) {
  return value === '' ? 'パスワードを入力してください。' : null;
}

// How long the fictional check of the account takes, so the waiting state can be seen.
const CHECK_DELAY = 1200;

function SignInPage({
  initialValues = { email: '', password: '' },
  initialErrors,
  authFailed: authFailedProp = false,
  submitting: submittingProp = false,
}: {
  initialValues?: SignInValues;
  initialErrors?: FormErrors;
  /** Opens the page with the message that the pair did not match, for the story that shows it. */
  authFailed?: boolean;
  /** Holds the page in the waiting state, for the story that shows it. */
  submitting?: boolean;
}) {
  const [authFailed, setAuthFailed] = useState(authFailedProp);
  const [failures, setFailures] = useState(0);
  const form = useForm<SignInValues>({
    mode: 'uncontrolled',
    initialValues,
    initialErrors,
    validate: { email: validateEmail, password: validatePassword },
    validateInputOnBlur: true,
  });
  const submitting = submittingProp || form.submitting;

  // After a failed check the cleared password is where the user types next. A pressed button that showed the wait
  // was disabled meanwhile and lost focus, so focus moves once the wait is over.
  useEffect(() => {
    if (failures > 0 && !form.submitting) form.getInputNode('password')?.focus();
    // The form object changes on every render, so the focus follows only a new failure and the end of the wait.
  }, [failures, form.submitting]);

  return (
    /*
     * The card hangs from a fixed top instead of the middle of the screen: a message that appears above the form then
     * pushes the form down, not the heading up, and on a phone the fields stay near the top, clear of the keyboard.
     */
    <Stack align="center" mih="100dvh" px="md" pb="md" pt={{ base: 'xl', sm: '18dvh' }}>
      <Card w="100%" maw={384}>
        <Stack gap="lg">
          {/* The service's name is the only line that says where the user is, so it takes the page-heading size the
              other screens use. Someone signing in for the first time, or sent back here when a session ended, can
              tell they are at the right service. A service puts its own name here, not a logo. */}
          <Title order={1} size="h3">
            {SERVICE_NAME}にサインイン
          </Title>
          {/*
           * The most common failure. One message for both fields: telling which of the two is wrong would tell anyone
           * typing addresses which ones have an account. Mantine's Alert has role="alert", so it is read when it appears.
           */}
          {authFailed && (
            <Alert
              color={ATTENTION_COLOR}
              icon={<IconAlertCircle />}
              title="サインインできませんでした"
            >
              メールアドレスかパスワードが違います。確かめて、もう一度入力してください。
            </Alert>
          )}
          {/* noValidate replaces the browser's English bubbles with the Japanese messages below each field. */}
          <form
            noValidate
            aria-busy={submitting || undefined}
            onSubmit={form.onSubmit(
              // Storybook has no accounts to check, so every complete pair is treated as wrong after the time a check
              // takes: both the waiting and the failure can be tried. The password is cleared, as it is never shown back.
              async () => {
                setAuthFailed(false);
                await new Promise((resolve) => setTimeout(resolve, CHECK_DELAY));
                form.setFieldValue('password', '');
                setAuthFailed(true);
                setFailures((count) => count + 1);
              },
              // Move focus to the first field with an error so keyboard users land on it.
              (errors) => {
                const first = FIELD_ORDER.find((field) => errors[field]);
                if (first) form.getInputNode(first)?.focus();
              },
            )}
          >
            <Stack gap="md">
              {/* While the pair is checked the fields are read-only, not disabled: the pair cannot change under the
                  check, and what the user typed stays as readable as before. */}
              <TextInput
                type="email"
                label="メールアドレス"
                placeholder="user@example.com"
                autoComplete="email"
                required
                readOnly={submitting}
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <Stack gap={4}>
                <PasswordInput
                  label="パスワード"
                  autoComplete="current-password"
                  required
                  readOnly={submitting}
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                  // Mantine 9 sets aria-invalid on TextInput but not on the inner field of PasswordInput.
                  aria-invalid={form.errors.password ? true : undefined}
                />
                <Anchor href="#" size="sm" ta="right">
                  パスワードを忘れた場合
                </Anchor>
              </Stack>
              {/* The two buttons are alternatives, not steps, so a labelled rule sits between them. Both wait while the
                  pair is checked, as either would start a second sign-in. The link stays: leaving for another page
                  only drops the check and sends nothing twice. */}
              <Stack gap="sm">
                <Button type="submit" fullWidth loading={submitting}>
                  サインイン
                </Button>
                <Divider label="または" labelPosition="center" />
                <Button variant="outline" fullWidth disabled={submitting}>
                  シングルサインオンでサインイン
                </Button>
              </Stack>
              {/*
               * Accounts are made by an administrator's invitation, so there is no sign-up here. The note is not a
               * link: before sign-in neither the organization nor its administrator is known, so there is nowhere on
               * this screen to send the request.
               */}
              <Text size="sm" c="dimmed" ta="center">
                アカウントが無い場合は、管理者に招待を依頼してください。
              </Text>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Stack>
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
          'データパターンのうち、送信した入力に誤りがある状態（メールアドレスの形式の誤りと、パスワードの未入力）です。ブラウザの英語の吹き出しを使わず、誤りのある欄の真下に日本語で、何が違うかと、どう入力すればよいかを出し、キーボードで操作する人がそのまま直せるよう、誤りのある最初の欄へフォーカスを移します。',
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

export const SignInFailed: Story = {
  name: 'メールアドレスかパスワードが違うとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンのうち、送信した組が登録されたアカウントと合わなかった状態です。どちらが違うかは書かず、フォームの上に 1 件の Alert で知らせます。メールアドレスは残し、パスワードは空に戻して、入力し直す欄へフォーカスを移します。',
      },
    },
  },
  render: () => (
    <SignInPage initialValues={{ email: 'user@example.com', password: '' }} authFailed />
  ),
};

export const Submitting: Story = {
  name: '送信中',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンのうち、送信して確かめているあいだの状態です。「サインイン」を読み込み表示にし、シングルサインオンも押せなくして、二重の送信を防ぎます。欄は読み取り専用にして、確かめている組が途中で変わらないようにしつつ、入力したとおりの色で読めるように残します。パスワードの再設定のリンクは、移っても二重に送ることにはならないため、使えるまま残します。この画面例では、どの組を送ってもこの状態のあと『メールアドレスかパスワードが違うとき』になります。',
      },
    },
  },
  render: () => (
    <SignInPage initialValues={{ email: 'user@example.com', password: 'password' }} submitting />
  ),
};
