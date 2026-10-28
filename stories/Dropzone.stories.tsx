import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Group, Stack, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import '@mantine/dropzone/styles.layer.css';

const meta = {
  title: '入力 / ファイルの選択（Dropzone）',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FileSelection: Story = {
  name: '画像を選択',
  parameters: {
    docs: { description: { story: '画像をドラッグまたは選択して追加できます。' } },
  },
  render: () => {
    const [message, setMessage] = useState('');

    return (
      <Stack maw={480}>
        <Dropzone
          accept={IMAGE_MIME_TYPE}
          maxSize={5 * 1024 ** 2}
          inputProps={{ 'aria-label': '画像を選択' }}
          onDrop={() => {}}
          onDropAny={(files, rejections) => {
            const codes = new Set(
              rejections.flatMap(({ errors }) => errors.map(({ code }) => code)),
            );
            const messages = [
              files.length > 0 ? `${files.length} 件の画像を選択しました。` : '',
              codes.has('file-invalid-type') ? '画像ファイルを選択してください。' : '',
              codes.has('file-too-large') ? '画像は 1 件につき 5 MB までです。' : '',
            ].filter(Boolean);
            setMessage(messages.join(' '));
          }}
        >
          <Group justify="center" gap="lg" mih={140} wrap="nowrap">
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
                <Text>画像ファイル以外は選べません</Text>
              </Dropzone.Reject>
              <Dropzone.Idle>
                <Text>
                  画像をドロップ
                  <br />
                  またはクリックして選択
                </Text>
              </Dropzone.Idle>
              <Text size="sm">画像 1 件につき 5 MB まで</Text>
            </div>
          </Group>
        </Dropzone>
        {message && <Text aria-live="polite">{message}</Text>}
      </Stack>
    );
  },
};
