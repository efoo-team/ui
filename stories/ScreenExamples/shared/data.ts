// Fictional data shared by the 画面例 of one fictional sales management service. Every name, address and number is
// fictional. Figures that appear on more than one screen, or twice on one screen, are computed from one source.
// The screens show the state on October 31, 2026.

// The color for "the user should act on this". Everything else stays neutral.
export const ATTENTION_COLOR = 'red';

export const yen = (value: number) => `¥${value.toLocaleString('ja-JP')}`;
export const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

// The moment the screens show, in the forms the data uses: the ISO date that date inputs take and return, and the
// month/day with time of OrderEvent.at, which an action taken on a screen is stamped with.
export const NOW = { date: '2026-10-31', at: '10/31 14:20' };

// Order.date is month/day ('10/31'); the year is the one of NOW.
const monthAndDay = (date: string) => date.split('/');

// '10/31' -> '10 月 31 日', the way the screens write a date in a sentence.
export const monthDay = (date: string) => {
  const [month, day] = monthAndDay(date);
  return `${month} 月 ${day} 日`;
};

// '10/31' -> '2026-10-31', the form date inputs return, so an order's date compares with them as a string.
export const isoDate = (date: string) => {
  const [month = '', day = ''] = monthAndDay(date);
  return `${NOW.date.slice(0, 4)}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// '2026-10-31' -> '10/31', so a date picked in a date input is kept in the form the data uses.
export const fromIsoDate = (date: string) => {
  const [, month, day] = date.split('-');
  return `${Number(month)}/${Number(day)}`;
};

export interface Organization {
  name: string;
  initial: string;
  note: string;
}

// The organization the switcher selects when a screen opens, and whose data the screens show.
export const DEFAULT_ORGANIZATION: Organization = {
  name: '青葉商店',
  initial: '青',
  note: '標準プラン',
};

export const ORGANIZATIONS: Organization[] = [
  DEFAULT_ORGANIZATION,
  { name: '北町センター', initial: '北', note: '標準プラン' },
  { name: 'みなと通販', initial: 'み', note: 'お試し中' },
];

// The signed-in user, who is also one of the staff.
export const CURRENT_USER = { name: '青木 陽', initial: '青', email: 'user@example.com' };

// The other two staff, by what they do: 石川 checks the payments and is the organization's administrator, and 上田
// ships the orders and looks after the stock.
export const ACCOUNTING_STAFF = '石川 舞';
export const SHIPPING_STAFF = '上田 健';

export const STAFF = [CURRENT_USER.name, ACCOUNTING_STAFF, SHIPPING_STAFF];

export interface Customer {
  name: string;
  contact: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
}

// Postal codes, phone numbers and the .example domain are not in use, so they reach no one.
export const CUSTOMERS: Customer[] = [
  {
    name: 'サンプル商事',
    contact: '加藤 実',
    postalCode: '000-0001',
    address: '東京都見本区サンプル町 1-2-3 見本ビル 4 階',
    phone: '03-0000-0101',
    email: 'order@sample-shoji.example',
  },
  {
    name: '見本工業',
    contact: '木村 葵',
    postalCode: '000-0002',
    address: '大阪府見本市試験町 2-4-6',
    phone: '06-0000-0202',
    email: 'buyer@mihon-kogyo.example',
  },
  {
    name: 'テスト物産',
    contact: '工藤 誠',
    postalCode: '000-0003',
    address: '愛知県見本市例示町 3-1-8',
    phone: '052-000-0303',
    email: 'info@test-bussan.example',
  },
  {
    name: '例示デザイン室',
    contact: '小池 遥',
    postalCode: '000-0004',
    address: '福岡県見本市仮名町 5-5-1 202 号',
    phone: '092-000-0404',
    email: 'studio@reiji-design.example',
  },
  {
    name: '模型堂',
    contact: '坂本 匠',
    postalCode: '000-0005',
    address: '北海道見本市模型町 7-3',
    phone: '011-000-0505',
    email: 'shop@mokei-do.example',
  },
  {
    name: '試作食品',
    contact: '杉山 恵',
    postalCode: '000-0006',
    address: '宮城県見本市試作町 4-12-2',
    phone: '022-000-0606',
    email: 'soumu@shisaku-foods.example',
  },
  {
    name: '仮名書店',
    contact: '高田 進',
    postalCode: '000-0007',
    address: '京都府見本市仮名町 1-9',
    phone: '075-000-0707',
    email: 'books@kamei-shoten.example',
  },
];

export const PRODUCT_CATEGORIES = ['用紙', '筆記具', 'ファイル', '事務用品'];

export interface Product {
  code: string;
  name: string;
  category: string;
  unit: string;
  /** Unit price before tax. */
  price: number;
  quantity: number;
  reorderPoint: number;
  target: number;
}

export const PRODUCTS: Product[] = [
  {
    code: 'P-1001',
    name: 'A4 コピー用紙（500 枚）',
    category: '用紙',
    unit: '箱',
    price: 2_980,
    quantity: 18,
    reorderPoint: 40,
    target: 200,
  },
  {
    code: 'P-1002',
    name: 'ボールペン 黒（10 本）',
    category: '筆記具',
    unit: '箱',
    price: 1_200,
    quantity: 35,
    reorderPoint: 50,
    target: 300,
  },
  {
    code: 'P-1003',
    name: 'クリアファイル（20 枚）',
    category: 'ファイル',
    unit: '袋',
    price: 450,
    quantity: 120,
    reorderPoint: 60,
    target: 250,
  },
  {
    code: 'P-1004',
    name: '付箋 75mm 角',
    category: '事務用品',
    unit: '冊',
    price: 180,
    quantity: 160,
    reorderPoint: 80,
    target: 240,
  },
  {
    code: 'P-1005',
    name: 'ホチキス針 No.10',
    category: '事務用品',
    unit: '箱',
    price: 90,
    quantity: 210,
    reorderPoint: 50,
    target: 260,
  },
];

export const needsReorder = (product: Product) => product.quantity < product.reorderPoint;

// Every product the wholesaler sells: the five above, which the orders use, and a catalog-sized tail, so a product
// list reads like a real one and a new product code follows the last one in use.
export const ALL_PRODUCTS: Product[] = [
  ...PRODUCTS,
  {
    code: 'P-1006',
    name: '油性マーカー 黒（10 本）',
    category: '筆記具',
    unit: '箱',
    price: 980,
    quantity: 44,
    reorderPoint: 30,
    target: 150,
  },
  {
    code: 'P-1007',
    name: 'シャープペンシル 0.5mm',
    category: '筆記具',
    unit: '本',
    price: 220,
    quantity: 26,
    reorderPoint: 40,
    target: 160,
  },
  {
    code: 'P-1008',
    name: 'リングファイル A4 2 穴',
    category: 'ファイル',
    unit: '冊',
    price: 380,
    quantity: 75,
    reorderPoint: 40,
    target: 180,
  },
  {
    code: 'P-1009',
    name: 'A3 コピー用紙（250 枚）',
    category: '用紙',
    unit: '箱',
    price: 3_200,
    quantity: 12,
    reorderPoint: 10,
    target: 60,
  },
  {
    code: 'P-1010',
    name: '感熱ロール紙 58mm（20 巻）',
    category: '用紙',
    unit: '箱',
    price: 1_850,
    quantity: 9,
    reorderPoint: 15,
    target: 80,
  },
  {
    code: 'P-1011',
    name: 'ダブルクリップ 中（10 個）',
    category: '事務用品',
    unit: '箱',
    price: 160,
    quantity: 95,
    reorderPoint: 40,
    target: 200,
  },
  {
    code: 'P-1012',
    name: '修正テープ 5mm',
    category: '筆記具',
    unit: '個',
    price: 240,
    quantity: 130,
    reorderPoint: 60,
    target: 220,
  },
];

export type OrderStatus = 'paymentPending' | 'notShipped' | 'shipped' | 'cancelled';

// Only "not shipped" asks the user to act; the other states are shown without color.
export const ORDER_STATUS: Record<OrderStatus, { label: string; attention: boolean }> = {
  notShipped: { label: '未発送', attention: true },
  paymentPending: { label: '入金待ち', attention: false },
  shipped: { label: '発送済み', attention: false },
  cancelled: { label: 'キャンセル済み', attention: false },
};

/*
 * An order on its way to shipping: neither shipped nor cancelled. Only such an order can still be cancelled, and only
 * its lines still wait for stock, since an order takes its stock when it ships.
 */
export const awaitsShipment = (order: { status: OrderStatus }) =>
  order.status === 'notShipped' || order.status === 'paymentPending';

// The payment methods by kind, so a screen names one by what it is rather than by its place in a list.
export const PAYMENT_METHODS = {
  invoice: '請求書払い（月末締め翌月末払い）',
  // The only method paid before shipping.
  bankTransfer: '銀行振込（前払い）',
  card: 'クレジットカード',
};

export const TAX_RATE = 0.1;

export interface OrderLine {
  product: Product;
  quantity: number;
  /** Unit price before tax at the time of the order. */
  unitPrice: number;
}

// What happened to an order. A screen tells events apart by this, not by the wording of the label, which can change.
export type OrderEventKind =
  'registered' | 'paymentConfirmed' | 'delayNotified' | 'shipped' | 'cancelled';

export interface OrderEvent {
  /** Tells the event apart from the others in the history, as the row's id in a service's database does. */
  id: string;
  /** Month/day and time, e.g. '10/31 09:12'. */
  at: string;
  kind: OrderEventKind;
  /** What the history shows, with the details of this one event (the carrier, the day of the transfer). */
  label: string;
  by: string;
}

export interface Order {
  /** SO- and six digits, from SO-010240 (newest) down to SO-010205. */
  id: string;
  customer: Customer;
  status: OrderStatus;
  staff: string;
  /** Month/day of the order, e.g. '10/31'. */
  date: string;
  /** Month/day the order left, for a shipped order; the day the shipment was recorded is in its history. */
  shippedOn?: string;
  lines: OrderLine[];
  /** Sum of the lines before tax. */
  subtotal: number;
  tax: number;
  /** subtotal + tax, the amount the customer pays. */
  amount: number;
  payment: string;
  shipTo: { name: string; contact: string; postalCode: string; address: string };
  /** Oldest first. */
  history: OrderEvent[];
}

const LINE_QUANTITIES = [10, 20, 5, 30, 12, 8, 50, 15];

function orderLines(index: number): OrderLine[] {
  // One to three lines; the newest order, the one a detail screen opens, has three.
  return Array.from({ length: 3 - (index % 3) }, (_, line) => {
    const product = PRODUCTS[(index + line * 2) % PRODUCTS.length]!;
    const quantity = LINE_QUANTITIES[(index * 3 + line) % LINE_QUANTITIES.length]!;
    return { product, quantity, unitPrice: product.price };
  });
}

function orderHistory(
  index: number,
  date: string,
  status: OrderStatus,
  payment: string,
  staff: string,
) {
  const minute = String((index * 7) % 50).padStart(2, '0');
  const events: Omit<OrderEvent, 'id'>[] = [
    { at: `${date} 09:${minute}`, kind: 'registered', label: '受注を登録', by: staff },
  ];
  if (status === 'cancelled') {
    events.push({
      at: `${date} 15:${minute}`,
      kind: 'cancelled',
      label: '受注をキャンセル（顧客の依頼）',
      by: staff,
    });
    return events;
  }
  if (payment === PAYMENT_METHODS.bankTransfer && status !== 'paymentPending') {
    events.push({
      at: `${date} 11:${minute}`,
      kind: 'paymentConfirmed',
      label: '入金を確認',
      by: ACCOUNTING_STAFF,
    });
  }
  if (status === 'shipped')
    events.push({ at: `${date} 16:${minute}`, kind: 'shipped', label: '発送', by: SHIPPING_STAFF });
  return events;
}

// The customer of each order as an index into CUSTOMERS, newest order first. Regular customers order every few days
// and small ones now and then, whatever state their earlier orders are in, so a customer's orders mix states.
const ORDER_CUSTOMERS = [
  0, 2, 1, 3, 6, 0, 5, 1, 2, 4, 0, 3, 1, 5, 2, 0, 6, 1, 3, 2, 4, 0, 1, 5, 2, 0, 3, 1, 6, 4, 0, 2, 5,
  1, 0, 3,
];

/*
 * The state follows the age of an order, as in a wholesaler's real book: an order is shipped within a day or two, so
 * the unshipped ones are the last days' orders, and only two have waited two days or more (SO-010228 waits for
 * ballpoint pens that are short in stock). Bank transfers wait a few days for the payment, and a few orders anywhere
 * in the period are cancelled. Every order not listed here is shipped.
 */
const ORDER_STATUSES: Record<string, OrderStatus> = {
  'SO-010240': 'notShipped',
  'SO-010239': 'paymentPending',
  'SO-010238': 'notShipped',
  'SO-010237': 'notShipped',
  'SO-010236': 'paymentPending',
  'SO-010235': 'notShipped',
  'SO-010231': 'paymentPending',
  'SO-010229': 'cancelled',
  'SO-010228': 'notShipped',
  'SO-010224': 'paymentPending',
  'SO-010220': 'cancelled',
  'SO-010208': 'cancelled',
};

const PAYMENT_METHOD_LIST = Object.values(PAYMENT_METHODS);

// 36 orders, two a day from October 31 back to October 14.
export const ORDERS: Order[] = Array.from({ length: 36 }, (_, index) => {
  const id = `SO-${String(10_240 - index).padStart(6, '0')}`;
  const customer = CUSTOMERS[ORDER_CUSTOMERS[index]!]!;
  const status = ORDER_STATUSES[id] ?? 'shipped';
  const staff = STAFF[(index * 2) % STAFF.length]!;
  const date = `10/${31 - Math.floor(index / 2)}`;
  // Only bank transfer is paid before shipping, so it is the payment of the orders waiting for it.
  const payment =
    status === 'paymentPending'
      ? PAYMENT_METHODS.bankTransfer
      : PAYMENT_METHOD_LIST[index % PAYMENT_METHOD_LIST.length]!;
  const lines = orderLines(index);
  const subtotal = sum(lines.map((line) => line.unitPrice * line.quantity));
  const tax = Math.floor(subtotal * TAX_RATE);
  return {
    id,
    customer,
    status,
    staff,
    date,
    // Orders leave on the day they come in, as the history records.
    shippedOn: status === 'shipped' ? date : undefined,
    lines,
    subtotal,
    tax,
    amount: subtotal + tax,
    payment,
    shipTo: {
      name: customer.name,
      contact: customer.contact,
      postalCode: customer.postalCode,
      address: customer.address,
    },
    history: orderHistory(index, date, status, payment, staff).map((event, number) => ({
      ...event,
      id: `${id}-${number + 1}`,
    })),
  };
});

// An unshipped order that has waited this many days or more is late.
export const LATE_DAYS = 2;

const DAY = 24 * 60 * 60 * 1000;

/** Days an unshipped order has waited as of NOW, when that reaches LATE_DAYS; otherwise undefined. */
export const lateDays = (order: Pick<Order, 'status' | 'date'>) => {
  if (order.status !== 'notShipped') return undefined;
  const days = Math.round((Date.parse(NOW.date) - Date.parse(isoDate(order.date))) / DAY);
  return days >= LATE_DAYS ? days : undefined;
};

export const findOrder = (id: string) => ORDERS.find((order) => order.id === id);

export const INQUIRIES = { total: 100, done: 62, inProgress: 24, open: 14, overdue: 3 };
