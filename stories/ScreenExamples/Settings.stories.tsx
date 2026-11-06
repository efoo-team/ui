import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import {
  Affix,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  getDefaultZIndex,
  Group,
  Input,
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
  VisuallyHidden,
} from '@mantine/core';
import { useForm, type FormErrors } from '@mantine/form';
import { useWindowEvent } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AppFrame } from './shared/AppFrame';
import { ATTENTION_COLOR, ORGANIZATIONS, PAYMENT_METHODS, STAFF } from './shared/data';
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
          '**目的と読み手**　組織の管理者が、担当者の交代や移転のときなど、数か月に一度だけ開いて、決まった 1〜2 か所を変える画面です。毎回ほぼ初めて見るのと同じで、ページの構成も覚えていないので、どこに何があるかと、項目の名前と短い説明だけで何が変わるかが分かるようにしました。\n\n' +
          '**情報構造**　扱うのは 1 つの組織（青葉商店）の設定で、「通知」「受注の既定値」「組織の情報」の 3 つのまとまりに分かれます。通知は、知らせる出来事 5 種のそれぞれが宛先（人、または受注の担当者）と手段（メール・お知らせ）を持ち、受注の既定値は受注の登録画面の初期値、組織の情報は請求書と納品書の差出人です。主は個々の設定項目で、まとまりは探すための区切りであり、保存は画面全体で 1 回です。\n\n' +
          '**データパターン**　項目は 21 個（通知 11（出来事ごとの宛先と手段、メールを送る時刻）、受注の既定値 4、組織の情報 6）です。宛先は 0〜4 件、手段は 0〜2 個（0 個ならその通知は送らない）で、住所は 30 字前後まで、支払い方法の選択肢は最長 16 字です。状態は、保存済みの値のまま（story『設定』）、保存していない変更が 1 件以上あり複数のまとまりにまたがる（story『変更を保存していないとき』）、保存を押したが入力に誤りがあり、誤りのある項目が画面の外にある（story『保存できなかったとき』）です。保存中と、保存せずに離れようとしたときは、『変更を保存していないとき』で操作して確かめられます。読み込み中、取得の失敗、通信の失敗で保存できなかったときは、この画面例では扱っていません。\n\n' +
          '**情報の流れ**　管理者は「発注点を下回ったら自分にも知らせてほしい」のような変えたいことを持って開き、見出しの下のまとまりの一覧で、それがどのまとまりにあるかを知って移り、今の値を読んで変えます。次に、何を変えたかを確かめて保存し、いつから反映されるかを知って終わります。保存できなかったときは、どの項目を直せばよいかを知ってそこへ移り、直してもう一度保存します。保存せずに離れようとしたときは、その場で引き止められます。\n\n' +
          '**主役**　流れの最初の「探す」のために、見出しのすぐ下に 3 つのまとまりの名前（リンク）と中身を 1 つずつ並べ、どの幅でも最初の 1 画面で、このページに何があるかが分かるようにしました。スマホの幅ではリンクを 1 行目、中身を 2 行目に分け、折り返した段落の中の 1 語に見えないようにしています。まとまりは変える頻度が高い順（担当者の交代で変わる通知、受注の既定値、移転や改称のときだけ変わる組織の情報）に上から並べています。通知の中は、出来事ではない「メールを送る時刻」も含めて、左に太字の名前と説明、右に入力を置く同じ行の形にそろえ、左の名前を上から追う人が読み飛ばさないようにしました。最後の「確かめて保存する」のために、変更があるときだけ画面の下端に保存の欄を固定し、どのまとまりで何件変えたかと、この画面で唯一の塗りのボタン「変更を保存」を置きました。保存できなかったときは、同じ欄が誤りの件数と直す項目へのリンクに変わり、フォーカスもこの欄に移ります。誤りのある項目がページの下にあって見えなくても、押した場所で分かるためです。変えた項目のラベルの後ろ（必須の項目では「*」の後ろ）に「未保存」を付け、フォームの画面と同じ「項目名 *」の並びを崩さないようにしました。件数もこの項目の単位で数えています。\n\n' +
          '**抑えたもの・使わなかったもの**　Tabs は使っていません。隠れたタブに保存していない変更が残ると気づけず、ブラウザのページ内検索でも見つからないためです。まとまりの一覧は 1440 の幅で右の余白に固定する目次にもできますが、まとまりが 3 つで、探すのは開いた直後だけなので、どの幅でも同じ場所に置く一覧にとどめました。Switch も使っていません。押した時点で反映されるように見えるので、まとめて保存するこの画面では Checkbox と Radio にそろえました。何も変えていないときは、押しても何も起きない保存のボタンを出さず、「未保存」の印も誤りではないので色を付けていません。\n\n' +
          '**目的が違えば変わるところ**　まとまりが 6 つを超える、または 1 つのまとまりが何画面にも及ぶなら、まとまりの一覧を左か右に固定した目次にして今いる場所を示すか、まとまりごとにページを分けて、それぞれで保存します。自分の通知の受け取りのように、1 人分の 1 項目だけを変える画面なら、Switch で押したらすぐ反映する方が手数が少なくて済みます。',
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

// The contents name what a user comes to change, so the list at the top tells which part holds it.
const SECTIONS: { key: SectionKey; title: string; contents: string }[] = [
  {
    key: 'notifications',
    title: '通知',
    contents: '未発送の受注や発注点を下回った商品などを、誰にどの手段で知らせるか',
  },
  {
    key: 'orderDefaults',
    title: '受注の既定値',
    contents: '受注を登録するときの支払い方法・担当者・出荷予定日',
  },
  {
    key: 'organization',
    title: '組織の情報',
    contents: '請求書と納品書に印字する組織名・住所・電話番号・登録番号',
  },
];

const sectionId = (key: SectionKey) => `settings-${key}`;

// One entry per field, the unit the 未保存 mark and the count use; a notification has two, its people and its channels.
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
  ...NOTIFICATION_EVENTS.flatMap(({ key }) =>
    (['recipients', 'channels'] as const).map((field) => ({
      section: 'notifications' as const,
      pick: (values: SettingsValues) => values.notifications[key][field],
    })),
  ),
  { section: 'notifications', pick: (values) => values.mailTiming },
];

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const POSTAL_CODE_PATTERN = /^\d{3}-\d{4}$/;
const PHONE_PATTERN = /^0\d{1,4}-\d{1,4}-\d{3,4}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTRATION_PATTERN = /^T\d{13}$/;

const REGISTRATION_MESSAGE = '登録番号は T に続けて 13 桁の数字で入力してください。';

const required = (label: string) => (value: string) =>
  value.trim() === '' ? `${label}を入力してください。` : null;

// The fields that can hold an error, in the order they appear, with the labels the save bar names them by.
const CHECKED_FIELDS = [
  ['orderDefaults.shipAfterDays', '出荷予定日'],
  ['organization.name', '組織名'],
  ['organization.postalCode', '郵便番号'],
  ['organization.phone', '電話番号'],
  ['organization.address', '住所'],
  ['organization.billingEmail', '請求書の問い合わせ先'],
  ['organization.registrationNumber', '登録番号'],
] as const;

type CheckedField = (typeof CHECKED_FIELDS)[number][0];

// Each checked field has a fixed id, so a link in the save bar points at it.
const fieldId = (field: CheckedField) => `settings-${field.replace('.', '-')}`;

/*
 * The header is fixed over the page, so a jump to a part stops below it, where the page's content starts, and moves
 * focus there so Tab goes on from that part.
 */
function jumpToSection(event: MouseEvent<HTMLAnchorElement>, key: SectionKey) {
  const node = document.getElementById(sectionId(key));
  const main = document.querySelector('main');
  if (!node || !main) return;
  event.preventDefault();
  node.focus({ preventScroll: true });
  const top = parseFloat(getComputedStyle(main).paddingTop);
  window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY - top });
}

// Centered, so neither the header nor the save bar covers the field and its message.
function jumpToField(event: MouseEvent<HTMLAnchorElement>, field: CheckedField) {
  const node = document.getElementById(fieldId(field));
  if (!node) return;
  event.preventDefault();
  node.focus({ preventScroll: true });
  node.scrollIntoView({ block: 'center' });
}

/*
 * A changed setting carries 未保存 next to its label, so the user can find each unsaved change on the page. Mantine
 * draws a required field's asterisk last inside the label, which would put the mark between the name and the asterisk.
 * A required field turns its own asterisk off (withAsterisk={false}) and the label draws it with Input.Label, the part
 * Mantine draws it with, so the order is the form's 名前 * followed by the mark.
 */
function Label({
  children,
  changed,
  required = false,
}: {
  children: ReactNode;
  changed: boolean;
  required?: boolean;
}) {
  if (!changed && !required) return children;
  return (
    <Group component="span" gap="xs" wrap="nowrap" display="inline-flex">
      {required ? (
        <Input.Label component="span" required>
          {children}
        </Input.Label>
      ) : (
        <span>{children}</span>
      )}
      {changed && (
        <Badge component="span" variant="outline">
          未保存
        </Badge>
      )}
    </Group>
  );
}

function SettingsPage({
  initialValues = SAVED_SETTINGS,
  initialErrors,
}: {
  initialValues?: SettingsValues;
  /** The errors of a save that has already failed, for the story that shows it. */
  initialErrors?: FormErrors;
}) {
  // What the server holds; the form starts from initialValues, which differ from it in the unsaved story.
  const [saved, setSaved] = useState(SAVED_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [leaving, setLeaving] = useState<string | null>(null);
  const saveBarRef = useRef<HTMLDivElement>(null);
  // Controlled, so the save bar and the 未保存 marks follow every keystroke.
  const form = useForm<SettingsValues>({
    mode: 'controlled',
    initialValues,
    initialErrors,
    validate: {
      organization: {
        name: required('組織名'),
        postalCode: (value) =>
          POSTAL_CODE_PATTERN.test(value) ? null : '郵便番号は 000-0000 の形で入力してください。',
        address: required('住所'),
        phone: (value) =>
          PHONE_PATTERN.test(value)
            ? null
            : '電話番号は 03-0000-0000 のように、ハイフンを入れて入力してください。',
        billingEmail: (value) =>
          EMAIL_PATTERN.test(value)
            ? null
            : 'メールアドレスの形式が正しくありません。user@example.com の形で入力してください。',
        registrationNumber: (value) =>
          REGISTRATION_PATTERN.test(value) ? null : REGISTRATION_MESSAGE,
      },
      orderDefaults: {
        shipAfterDays: (value) =>
          typeof value === 'number' && value >= 0 && value <= 30
            ? null
            : '0〜30 の数で入力してください。',
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
    /*
     * A field with an error can be far off screen, below or above, while the save bar is where the user pressed
     * 変更を保存. The bar lists the fields to fix and focus moves to it, so a screen reader reads them too.
     */
    () => {
      window.setTimeout(() => saveBarRef.current?.focus());
    },
  );

  const errorFields = CHECKED_FIELDS.filter(([field]) => form.errors[field]);

  const discard = () => {
    form.setValues(saved);
    form.clearErrors();
  };

  const changedSummary = `${changedSections.map((section) => section.title).join('・')}の変更 ${changedItems.length} 件`;

  return (
    <AppFrame parent="設定" defaultOrganization={ORGANIZATION} onBeforeNavigate={confirmLeaving}>
      <form noValidate onSubmit={save}>
        {/* A narrow column keeps each label next to its field; the settings are read, not scanned like a table. */}
        <Stack gap="lg" maw={720}>
          <Stack gap={4}>
            <Title order={1} size="h3">
              設定
            </Title>
            <Text size="sm" c="dimmed">
              {ORGANIZATION.name}
              の全員に共通する設定です。項目を変えると画面の下に「変更を保存」が出るので、そこでまとめて保存します。
            </Text>
          </Stack>

          {/*
           * Opened once in months, the page is new to its reader each time, so the parts and what each holds are
           * listed before the first part, on the first screen at every width.
           */}
          {/* Each link leads its own line on a phone, so it does not read as one word of a paragraph once the line wraps. */}
          <Stack component="nav" aria-label="設定のまとまり" gap="xs">
            {SECTIONS.map((section) => (
              <Flex
                key={section.key}
                direction={{ base: 'column', xs: 'row' }}
                align={{ base: 'flex-start', xs: 'baseline' }}
                gap={{ base: 0, xs: 'sm' }}
              >
                <Anchor
                  size="sm"
                  href={`#${sectionId(section.key)}`}
                  onClick={(event) => jumpToSection(event, section.key)}
                >
                  {section.title}
                </Anchor>
                <Text size="sm" c="dimmed">
                  {section.contents}
                </Text>
              </Flex>
            ))}
          </Stack>

          <Box id={sectionId('notifications')} tabIndex={-1}>
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
                          {event.label}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {event.description}
                        </Text>
                      </Stack>
                      <Stack gap="sm">
                        <MultiSelect
                          label={
                            <Label
                              changed={isChanged((v) => v.notifications[event.key].recipients)}
                            >
                              宛先
                            </Label>
                          }
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
                          label={
                            <Label changed={isChanged((v) => v.notifications[event.key].channels)}>
                              {/*
                               * Mantine names the group by this label and ignores aria-label, so the name that tells the
                               * five groups apart is read from here; the visible words stay as they are.
                               */}
                              <span aria-hidden>知らせる手段</span>
                              <VisuallyHidden component="span">
                                {event.label}の知らせる手段
                              </VisuallyHidden>
                            </Label>
                          }
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
                {/* The one setting that is not an event still takes the row of the events above, a bold name with a
                    line on what it does and the control on the right, so a reader going down the left names meets it. */}
                <SimpleGrid
                  type="container"
                  cols={{ base: 1, '36rem': 2 }}
                  spacing="lg"
                  verticalSpacing="sm"
                >
                  <Stack gap={4}>
                    <Text size="sm" variant="emphasis">
                      メールを送る時刻
                    </Text>
                    <Text size="sm" c="dimmed">
                      上の通知のうち、手段にメールを選んだものを送る時刻です。お知らせには、いつもその場で表示します。
                    </Text>
                  </Stack>
                  <Radio.Group
                    label={<Label changed={isChanged((v) => v.mailTiming)}>送る時刻</Label>}
                    {...form.getInputProps('mailTiming')}
                  >
                    <Stack gap="xs" mt="xs">
                      <Radio value="each" label="知らせることが起きるたびに送る" />
                      <Radio value="morning" label="毎朝 9 時に 1 通にまとめて送る" />
                    </Stack>
                  </Radio.Group>
                </SimpleGrid>
              </Stack>
            </SectionCard>
          </Box>

          <Box id={sectionId('orderDefaults')} tabIndex={-1}>
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
                    id={fieldId('orderDefaults.shipAfterDays')}
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
          </Box>

          <Box id={sectionId('organization')} tabIndex={-1}>
            <SectionCard title="組織の情報" description="請求書と納品書の差出人に印字します。">
              <Stack gap="md">
                <TextInput
                  label={
                    <Label changed={isChanged((v) => v.organization.name)} required>
                      組織名
                    </Label>
                  }
                  description="サイドバーの組織の切り替えにも表示します。"
                  required
                  withAsterisk={false}
                  id={fieldId('organization.name')}
                  {...form.getInputProps('organization.name')}
                />
                <SimpleGrid type="container" cols={{ base: 1, '36rem': 2 }}>
                  <TextInput
                    label={
                      <Label changed={isChanged((v) => v.organization.postalCode)} required>
                        郵便番号
                      </Label>
                    }
                    placeholder="000-0000"
                    required
                    withAsterisk={false}
                    id={fieldId('organization.postalCode')}
                    {...form.getInputProps('organization.postalCode')}
                  />
                  <TextInput
                    type="tel"
                    label={
                      <Label changed={isChanged((v) => v.organization.phone)} required>
                        電話番号
                      </Label>
                    }
                    placeholder="03-0000-0000"
                    autoComplete="off"
                    required
                    withAsterisk={false}
                    id={fieldId('organization.phone')}
                    {...form.getInputProps('organization.phone')}
                  />
                </SimpleGrid>
                <TextInput
                  label={
                    <Label changed={isChanged((v) => v.organization.address)} required>
                      住所
                    </Label>
                  }
                  required
                  withAsterisk={false}
                  id={fieldId('organization.address')}
                  {...form.getInputProps('organization.address')}
                />
                <SimpleGrid type="container" cols={{ base: 1, '36rem': 2 }}>
                  <TextInput
                    type="email"
                    label={
                      <Label changed={isChanged((v) => v.organization.billingEmail)} required>
                        請求書の問い合わせ先
                      </Label>
                    }
                    description="請求書に載せるメールアドレスです。"
                    required
                    withAsterisk={false}
                    id={fieldId('organization.billingEmail')}
                    {...form.getInputProps('organization.billingEmail')}
                  />
                  <TextInput
                    label={
                      <Label changed={isChanged((v) => v.organization.registrationNumber)} required>
                        登録番号
                      </Label>
                    }
                    description="適格請求書発行事業者の登録番号です。"
                    placeholder="T0000000000000"
                    required
                    withAsterisk={false}
                    id={fieldId('organization.registrationNumber')}
                    {...form.getInputProps('organization.registrationNumber')}
                  />
                </SimpleGrid>
              </Stack>
            </SectionCard>
          </Box>

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
              position={{ bottom: 0 }}
              zIndex={getDefaultZIndex('app') - 1}
              // The strip under the bar is the page's background down to the window's bottom edge, so the content
              // scrolling under the bar does not show through below it. The bar's own top edge is where content is cut.
              bg="var(--mantine-color-body)"
              pb="md"
            >
              <Card
                ref={saveBarRef}
                tabIndex={-1}
                padding="md"
                role="region"
                aria-label="保存していない変更"
              >
                <Group justify="space-between" gap="sm">
                  {/* Errors exist only after a save has failed; the field clears its own as soon as it changes. */}
                  {errorFields.length > 0 ? (
                    <Stack gap={4}>
                      <Group gap="xs">
                        <Badge color={ATTENTION_COLOR}>誤り {errorFields.length} 件</Badge>
                        <Text size="sm" variant="emphasis">
                          保存できませんでした
                        </Text>
                      </Group>
                      <Text size="sm">
                        直す項目：
                        {errorFields.map(([field, label], index) => (
                          <span key={field}>
                            {index > 0 && '、'}
                            {/* Taller than the line, so a finger hits the link at phone width. */}
                            <Anchor
                              href={`#${fieldId(field)}`}
                              onClick={(event) => jumpToField(event, field)}
                              display="inline-block"
                              py={4}
                            >
                              {label}
                            </Anchor>
                          </span>
                        ))}
                      </Text>
                    </Stack>
                  ) : (
                    <Stack gap={0}>
                      <Text size="sm" variant="emphasis">
                        保存していない変更があります
                      </Text>
                      <Text size="sm" c="dimmed">
                        {changedSummary}
                      </Text>
                    </Stack>
                  )}
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
          'データパターンのうち、保存済みの値のまま開いたときです。保存の欄はまだ出さず、ページの補足で、項目を変えると画面の下に「変更を保存」が出ることを伝え、その下に 3 つのまとまりへのリンクと中身を並べています（スマホの幅ではリンクと中身を 2 行に分けます）。',
      },
    },
  },
  render: () => <SettingsPage />,
};

// Renaming the organization: the name was cleared to be typed again, and the registration number lost a digit.
const FAILED_SETTINGS: SettingsValues = {
  ...EDITED_SETTINGS,
  organization: {
    ...SAVED_SETTINGS.organization,
    name: '',
    registrationNumber: 'T000000000010',
  },
};

export const UnsavedChanges: Story = {
  name: '変更を保存していないとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンのうち、保存していない変更が 2 つのまとまり（通知・受注の既定値）に 3 件あるときです。変えた項目のラベル（通知では宛先か知らせる手段）の後ろに「未保存」を付け、画面の下端に固定した欄で件数と保存・取り消しの操作を示し、サイドバーで別のページへ移ろうとすると確認のダイアログを出します。',
      },
    },
  },
  render: () => <SettingsPage initialValues={EDITED_SETTINGS} />,
};

export const SaveFailed: Story = {
  name: '保存できなかったとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンのうち、保存を押したが入力に誤りがあって保存できなかったときです。誤りのある組織名と登録番号はページの下にあって見えないため、押した場所である保存の欄に、誤りの件数と直す項目へのリンクを出し、フォーカスもこの欄に移します。組織名と登録番号のラベルでは、必須の「*」の後ろに「未保存」が付きます。',
      },
    },
  },
  render: () => (
    <SettingsPage
      initialValues={FAILED_SETTINGS}
      initialErrors={{
        'organization.name': required('組織名')(FAILED_SETTINGS.organization.name),
        'organization.registrationNumber': REGISTRATION_MESSAGE,
      }}
    />
  ),
};
