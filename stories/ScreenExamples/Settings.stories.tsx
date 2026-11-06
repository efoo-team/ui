import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import {
  Affix,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  getDefaultZIndex,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useWindowEvent } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AppFrame } from './shared/AppFrame';
import { ORGANIZATIONS, PAYMENT_METHODS, STAFF } from './shared/data';
import { SectionCard } from './shared/SectionCard';

const meta = {
  title: '画面例 / 設定',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      // AppShell places the frame with position: fixed, so each story is drawn in an iframe of its own.
      story: { inline: false, height: '900px' },
      description: {
        component:
          '架空の販売管理サービスの、組織ごとの設定の画面です。\n\n' +
          '**目的と読み手**　組織の管理者が、担当者の交代や移転のときなど、数か月に一度だけ開いて、決まった 1〜2 か所を変える画面です。毎回ほぼ初めて見るのと同じなので、項目の名前と短い説明だけで、何が変わるかが分かるようにしました。\n\n' +
          '**情報構造**　扱うのは 1 つの組織（青葉商店）の設定で、「通知」「受注の既定値」「組織の情報」の 3 つのまとまりに分かれます。通知は、知らせる出来事 5 種のそれぞれが宛先（人、または受注の担当者）と手段（メール・お知らせ）を持ち、受注の既定値は受注の登録画面の初期値、組織の情報は請求書と納品書の差出人です。主は個々の設定項目で、まとまりは探すための区切りであり、保存は画面全体で 1 回です。\n\n' +
          '**データパターン**　項目は 16 個（通知 6、受注の既定値 4、組織の情報 6）です。宛先は 0〜4 件、手段は 0〜2 個（0 個ならその通知は送らない）で、住所は 30 字前後まで、支払い方法の選択肢は最長 16 字です。状態は、保存済みの値のまま（story『設定』）と、保存していない変更が 1 件以上あり複数のまとまりにまたがる（story『変更を保存していないとき』）です。保存中、入力に誤りがあるとき、保存せずに離れようとしたときは、『変更を保存していないとき』で操作して確かめられます。読み込み中と取得の失敗は、この画面例では扱っていません。\n\n' +
          '**情報の流れ**　管理者は「発注点を下回ったら自分にも知らせてほしい」のような変えたいことを持って開き、見出しで場所を探し、今の値を読んで変えます。次に、何を変えたかを確かめて保存し、いつから反映されるかを知って終わります。保存せずに離れようとしたときは、その場で引き止められます。\n\n' +
          '**主役**　流れの最初の「探す」のために、まとまりを 3 つの見出しに絞り、変える頻度が高い順（担当者の交代で変わる通知、受注の既定値、移転や改称のときだけ変わる組織の情報）に上から並べました。最後の「確かめて保存する」のために、変更があるときだけ画面の下に保存の欄を固定し、どのまとまりで何件変えたかと、この画面で唯一の塗りのボタン「変更を保存」を置きました。変えた項目の名前の横には「未保存」を付けています。\n\n' +
          '**抑えたもの・使わなかったもの**　Tabs は使っていません。隠れたタブに保存していない変更が残ると気づけず、ブラウザのページ内検索でも見つからないためです。Switch も使っていません。押した時点で反映されるように見えるので、まとめて保存するこの画面では Checkbox と Radio にそろえました。何も変えていないときは、押しても何も起きない保存のボタンを出さず、「未保存」の印も誤りではないので色を付けていません。\n\n' +
          '**目的が違えば変わるところ**　見出しが 6 つを超える、または 1 つの見出しが何画面にも及ぶなら、左に小さな目次を置くか、見出しごとにページを分けて、それぞれで保存します。自分の通知の受け取りのように、1 人分の 1 項目だけを変える画面なら、Switch で押したらすぐ反映する方が手数が少なくて済みます。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Every name, address and number below is fictional. The settings belong to the first organization in the switcher.
const ORGANIZATION = ORGANIZATIONS[0]!;

const ORDER_OWNER = '受注の担当者';
const ORDER_CREATOR = '受注を登録した人';

const CHANNELS = [
  { value: 'mail', label: 'メール' },
  // The same word as the sidebar's お知らせ, where these messages appear.
  { value: 'app', label: 'お知らせ' },
];

interface NotificationEvent {
  key: NotificationKey;
  label: string;
  description: string;
  recipients: string[];
}

type NotificationKey = 'unshipped' | 'reorder' | 'inquiry' | 'payment' | 'cancelled';

// Order-related events can go to the staff member of each order; the others go to named people.
const NOTIFICATION_EVENTS: NotificationEvent[] = [
  {
    key: 'unshipped',
    label: '未発送の受注',
    description: '受注日の翌営業日の朝 9 時になっても発送していない受注を知らせます。',
    recipients: [ORDER_OWNER, ...STAFF],
  },
  {
    key: 'reorder',
    label: '発注点を下回った商品',
    description: '在庫数が発注点を下回った時点で、その商品を知らせます。',
    recipients: STAFF,
  },
  {
    key: 'inquiry',
    label: '未対応の問い合わせ',
    description: '受付から 1 日たっても対応する人が決まっていない問い合わせを知らせます。',
    recipients: STAFF,
  },
  {
    key: 'payment',
    label: '入金を確認できない受注',
    description: '銀行振込（前払い）の受注で、受注日から 7 日たっても入金がないものを知らせます。',
    recipients: [ORDER_OWNER, ...STAFF],
  },
  {
    key: 'cancelled',
    label: 'キャンセルされた受注',
    description: '発送の準備を止められるように、受注がキャンセルされたときに知らせます。',
    recipients: [ORDER_OWNER, ...STAFF],
  },
];

interface NotificationSetting {
  recipients: string[];
  channels: string[];
}

interface SettingsValues {
  organization: {
    name: string;
    postalCode: string;
    address: string;
    phone: string;
    billingEmail: string;
    registrationNumber: string;
  };
  orderDefaults: {
    payment: string;
    staff: string;
    shipAfterDays: number | string;
    confirmationMail: boolean;
  };
  notifications: Record<NotificationKey, NotificationSetting>;
  mailTiming: string;
}

// What the server holds. The staff split follows the order history: 石川 checks payments, 上田 ships.
const SAVED_SETTINGS: SettingsValues = {
  organization: {
    name: ORGANIZATION.name,
    postalCode: '000-0010',
    address: '東京都見本区青葉町 2-8-1 青葉ビル 3 階',
    phone: '03-0000-1010',
    billingEmail: 'billing@aoba-shoten.example',
    registrationNumber: 'T0000000000010',
  },
  orderDefaults: {
    payment: PAYMENT_METHODS[0]!,
    staff: ORDER_CREATOR,
    shipAfterDays: 2,
    confirmationMail: true,
  },
  notifications: {
    unshipped: { recipients: [ORDER_OWNER, STAFF[2]!], channels: ['mail', 'app'] },
    reorder: { recipients: [STAFF[2]!], channels: ['app'] },
    inquiry: { recipients: [STAFF[0]!, STAFF[1]!], channels: ['app'] },
    payment: { recipients: [STAFF[1]!], channels: ['mail'] },
    cancelled: { recipients: [ORDER_OWNER, STAFF[2]!], channels: ['app'] },
  },
  mailTiming: 'each',
};

// Three edits in two sections: the default payment, one more person for low stock, and mail for open inquiries.
const EDITED_SETTINGS: SettingsValues = {
  ...SAVED_SETTINGS,
  orderDefaults: { ...SAVED_SETTINGS.orderDefaults, payment: PAYMENT_METHODS[2]! },
  notifications: {
    ...SAVED_SETTINGS.notifications,
    reorder: { recipients: [STAFF[2]!, STAFF[0]!], channels: ['app'] },
    inquiry: { recipients: [STAFF[0]!, STAFF[1]!], channels: ['app', 'mail'] },
  },
};

type SectionKey = 'organization' | 'orderDefaults' | 'notifications';

const SECTIONS: { key: SectionKey; title: string }[] = [
  { key: 'notifications', title: '通知' },
  { key: 'orderDefaults', title: '受注の既定値' },
  { key: 'organization', title: '組織の情報' },
];

// One entry per thing the user thinks of as one setting; a notification row counts once for its people and channels.
const SETTING_ITEMS: { section: SectionKey; pick: (values: SettingsValues) => unknown }[] = [
  ...(Object.keys(SAVED_SETTINGS.organization) as (keyof SettingsValues['organization'])[]).map(
    (key) => ({
      section: 'organization' as const,
      pick: (values: SettingsValues) => values.organization[key],
    }),
  ),
  ...(Object.keys(SAVED_SETTINGS.orderDefaults) as (keyof SettingsValues['orderDefaults'])[]).map(
    (key) => ({
      section: 'orderDefaults' as const,
      pick: (values: SettingsValues) => values.orderDefaults[key],
    }),
  ),
  ...NOTIFICATION_EVENTS.map(({ key }) => ({
    section: 'notifications' as const,
    pick: (values: SettingsValues) => values.notifications[key],
  })),
  { section: 'notifications', pick: (values) => values.mailTiming },
];

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const POSTAL_CODE_PATTERN = /^\d{3}-\d{4}$/;
const PHONE_PATTERN = /^0\d{1,4}-\d{1,4}-\d{3,4}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTRATION_PATTERN = /^T\d{13}$/;

const required = (label: string) => (value: string) =>
  value.trim() === '' ? `${label}を入力してください` : null;

// The order the fields appear in, so focus goes to the first error on screen.
const FIELD_ORDER = [
  'orderDefaults.shipAfterDays',
  'organization.name',
  'organization.postalCode',
  'organization.phone',
  'organization.address',
  'organization.billingEmail',
  'organization.registrationNumber',
];

// A changed setting carries this next to its label, so the user can find each unsaved change on the page.
function Label({ children, changed }: { children: ReactNode; changed: boolean }) {
  return changed ? (
    <Group component="span" gap="xs" wrap="nowrap" display="inline-flex">
      <span>{children}</span>
      <Badge component="span" variant="outline">
        未保存
      </Badge>
    </Group>
  ) : (
    children
  );
}

function SettingsPage({ initialValues = SAVED_SETTINGS }: { initialValues?: SettingsValues }) {
  // What the server holds; the form starts from initialValues, which differ from it in the unsaved story.
  const [saved, setSaved] = useState(SAVED_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [leaving, setLeaving] = useState<string | null>(null);
  // Controlled, so the save bar and the 未保存 marks follow every keystroke.
  const form = useForm<SettingsValues>({
    mode: 'controlled',
    initialValues,
    validate: {
      organization: {
        name: required('組織名'),
        postalCode: (value) =>
          POSTAL_CODE_PATTERN.test(value) ? null : '郵便番号は 000-0000 の形で入力してください',
        address: required('住所'),
        phone: (value) =>
          PHONE_PATTERN.test(value)
            ? null
            : '電話番号は 03-0000-0000 のように、ハイフンを入れて入力してください',
        billingEmail: (value) =>
          EMAIL_PATTERN.test(value) ? null : 'メールアドレスの形式が正しくありません',
        registrationNumber: (value) =>
          REGISTRATION_PATTERN.test(value)
            ? null
            : '登録番号は T に続けて 13 桁の数字で入力してください',
      },
      orderDefaults: {
        shipAfterDays: (value) =>
          typeof value === 'number' && value >= 0 && value <= 30
            ? null
            : '0〜30 の数で入力してください',
      },
    },
  });

  const values = form.getValues();
  const changedItems = SETTING_ITEMS.filter((item) => !same(item.pick(values), item.pick(saved)));
  const dirty = changedItems.length > 0;
  const changedSections = SECTIONS.filter((section) =>
    changedItems.some((item) => item.section === section.key),
  );
  const isChanged = (pick: (values: SettingsValues) => unknown) => !same(pick(values), pick(saved));

  // Closing or reloading the tab with unsaved changes asks the browser to confirm.
  useWindowEvent('beforeunload', (event) => {
    if (dirty) event.preventDefault();
  });

  // Moving to another page with unsaved changes asks first; the frame calls this before it moves.
  const confirmLeaving = (label: string) => {
    if (!dirty) return true;
    setLeaving(label);
    return false;
  };

  // Saving is pretended: after a short wait the edited values become the saved ones.
  const save = form.onSubmit(
    (submitted) => {
      setSaving(true);
      window.setTimeout(() => {
        setSaved(submitted);
        setSaving(false);
        notifications.show({
          title: '設定を保存しました',
          message: 'このあと登録する受注と、これから送る通知から反映されます。',
        });
      }, 800);
    },
    (errors) => {
      const first = FIELD_ORDER.find((field) => errors[field]);
      // Centered, so the save bar at the bottom does not cover the field and its message.
      const node = first ? form.getInputNode(first) : null;
      node?.focus({ preventScroll: true });
      node?.scrollIntoView({ block: 'center' });
    },
  );

  const discard = () => {
    form.setValues(saved);
    form.clearErrors();
  };

  const changedSummary = `${changedSections.map((section) => section.title).join('・')}の変更 ${changedItems.length} 件`;

  return (
    <AppFrame parent="設定" defaultOrganization={ORGANIZATION} onBeforeNavigate={confirmLeaving}>
      <form noValidate onSubmit={save}>
        {/* A narrow column keeps each label next to its field; the settings are read, not scanned like a table. */}
        <Stack gap="lg" maw={768}>
          <Stack gap={4}>
            <Title order={1} size="h3">
              設定
            </Title>
            <Text size="sm" c="dimmed">
              {ORGANIZATION.name}
              の全員に共通する設定です。変更は、画面の下に出る「変更を保存」でまとめて保存します。
            </Text>
          </Stack>

          <SectionCard
            title="通知"
            description="対応が必要になったときに、誰にどの手段で知らせるかを決めます。手段を選ばない通知は送りません。"
          >
            <Stack gap="md">
              {NOTIFICATION_EVENTS.map((event, index) => (
                <Stack key={event.key} gap="md">
                  {index > 0 && <Divider />}
                  <SimpleGrid
                    type="container"
                    cols={{ base: 1, '36rem': 2 }}
                    spacing="lg"
                    verticalSpacing="sm"
                  >
                    <Stack gap={4}>
                      <Text size="sm" variant="emphasis">
                        <Label changed={isChanged((v) => v.notifications[event.key])}>
                          {event.label}
                        </Label>
                      </Text>
                      <Text size="sm" c="dimmed">
                        {event.description}
                      </Text>
                    </Stack>
                    <Stack gap="sm">
                      <MultiSelect
                        label="宛先"
                        aria-label={`${event.label}の宛先`}
                        data={event.recipients}
                        // Mantine keeps the placeholder beside the chosen names; it is only needed while empty.
                        placeholder={
                          values.notifications[event.key].recipients.length === 0
                            ? '宛先を選ぶ'
                            : undefined
                        }
                        {...form.getInputProps(`notifications.${event.key}.recipients`)}
                      />
                      <Checkbox.Group
                        label="知らせる手段"
                        aria-label={`${event.label}を知らせる手段`}
                        {...form.getInputProps(`notifications.${event.key}.channels`)}
                      >
                        <Group gap="lg" mt="xs">
                          {CHANNELS.map((channel) => (
                            <Checkbox
                              key={channel.value}
                              value={channel.value}
                              label={channel.label}
                            />
                          ))}
                        </Group>
                      </Checkbox.Group>
                    </Stack>
                  </SimpleGrid>
                </Stack>
              ))}
              <Divider />
              <Radio.Group
                label={<Label changed={isChanged((v) => v.mailTiming)}>メールを送る時刻</Label>}
                description="お知らせには、いつもその場で表示します。"
                {...form.getInputProps('mailTiming')}
              >
                <Stack gap="xs" mt="xs">
                  <Radio value="each" label="知らせることが起きるたびに送る" />
                  <Radio value="morning" label="毎朝 9 時に 1 通にまとめて送る" />
                </Stack>
              </Radio.Group>
            </Stack>
          </SectionCard>

          <SectionCard
            title="受注の既定値"
            description="受注を登録するときに、最初から入っている値です。受注ごとに変えられます。"
          >
            <Stack gap="md">
              <SimpleGrid type="container" cols={{ base: 1, '36rem': 2 }}>
                <Select
                  label={
                    <Label changed={isChanged((v) => v.orderDefaults.payment)}>支払い方法</Label>
                  }
                  data={PAYMENT_METHODS}
                  allowDeselect={false}
                  {...form.getInputProps('orderDefaults.payment')}
                />
                <Select
                  label={<Label changed={isChanged((v) => v.orderDefaults.staff)}>担当者</Label>}
                  data={[ORDER_CREATOR, ...STAFF]}
                  allowDeselect={false}
                  {...form.getInputProps('orderDefaults.staff')}
                />
                <NumberInput
                  label={
                    <Label changed={isChanged((v) => v.orderDefaults.shipAfterDays)}>
                      出荷予定日
                    </Label>
                  }
                  description="受注日から数えて、何営業日後を出荷予定日にするかです。"
                  suffix=" 営業日後"
                  min={0}
                  max={30}
                  allowDecimal={false}
                  {...form.getInputProps('orderDefaults.shipAfterDays')}
                />
              </SimpleGrid>
              <Checkbox
                label={
                  <Label changed={isChanged((v) => v.orderDefaults.confirmationMail)}>
                    受注を登録したら、顧客に確認のメールを送る
                  </Label>
                }
                description="受注の登録画面で、このチェックを最初から入れておきます。"
                {...form.getInputProps('orderDefaults.confirmationMail', { type: 'checkbox' })}
              />
            </Stack>
          </SectionCard>

          <SectionCard title="組織の情報" description="請求書と納品書の差出人に印字します。">
            <Stack gap="md">
              <TextInput
                label={<Label changed={isChanged((v) => v.organization.name)}>組織名</Label>}
                description="サイドバーの組織の切り替えにも表示します。"
                required
                {...form.getInputProps('organization.name')}
              />
              <SimpleGrid type="container" cols={{ base: 1, '36rem': 2 }}>
                <TextInput
                  label={
                    <Label changed={isChanged((v) => v.organization.postalCode)}>郵便番号</Label>
                  }
                  placeholder="000-0000"
                  required
                  {...form.getInputProps('organization.postalCode')}
                />
                <TextInput
                  type="tel"
                  label={<Label changed={isChanged((v) => v.organization.phone)}>電話番号</Label>}
                  placeholder="03-0000-0000"
                  autoComplete="off"
                  required
                  {...form.getInputProps('organization.phone')}
                />
              </SimpleGrid>
              <TextInput
                label={<Label changed={isChanged((v) => v.organization.address)}>住所</Label>}
                required
                {...form.getInputProps('organization.address')}
              />
              <SimpleGrid type="container" cols={{ base: 1, '36rem': 2 }}>
                <TextInput
                  type="email"
                  label={
                    <Label changed={isChanged((v) => v.organization.billingEmail)}>
                      請求書の問い合わせ先
                    </Label>
                  }
                  description="請求書に載せるメールアドレスです。"
                  required
                  {...form.getInputProps('organization.billingEmail')}
                />
                <TextInput
                  label={
                    <Label changed={isChanged((v) => v.organization.registrationNumber)}>
                      登録番号
                    </Label>
                  }
                  description="適格請求書発行事業者の登録番号です。"
                  placeholder="T0000000000000"
                  required
                  {...form.getInputProps('organization.registrationNumber')}
                />
              </SimpleGrid>
            </Stack>
          </SectionCard>

          {/*
           * The save bar exists only while something is unsaved. It stays in the content column and sticks to the
           * bottom of the window, so the save button is in reach at any scroll position and at phone width. Affix is
           * used for its z-index: inputs stack their sections above plain positioned boxes. It stays below the header
           * and the narrow-screen sidebar.
           */}
          {dirty && (
            <Affix
              withinPortal={false}
              pos="sticky"
              position={{ bottom: 'var(--mantine-spacing-md)' }}
              zIndex={getDefaultZIndex('app') - 1}
            >
              <Card padding="md" role="region" aria-label="保存していない変更">
                <Group justify="space-between" gap="sm">
                  <Stack gap={0}>
                    <Text size="sm" variant="emphasis">
                      保存していない変更があります
                    </Text>
                    <Text size="sm" c="dimmed">
                      {changedSummary}
                    </Text>
                  </Stack>
                  <Group gap="sm" wrap="nowrap">
                    <Button variant="default" onClick={discard} disabled={saving}>
                      変更を取り消す
                    </Button>
                    <Button type="submit" loading={saving}>
                      変更を保存
                    </Button>
                  </Group>
                </Group>
              </Card>
            </Affix>
          )}
        </Stack>
      </form>

      <Modal
        opened={leaving !== null}
        onClose={() => setLeaving(null)}
        title="保存していない変更があります"
      >
        <Stack gap="lg">
          <Text size="sm">
            {changedSummary}を、まだ保存していません。このまま「{leaving}
            」に移動すると、変更は失われます。
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={() => setLeaving(null)} data-autofocus>
              このページに残る
            </Button>
            <Button
              color="red"
              onClick={() => {
                discard();
                setLeaving(null);
              }}
            >
              保存せずに移動
            </Button>
          </Group>
        </Stack>
      </Modal>
    </AppFrame>
  );
}

export const Settings: Story = {
  name: '設定',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンのうち、保存済みの値のまま開いたときです。保存の欄はまだ出さず、ページの補足で、変更すると画面の下に「変更を保存」が出ることだけを伝えています。',
      },
    },
  },
  render: () => <SettingsPage />,
};

export const UnsavedChanges: Story = {
  name: '変更を保存していないとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンのうち、保存していない変更が 2 つのまとまり（通知・受注の既定値）に 3 件あるときです。変えた項目の名前の横に「未保存」を付け、画面の下に固定した欄で件数と保存・取り消しの操作を示し、サイドバーで別のページへ移ろうとすると確認のダイアログを出します。',
      },
    },
  },
  render: () => <SettingsPage initialValues={EDITED_SETTINGS} />,
};
