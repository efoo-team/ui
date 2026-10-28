import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput, PasswordInput, Stack, Textarea, TextInput, Title } from '@mantine/core';

const meta = {
  title: '入力 / テキスト入力欄（TextInput, Textarea, NumberInput, PasswordInput）',
  component: TextInput,
  tags: ['autodocs'],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsAndStates: Story = {
  name: '入力欄の種類と状態',
  parameters: {
    docs: {
      description: {
        story: 'テキスト、複数行、数値、パスワードの入力欄とその状態を確認できます。',
      },
    },
  },
  render: () => (
    <Stack maw={440} gap="xl">
      <Stack gap="sm">
        <Title order={4} size="h5">
          TextInput
        </Title>
        <TextInput
          label="名前"
          placeholder="例：山田 太郎"
          required
          withAsterisk
          description="画面に表示する名前を入力します。"
        />
        <TextInput label="メールアドレス" placeholder="name@example.com" variant="filled" />
        <TextInput label="枠なし" placeholder="Unstyled" variant="unstyled" />
        <TextInput label="入力エラー" defaultValue="invalid" error="入力内容を確認してください" />
        <TextInput label="変更できません" defaultValue="閲覧のみ" disabled />
        <TextInput label="小さい入力欄" size="xs" placeholder="文字を入力" />
        <TextInput label="大きい入力欄" size="lg" placeholder="文字を入力" />
      </Stack>
      <Stack gap="sm">
        <Title order={4} size="h5">
          Textarea
        </Title>
        <Textarea label="メモ" placeholder="内容を入力" minRows={3} autosize />
        <Textarea label="大きい入力欄" size="lg" placeholder="文字を入力" minRows={2} />
        <Textarea label="変更できません" defaultValue="閲覧のみ" disabled />
        <Textarea label="入力エラー" error="入力内容を確認してください" defaultValue="要修正" />
      </Stack>
      <Stack gap="sm">
        <Title order={4} size="h5">
          NumberInput
        </Title>
        <NumberInput label="数量" defaultValue={3} min={0} max={99} />
        <NumberInput label="塗りつぶし" defaultValue={12} variant="filled" />
        <NumberInput label="大きい入力欄" size="lg" defaultValue={24} />
        <NumberInput label="入力エラー" error="0 以上を入力してください" />
        <NumberInput label="変更できません" defaultValue={12} disabled />
      </Stack>
      <Stack gap="sm">
        <Title order={4} size="h5">
          PasswordInput
        </Title>
        <PasswordInput label="パスワード" placeholder="パスワードを入力" />
        <PasswordInput label="塗りつぶし" placeholder="入力してください" variant="filled" />
        <PasswordInput label="大きい入力欄" placeholder="入力してください" size="lg" />
        <PasswordInput label="変更できません" defaultValue="sample-password" disabled />
        <PasswordInput label="入力エラー" error="8 文字以上で入力してください" />
      </Stack>
    </Stack>
  ),
};
