import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Fieldset,
  Group,
  Input,
  NumberInput,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, type FormErrors } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useRef, useState, type MouseEvent } from 'react';
import { AppFrame } from './shared/AppFrame';
import { BackLink } from './shared/BackLink';
import {
  ALL_PRODUCTS,
  ATTENTION_COLOR,
  PRODUCT_CATEGORIES,
  PRODUCTS,
  TAX_RATE,
  yen,
  type Product,
} from './shared/data';
import { SectionCard } from './shared/SectionCard';

// Units the fictional wholesaler sells by; the first five are the ones ALL_PRODUCTS use.
const UNITS = ['箱', '袋', '冊', '本', '個', '枚', 'セット'];

type SalesStatus = 'onSale' | 'stopped';

// What the product screens keep beyond the shared Product: the fields only this form edits.
interface ProductDetails {
  jan: string;
  description: string;
  status: SalesStatus;
}

// JAN codes starting with 20 are reserved for in-store use, so they never point at a real product.
const EDITED_PRODUCT: Product & ProductDetails = {
  ...PRODUCTS[0]!,
  jan: '2000000100015',
  description:
    '坪量 64 g/m² の普通紙です。複合機とレーザープリンターで使えます。湿気を避けて保管してください。',
  status: 'onSale',
};

const NEXT_CODE = `P-${1001 + ALL_PRODUCTS.length}`;

interface ProductFormValues {
  code: string;
  name: string;
  category: string | null;
  unit: string | null;
  jan: string;
  description: string;
  price: number | string;
  status: SalesStatus;
  quantity: number | string;
  reorderPoint: number | string;
  target: number | string;
}

const EMPTY_VALUES: ProductFormValues = {
  code: '',
  name: '',
  category: null,
  unit: null,
  jan: '',
  description: '',
  price: '',
  status: 'onSale',
  quantity: '',
  reorderPoint: '',
  target: '',
};

const valuesOf = (product: Product & ProductDetails): ProductFormValues => ({
  code: product.code,
  name: product.name,
  category: product.category,
  unit: product.unit,
  jan: product.jan,
  description: product.description,
  price: product.price,
  status: product.status,
  quantity: product.quantity,
  reorderPoint: product.reorderPoint,
  target: product.target,
});

// The fields in the order they appear, with the labels the error summary names them by.
const FIELDS = [
  ['code', '商品コード'],
  ['name', '商品名'],
  ['category', '分類'],
  ['unit', '単位'],
  ['jan', 'JAN コード'],
  ['description', '説明'],
  ['price', '単価（税抜）'],
  ['quantity', '在庫数'],
  ['reorderPoint', '発注点'],
  ['target', '適正在庫'],
] as const;

type FieldName = (typeof FIELDS)[number][0];

const LABEL = Object.fromEntries(FIELDS) as Record<FieldName, string>;

// Each field has a fixed id, so a link in the error summary points at it.
const fieldId = (field: FieldName) => `product-${field}`;

// Centered, so the fixed header does not cover the field and its message.
function jumpToField(event: MouseEvent<HTMLAnchorElement>, field: FieldName) {
  const node = document.getElementById(fieldId(field));
  if (!node) return;
  event.preventDefault();
  node.focus({ preventScroll: true });
  node.scrollIntoView({ block: 'center' });
}

const NAME_MAX = 60;
const DESCRIPTION_MAX = 200;
const CODE_PATTERN = /^P-\d{4}$/;
const JAN_PATTERN = /^(\d{8}|\d{13})$/;

const isBlank = (value: number | string) => value === '' || value === undefined;

// Registering checks the code against the products that exist; editing keeps the code, so it is not checked.
function validateCode(value: string) {
  if (value.trim() === '') return '商品コードを入力してください。';
  if (!CODE_PATTERN.test(value)) return `P- と 4 桁の数字で入力してください（例: ${NEXT_CODE}）。`;
  const taken = ALL_PRODUCTS.find((product) => product.code === value);
  return taken
    ? `${value} は「${taken.name}」で使われています。別の商品コードを入力してください。`
    : null;
}

function validateName(value: string) {
  if (value.trim() === '') return '商品名を入力してください。';
  return value.length > NAME_MAX ? `${NAME_MAX} 文字以内で入力してください。` : null;
}

const validateCategory = (value: string | null) => (value ? null : '分類を選んでください。');
const validateUnit = (value: string | null) => (value ? null : '単位を選んでください。');

const validateJan = (value: string) =>
  value === '' || JAN_PATTERN.test(value) ? null : '8 桁か 13 桁の数字で入力してください。';

const validateDescription = (value: string) =>
  value.length > DESCRIPTION_MAX ? `${DESCRIPTION_MAX} 文字以内で入力してください。` : null;

function validatePrice(value: number | string) {
  if (isBlank(value)) return '単価を入力してください。';
  return Number(value) < 1 ? '1 円以上で入力してください。' : null;
}

const validateQuantity = (value: number | string) =>
  isBlank(value) ? '在庫数を入力してください。まだ無ければ 0 を入力します。' : null;

const validateReorderPoint = (value: number | string) =>
  isBlank(value) ? '発注点を入力してください。' : null;

// The target is what an order refills the stock to, so it has to sit above the point that triggers the order.
function validateTarget(value: number | string, values: ProductFormValues) {
  if (isBlank(value)) return '適正在庫を入力してください。';
  if (isBlank(values.reorderPoint) || Number(value) > Number(values.reorderPoint)) return null;
  return `発注点（${values.reorderPoint} ${values.unit ?? ''}）より多い数を入力してください。`;
}

function ProductFormPage({
  product,
  initialValues,
  initialErrors,
  saving: savingProp = false,
}: {
  /** The product to edit. Without it the page registers a product. */
  product?: Product & ProductDetails;
  initialValues?: ProductFormValues;
  initialErrors?: FormErrors;
  /** Holds the page in the saving state, for the story that shows it. */
  saving?: boolean;
}) {
  const editing = product !== undefined;
  // The header names the product as saved, not as typed, so it changes only when a save succeeds.
  const [savedName, setSavedName] = useState(product?.name);
  // The summary appears once a submit has failed, and follows the errors as they are fixed.
  const [submitFailed, setSubmitFailed] = useState(initialErrors !== undefined);
  const summaryRef = useRef<HTMLDivElement>(null);
  const form = useForm<ProductFormValues>({
    mode: 'uncontrolled',
    initialValues: initialValues ?? (product ? valuesOf(product) : EMPTY_VALUES),
    initialErrors,
    validate: {
      code: editing ? undefined : validateCode,
      name: validateName,
      category: validateCategory,
      unit: validateUnit,
      jan: validateJan,
      description: validateDescription,
      price: validatePrice,
      // The stock on hand changes through receipts and shipments once the product exists.
      quantity: editing ? undefined : validateQuantity,
      reorderPoint: validateReorderPoint,
      target: validateTarget,
    },
    validateInputOnBlur: true,
  });

  // The unit, the price and the reorder point are shown elsewhere on the form as they are typed.
  const unit = form.useWatchValue('unit');
  const price = form.useWatchValue('price');
  const reorderPoint = form.useWatchValue('reorderPoint');
  // A changed reorder point can fix or break the target below it, so its message follows once it has one.
  form.watch('reorderPoint', () => {
    if (form.isTouched('target') || form.errors.target) form.validateField('target');
  });

  const saving = savingProp || form.submitting;
  const suffix = unit ? ` ${unit}` : undefined;
  // Before a price is typed, the line says what will appear on it; a bare placeholder figure would not tell.
  const priceNote =
    !isBlank(price) && Number(price) > 0
      ? `税込 ${yen(Math.floor(Number(price) * (1 + TAX_RATE)))}（1 ${unit ?? '単位'}あたり）`
      : '単価を入れると、税込の金額を表示します。';
  const reorderNow =
    product !== undefined && !isBlank(reorderPoint) && product.quantity < Number(reorderPoint);

  const submit = form.onSubmit(
    // The service would send the values here; the story waits as long as a save takes and reports it.
    async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (editing) {
        setSavedName(values.name);
        form.resetDirty(values);
      }
      notifications.show({
        title: editing ? '変更を保存しました' : '商品を登録しました',
        message:
          values.status === 'onSale'
            ? `${values.code} ${values.name}は、受注の登録で選べます。`
            : `${values.code} ${values.name}は、販売を停止しています。`,
      });
    },
    /*
     * The errors can sit in all three cards, so the page goes back to the summary at its top and focus moves there:
     * a screen reader reads how many fields to fix and which, and each line leads to its field.
     */
    () => {
      setSubmitFailed(true);
      window.setTimeout(() => {
        summaryRef.current?.focus({ preventScroll: true });
        window.scrollTo({ top: 0 });
      });
    },
  );

  const errorFields = FIELDS.filter(([field]) => form.errors[field]).map(([field]) => field);

  const title = editing ? '商品を編集' : '商品を登録';
  const page = editing ? (savedName ?? '') : '商品を登録';

  return (
    <AppFrame parent="商品" page="商品一覧" breadcrumbs={['商品', '商品一覧', page]}>
      <Stack gap="lg" maw={720}>
        <Stack gap="sm">
          <BackLink to="商品一覧" />
          <Stack gap={4}>
            <Title order={1} size="h3">
              {title}
            </Title>
            <Text size="sm" c="dimmed">
              {editing ? `${product.code} ${savedName}` : '受注と在庫で扱う商品を登録します。'}
            </Text>
          </Stack>
        </Stack>
        {submitFailed && errorFields.length > 0 && (
          // A named region rather than Mantine's role="alert": focus moves here, which already makes it read.
          <Alert
            ref={summaryRef}
            tabIndex={-1}
            role="region"
            color={ATTENTION_COLOR}
            icon={<IconAlertCircle />}
            title={`入力に誤りが ${errorFields.length} 件あります`}
          >
            <Stack gap={4}>
              <Text size="sm">
                次の欄を直してから、もう一度「{editing ? '保存' : '登録'}」を押してください。
              </Text>
              {/* Each field shows its own message; the summary only names the fields and leads to them. */}
              <Text size="sm">
                {errorFields.map((field, index) => (
                  <span key={field}>
                    {index > 0 && '、'}
                    <Anchor
                      href={`#${fieldId(field)}`}
                      onClick={(event) => jumpToField(event, field)}
                    >
                      {LABEL[field]}
                    </Anchor>
                  </span>
                ))}
              </Text>
            </Stack>
          </Alert>
        )}
        {/* noValidate replaces the browser's English bubbles with the Japanese messages below each field. */}
        <form noValidate onSubmit={submit} aria-busy={saving || undefined}>
          <Stack gap="lg">
            {/*
             * While a save is on its way every field is locked the same way: the disabled fieldset disables each
             * control inside it, so nothing can change what was sent. Links to other screens stay usable, like the
             * sidebar and the breadcrumbs, because the save goes on after the page is left and its notification shows
             * on whichever screen is open; the line by the buttons says so.
             */}
            <Fieldset variant="unstyled" m={0} disabled={saving}>
              <Stack gap="lg">
                <SectionCard title="基本の情報">
                  <Stack gap="md">
                    {/* A value that cannot change is shown as text, so it does not look like a field to type in. */}
                    {editing ? (
                      <Input.Wrapper
                        labelElement="div"
                        label="商品コード"
                        description="登録後は変更できません。別のコードにするときは、商品を登録し直して、この商品の販売を停止してください。"
                      >
                        <Text size="sm" mt={4}>
                          {product.code}
                        </Text>
                      </Input.Wrapper>
                    ) : (
                      <TextInput
                        label="商品コード"
                        description="受注と在庫の画面で商品を見分ける番号です。P- と 4 桁の数字で付けます。"
                        placeholder={`例: ${NEXT_CODE}`}
                        required
                        autoComplete="off"
                        id={fieldId('code')}
                        key={form.key('code')}
                        {...form.getInputProps('code')}
                      />
                    )}
                    <TextInput
                      label="商品名"
                      description={`受注の画面と納品書に出る名前です。${NAME_MAX} 文字まで入力できます。`}
                      required
                      autoComplete="off"
                      id={fieldId('name')}
                      key={form.key('name')}
                      {...form.getInputProps('name')}
                    />
                    <SimpleGrid type="container" cols={{ base: 1, '30rem': 2 }}>
                      <Select
                        label="分類"
                        placeholder="選んでください"
                        data={PRODUCT_CATEGORIES}
                        required
                        id={fieldId('category')}
                        key={form.key('category')}
                        {...form.getInputProps('category')}
                      />
                      <Select
                        label="単位"
                        placeholder="選んでください"
                        data={UNITS}
                        required
                        id={fieldId('unit')}
                        key={form.key('unit')}
                        {...form.getInputProps('unit')}
                      />
                    </SimpleGrid>
                    <TextInput
                      label="JAN コード"
                      description="8 桁か 13 桁の数字です。バーコードで受注を登録するときに使います。"
                      inputMode="numeric"
                      autoComplete="off"
                      id={fieldId('jan')}
                      key={form.key('jan')}
                      {...form.getInputProps('jan')}
                    />
                    <Textarea
                      label="説明"
                      description={`仕様や取り扱いの注意を書きます。受注を登録する画面に出ます。${DESCRIPTION_MAX} 文字まで入力できます。`}
                      autosize
                      minRows={3}
                      id={fieldId('description')}
                      key={form.key('description')}
                      {...form.getInputProps('description')}
                    />
                  </Stack>
                </SectionCard>
                <SectionCard title="価格と販売">
                  <Stack gap="md">
                    <NumberInput
                      label="単価（税抜）"
                      description={priceNote}
                      prefix="¥"
                      thousandSeparator=","
                      allowNegative={false}
                      allowDecimal={false}
                      // Stepping a price by ¥1 is never how a price is set, so the step buttons are left out.
                      hideControls
                      required
                      id={fieldId('price')}
                      key={form.key('price')}
                      {...form.getInputProps('price')}
                    />
                    <Radio.Group
                      label="販売の状態"
                      key={form.key('status')}
                      {...form.getInputProps('status')}
                    >
                      <Stack gap="sm" mt="xs">
                        <Radio value="onSale" label="販売中" description="受注の登録で選べます。" />
                        <Radio
                          value="stopped"
                          label="販売を停止"
                          description="受注の登録で選べなくなります。これまでの受注と在庫はそのまま残ります。"
                        />
                      </Stack>
                    </Radio.Group>
                  </Stack>
                </SectionCard>
                <SectionCard
                  title="在庫"
                  description={`${editing ? '' : '在庫数は登録の時点の数で、以後は入出庫の記録で増減します。'}在庫が発注点を下回ると、ダッシュボードと在庫の画面で要発注と表示します。適正在庫は、発注するときに補う目安の数です。`}
                >
                  <Stack gap="md">
                    {editing && (
                      <Input.Wrapper
                        labelElement="div"
                        label="現在の在庫"
                        description="入出庫の記録から決まります。"
                      >
                        <Group gap="sm" mt={4}>
                          <Text size="sm">
                            {product.quantity} {product.unit}
                          </Text>
                          {reorderNow && <Badge color={ATTENTION_COLOR}>要発注</Badge>}
                          <Anchor href="#" size="sm">
                            在庫の画面で調整
                          </Anchor>
                        </Group>
                      </Input.Wrapper>
                    )}
                    <SimpleGrid type="container" cols={{ base: 1, '30rem': editing ? 2 : 3 }}>
                      {!editing && (
                        <NumberInput
                          label="在庫数"
                          suffix={suffix}
                          min={0}
                          allowNegative={false}
                          allowDecimal={false}
                          required
                          id={fieldId('quantity')}
                          key={form.key('quantity')}
                          {...form.getInputProps('quantity')}
                        />
                      )}
                      <NumberInput
                        label="発注点"
                        suffix={suffix}
                        min={0}
                        allowNegative={false}
                        allowDecimal={false}
                        required
                        id={fieldId('reorderPoint')}
                        key={form.key('reorderPoint')}
                        {...form.getInputProps('reorderPoint')}
                      />
                      <NumberInput
                        label="適正在庫"
                        suffix={suffix}
                        min={0}
                        allowNegative={false}
                        allowDecimal={false}
                        required
                        id={fieldId('target')}
                        key={form.key('target')}
                        {...form.getInputProps('target')}
                      />
                    </SimpleGrid>
                  </Stack>
                </SectionCard>
              </Stack>
            </Fieldset>
            {/*
             * The buttons follow the last field, where the user is when the form is filled in from the top. The
             * status line sits on their left and goes above them when the row is too narrow; it is a live region
             * from the start, so a screen reader reads it when a save begins.
             */}
            <Group justify="flex-end" gap="sm">
              <Text size="sm" c="dimmed" role="status" mr="auto">
                {saving &&
                  `${editing ? '保存' : '登録'}しています。ほかの画面に移っても、${editing ? '保存' : '登録'}は続きます。`}
              </Text>
              <Group gap="sm">
                <Button variant="default" disabled={saving}>
                  取り消し
                </Button>
                <Button type="submit" loading={saving}>
                  {editing ? '保存' : '登録'}
                </Button>
              </Group>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AppFrame>
  );
}

const meta = {
  title: '画面例 / 作成と編集のフォーム',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      // AppShell places the frame with position: fixed, so each story is drawn in an iframe of its own.
      story: { inline: false, height: '900px' },
      description: {
        component:
          '架空の販売管理サービスの、商品を登録・編集するフォームの画面です。\n\n' +
          '**目的と読み手**　商品を担当する社員が、取り扱う商品を増やすときや、価格と発注点を見直すときに開きます。毎日ではなく月に数回使う画面なので、見慣れた配置はサービスのほかの画面に揃えつつ、迷いやすい欄（商品コードの形式、発注点と適正在庫）にだけ説明を添えました。\n\n' +
          '**情報構造**　主は 1 つの商品で、その識別（商品コード・商品名・分類・単位）、売り方（単価・販売の状態）、在庫の決まり（発注点・適正在庫）を持ちます。従として、商品コードで商品を指す受注の明細と、入出庫の記録から決まる在庫数があり、この 2 つが「登録後は商品コードを変えない」「在庫数は編集しない」を決めています。\n\n' +
          '**データパターン**　項目は 11 個で、入力が必須の 8 個、任意の 2 個（JAN コード・説明）、常にどちらかが選ばれている販売の状態です。商品名は 6〜20 文字ほど（上限 60 文字）、説明は空から 200 文字まで、単価は ¥90〜¥3,200、在庫の数は 0〜数百で、単位は箱・袋・冊などです。状態は、何も入っていない（story『商品の登録』）、登録済みの値が入っていて在庫が発注点を下回っている（story『商品の編集』）、送信した値に誤りがあり、誤りが 3 つの Card にまたがる（story『入力に誤りがあるとき』）、送信して返事を待っている（story『保存中』）の 4 つです。\n\n' +
          '**情報の流れ**　登録では、手元の仕入れ先の資料を見ながら、何の商品か → いくらで売るか → どれだけ持つか、の順に埋め、最後に登録します。編集では、まず見出しで開いた商品を確かめ、現在の在庫と要発注の印を見てから発注点と適正在庫を決め直す、または単価や販売の状態を変えて保存します。\n\n' +
          '**主役**　流れの順に並べた入力欄と、最後の欄の下にある「登録」（編集では「保存」）です。欄は流れの区切りどおり「基本の情報」「価格と販売」「在庫」の 3 つの Card に分け、単位を価格と在庫より先に選ばせて、単価の税込の金額と在庫の欄の単位がその場で表示されるようにしました。誤りは欄を離れたときと送信したときに、欄の下に日本語の理由で示します。送信で誤りがあれば、見出しの下に件数と直す欄へのリンクを並べたまとめを出し、ページをその位置に戻してフォーカスもまとめに移します。誤りが 3 つの Card にまたがり、390 の幅では最後の誤りが何画面も下にあるため、どこまで直せばよいかを先に知ってから 1 つずつ移れるようにしました。\n\n' +
          '**抑えたもの・使わなかったもの**　塗りのボタンは「登録」だけにし、「取り消し」は枠のボタンにしました。編集に削除のボタンは置いていません。受注の明細が商品を指しているため、扱いをやめるときは「販売を停止」を選び、これまでの受注と在庫を残します。編集では、変えられない商品コードと在庫数を入力欄にせず文字で出し、在庫数には在庫の画面への道を添えました。入力欄の形のまま読み取り専用にすると、打てそうに見えて迷わせるためです。保存中は、すべての欄を同じように使えなくして（欄を囲む fieldset の disabled）、送った値を変えられないことを見た目でも伝え、ボタンの読み込み表示で待つことを伝えます。在庫の画面と一覧へのリンクは、サイドバーと同じく保存中も使えるまま残し、ボタンの横に、ほかの画面に移っても保存が続くことを書きました。送った値は離れても変わらず、保存の結果の通知はどの画面にも出るので、待たせる理由が無いためです。誤りのまとめには理由を書かず欄の名前だけを並べ、理由は欄の下の 1 か所に置きました。\n\n' +
          '**目的が違えば変わるところ**　欄が 3〜4 個なら Card に分けず 1 つにまとめ、Modal の中で登録してもよいです。画像・仕入れ先・複数の価格まで持つ商品なら、右に販売の状態と保存のボタンを置く 2 段組にし、長い画面でもボタンが見える位置に留めます。毎日大量に登録するなら、CSV からの一括の取り込みを別に用意します。設定の画面は、項目を変えたときだけ画面の下に「変更を保存」を固定して出す型です。今の値を読むために開くことも多く、変える項目が長いページのあちこちに散るためで、このフォームは登録か編集をするために開き、上から埋めて最後の欄で終えるので、ボタンを最後の欄の下に常に置きました。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateProduct: Story = {
  name: '商品の登録',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「何も入っていない」です。商品コードの欄には次に空いている番号を「例:」を付けて薄く出し、入力済みの値と見分けられるようにしています。単価の下には、入力する前は「単価を入れると、税込の金額を表示します。」と、その行に何が出るかを書き、単価を入れるとその場で「税込 ¥1,078（1 箱あたり）」の形に替わります。在庫の欄には、単位を選ぶまで単位を付けません。',
      },
    },
  },
  render: () => <ProductFormPage />,
};

export const EditProduct: Story = {
  name: '商品の編集',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「登録済みの値が入っていて在庫が発注点を下回っている」です。見出しは保存済みの商品名、ボタンは「保存」になり、商品コードと在庫数は文字で出して、在庫数の横に要発注の印を添えます。',
      },
    },
  },
  render: () => <ProductFormPage product={EDITED_PRODUCT} />,
};

const INVALID_VALUES: ProductFormValues = {
  ...EMPTY_VALUES,
  code: 'P-1003',
  category: '用紙',
  unit: '冊',
  jan: '45012',
  quantity: 0,
  reorderPoint: 30,
  target: 20,
};

export const CreateProductWithErrors: Story = {
  name: '入力に誤りがあるとき',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「送信した値に誤りがあり、誤りが 3 つの Card にまたがる」です。見出しの下のまとめで誤りの件数と直す欄を示し、リンクでその欄へ移れます。欄ごとに何が違うかと直し方を日本語で表示し、使われている商品コードにはどの商品で使われているかを、適正在庫には比べた発注点の数を書きます。',
      },
    },
  },
  render: () => (
    <ProductFormPage
      initialValues={INVALID_VALUES}
      initialErrors={{
        code: validateCode(INVALID_VALUES.code),
        name: validateName(INVALID_VALUES.name),
        jan: validateJan(INVALID_VALUES.jan),
        price: validatePrice(INVALID_VALUES.price),
        target: validateTarget(INVALID_VALUES.target, INVALID_VALUES),
      }}
    />
  ),
};

export const SavingProduct: Story = {
  name: '保存中',
  parameters: {
    docs: {
      description: {
        story:
          'データパターンの「送信して返事を待っている」で、編集で単価と発注点を変えて「保存」を押したあとです。欄はすべて同じように使えなくし（数値の欄の上下のボタンも含む）、「保存」は読み込み表示に、「取り消し」は押せなくして、二重の送信と途中の変更を防ぎます。ボタンの横には、ほかの画面に移っても保存が続くことを書き、リンクとサイドバーは使えるまま残します。',
      },
    },
  },
  render: () => (
    <ProductFormPage
      product={EDITED_PRODUCT}
      initialValues={{ ...valuesOf(EDITED_PRODUCT), price: 3_080, reorderPoint: 60 }}
      saving
    />
  ),
};
