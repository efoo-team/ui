import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Group, Stack, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import '@mantine/dropzone/styles.layer.css';

const meta = {
  title: '入力 / ファイルの選択（Dropzone）',
  component: Dropzone,
  tags: ['autodocs'],
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FileSelection: Story = {
  name: '画像を選択',
  args: { onDrop: () => {} },
  render: () => {
    const [message, setMessage] = useState('');

    return (
      <Stack maw={480}>
        <Dropzone
          accept={IMAGE_MIME_TYPE}
          maxSize={5 * 1024 ** 2}
          inputProps={{ 'aria-label': '画像を選択' }}
          onDrop={(files) => setMessage(`${files.length} 件の画像を選択しました。`)}
          onReject={() => setMessage('画像形式とファイルサイズを確認してください。')}
        >
          <Group justify="center" gap="lg" mih={140}>
            <Dropzone.Accept>
              <IconUpload size={36} aria-hidden />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={36} aria-hidden />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={36} aria-hidden />
            </Dropzone.Idle>
            <div>
              <Dropzone.Accept>
                <Text>画像をドロップ</Text>
              </Dropzone.Accept>
              <Dropzone.Reject>
                <Text>画像ファイルを選択してください</Text>
              </Dropzone.Reject>
              <Dropzone.Idle>
                <Text>画像をドロップ、またはクリックして選択</Text>
              </Dropzone.Idle>
              <Text size="sm" c="dimmed">
                画像 1 件につき 5 MB まで
              </Text>
            </div>
          </Group>
        </Dropzone>
        {message && <Text aria-live="polite">{message}</Text>}
      </Stack>
    );
  },
};
