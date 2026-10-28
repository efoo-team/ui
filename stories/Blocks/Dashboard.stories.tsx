import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  ActionIcon,
  AppShell,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  CloseButton,
  Divider,
  Group,
  Menu,
  NavLink,
  Pagination,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AreaChart } from '@mantine/charts';
import '@mantine/charts/styles.layer.css';
import {
  IconChartBar,
  IconCheck,
  IconChevronDown,
  IconCircleCheckFilled,
  IconCirclePlusFilled,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconDots,
  IconDotsVertical,
  IconFileWord,
  IconFolder,
  IconGripVertical,
  IconHelp,
  IconInnerShadowTop,
  IconLayoutColumns,
  IconLayoutSidebar,
  IconListDetails,
  IconLoader,
  IconLogout,
  IconMail,
  IconNotification,
  IconPlus,
  IconReport,
  IconSearch,
  IconSettings,
  IconTrendingDown,
  IconTrendingUp,
  IconUserCircle,
  IconUsers,
  type Icon,
} from '@tabler/icons-react';
import classes from './Dashboard.module.css';

const meta = {
  title: 'Blocks/Dashboard',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ICON_SIZE = 16;

// All values below are fictional.

interface NavItem {
  label: string;
  icon: Icon;
}

const MAIN_NAV: NavItem[] = [
  { label: 'ダッシュボード', icon: IconDashboard },
  { label: 'ライフサイクル', icon: IconListDetails },
  { label: '分析', icon: IconChartBar },
  { label: 'プロジェクト', icon: IconFolder },
  { label: 'チーム', icon: IconUsers },
];

const DOCUMENT_NAV: NavItem[] = [
  { label: 'データライブラリ', icon: IconDatabase },
  { label: 'レポート', icon: IconReport },
  { label: '文書アシスタント', icon: IconFileWord },
];

const SECONDARY_NAV: NavItem[] = [
  { label: '設定', icon: IconSettings },
  { label: 'ヘルプ', icon: IconHelp },
  { label: '検索', icon: IconSearch },
];

interface Stat {
  label: string;
  value: string;
  change: string;
  up: boolean;
  summary: string;
  note: string;
}

const STATS: Stat[] = [
  {
    label: '売上合計',
    value: '¥1,250,000',
    change: '+12.5%',
    up: true,
    summary: '今月は増加傾向です',
    note: '直近 6 か月の訪問者数',
  },
  {
    label: '新規顧客',
    value: '1,234',
    change: '-20%',
    up: false,
    summary: 'この期間は 20% 減少',
    note: '獲得施策の見直しが必要です',
  },
  {
    label: '有効なアカウント',
    value: '45,678',
    change: '+12.5%',
    up: true,
    summary: '継続利用が好調です',
    note: '利用率が目標を上回りました',
  },
  {
    label: '成長率',
    value: '4.5%',
    change: '+4.5%',
    up: true,
    summary: '安定して伸びています',
    note: '見込みどおりに推移',
  },
];

interface VisitorPoint {
  date: string;
  desktop: number;
  mobile: number;
}

// 91 days ending on June 30. The values are generated so the story is deterministic.
const VISITORS: VisitorPoint[] = Array.from({ length: 91 }, (_, index) => {
  const day = new Date(2026, 3, 1 + index);
  const wave = (offset: number, period: number) =>
    Math.round(260 + 160 * Math.sin((index + offset) / period) * Math.cos(index / 2.3));
  return {
    date: `${day.getMonth() + 1}月${day.getDate()}日`,
    desktop: Math.abs(wave(0, 3.1)) + 60,
    mobile: Math.abs(wave(4, 4.7)) + 40,
  };
});

const PERIODS = [
  { value: '90', label: '過去 3 か月' },
  { value: '30', label: '過去 30 日' },
  { value: '7', label: '過去 7 日' },
];

type SectionStatus = 'done' | 'inProgress';

interface Section {
  id: number;
  header: string;
  type: string;
  status: SectionStatus;
  target: number;
  limit: number;
  reviewer: string | null;
}

const SECTION_TITLES = [
  '表紙',
  '目次',
  '概要',
  '技術的な進め方',
  '設計',
  '対応できること',
  '既存の仕組みとの連携',
  '新しい点と利点',
  '導入手順の概要',
  '計算処理と学習の仕組み',
  '安全対策',
  '運用体制',
  '費用の見積もり',
  '日程',
  '品質の確かめ方',
  '用語の説明',
  '参考資料',
];

const SECTION_TYPES = ['表紙', '目次', '本文', '本文', '技術資料', '本文', '計画'];
const REVIEWERS = ['担当者 A', '担当者 B', '担当者 C'];

const SECTIONS: Section[] = Array.from({ length: 68 }, (_, index) => {
  const round = Math.floor(index / SECTION_TITLES.length);
  const title = SECTION_TITLES[index % SECTION_TITLES.length] ?? '';
  return {
    id: index + 1,
    header: round === 0 ? title : `${title}（${round + 1} 版）`,
    type: SECTION_TYPES[index % SECTION_TYPES.length] ?? '本文',
    status: (index * 7) % 3 === 0 ? 'inProgress' : 'done',
    target: ((index * 13) % 29) + 2,
    limit: ((index * 11) % 27) + 4,
    reviewer:
      index % 10 >= 7 ? null : (REVIEWERS[Math.floor(index / 4) % REVIEWERS.length] ?? null),
  };
});

const COLUMNS = [
  { key: 'type', label: 'セクション種別' },
  { key: 'status', label: '状態' },
  { key: 'target', label: '目標' },
  { key: 'limit', label: '上限' },
  { key: 'reviewer', label: '担当者' },
] as const;

type ColumnKey = (typeof COLUMNS)[number]['key'];

const VIEWS = [
  { value: 'outline', label: '構成' },
  { value: 'performance', label: '過去の実績', count: 3 },
  { value: 'personnel', label: '主要メンバー', count: 2 },
  { value: 'focus', label: '重点資料' },
];

function navItems(items: NavItem[]) {
  return items.map(({ label, icon: ItemIcon }) => (
    <NavLink
      key={label}
      component="button"
      type="button"
      label={label}
      leftSection={<ItemIcon size={ICON_SIZE} />}
    />
  ));
}

function Sidebar({ onClose }: { onClose: () => void }) {
  return (
    <>
      <AppShell.Section>
        <Group gap="xs" wrap="nowrap">
          <NavLink
            component="button"
            type="button"
            flex={1}
            label={
              <Text fw={600} fz="md">
                サンプル管理画面
              </Text>
            }
            leftSection={<IconInnerShadowTop size={20} />}
          />
          <CloseButton hiddenFrom="sm" onClick={onClose} aria-label="サイドバーを閉じる" />
        </Group>
      </AppShell.Section>
      <AppShell.Section grow mt="xs">
        <Stack gap="lg">
          <Stack gap={4}>
            <Group gap="xs" wrap="nowrap" mb={4}>
              <Button
                flex={1}
                size="sm"
                justify="flex-start"
                leftSection={<IconCirclePlusFilled size={ICON_SIZE} />}
              >
                すぐに作成
              </Button>
              <ActionIcon variant="outline" size="input-sm" aria-label="受信箱">
                <IconMail size={ICON_SIZE} />
              </ActionIcon>
            </Group>
            {navItems(MAIN_NAV)}
          </Stack>
          <Stack gap={4}>
            <Text fz="xs" fw={500} c="dimmed" px="xs" py={6}>
              資料
            </Text>
            {navItems(DOCUMENT_NAV)}
            <NavLink
              component="button"
              type="button"
              label="その他"
              c="dimmed"
              leftSection={<IconDots size={ICON_SIZE} />}
            />
          </Stack>
        </Stack>
      </AppShell.Section>
      <AppShell.Section>
        <Stack gap={4}>
          {navItems(SECONDARY_NAV)}
          <UserMenu />
        </Stack>
      </AppShell.Section>
    </>
  );
}

function UserMenu() {
  return (
    <Menu position="right-end" width={224}>
      <Menu.Target>
        <NavLink
          component="button"
          type="button"
          py="xs"
          label="サンプル 太郎"
          description="user@example.com"
          leftSection={
            <Avatar radius="md" size={32}>
              サ
            </Avatar>
          }
          rightSection={<IconDotsVertical size={ICON_SIZE} />}
        />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>サンプル 太郎</Menu.Label>
        <Menu.Item leftSection={<IconUserCircle size={ICON_SIZE} />}>アカウント</Menu.Item>
        <Menu.Item leftSection={<IconCreditCard size={ICON_SIZE} />}>お支払い</Menu.Item>
        <Menu.Item leftSection={<IconNotification size={ICON_SIZE} />}>通知</Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<IconLogout size={ICON_SIZE} />}>ログアウト</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const TrendIcon = stat.up ? IconTrendingUp : IconTrendingDown;
  return (
    <Card padding="lg" radius="lg" shadow="xs" className={classes.statCard}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Group justify="space-between" gap="xs" wrap="nowrap">
            <Text fz="sm" c="dimmed">
              {stat.label}
            </Text>
            <Badge
              variant="outline"
              radius="xl"
              leftSection={<TrendIcon size={12} />}
              className={classes.trendBadge}
            >
              {stat.change}
            </Badge>
          </Group>
          <Text fz="h2" lh="h2" fw={600} className={classes.statValue}>
            {stat.value}
          </Text>
        </Stack>
        <Stack gap={6}>
          <Group gap="xs" wrap="nowrap">
            <Text fz="sm" fw={500}>
              {stat.summary}
            </Text>
            <TrendIcon size={ICON_SIZE} />
          </Group>
          <Text fz="sm" c="dimmed">
            {stat.note}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}

function VisitorsCard() {
  const [period, setPeriod] = useState('90');
  const data = VISITORS.slice(-Number(period));
  const periodLabel = PERIODS.find((item) => item.value === period)?.label ?? '';

  return (
    <Card padding="lg" radius="lg" shadow="sm">
      <Group justify="space-between" align="flex-start" mb="lg">
        <Stack gap={6}>
          <Text fw={600}>訪問者数</Text>
          <Text fz="sm" c="dimmed">
            {periodLabel}の合計
          </Text>
        </Stack>
        <SegmentedControl
          visibleFrom="sm"
          data={PERIODS}
          value={period}
          onChange={setPeriod}
          aria-label="表示する期間"
        />
        <Select
          hiddenFrom="sm"
          w={140}
          data={PERIODS}
          value={period}
          onChange={(value) => value && setPeriod(value)}
          allowDeselect={false}
          aria-label="表示する期間"
        />
      </Group>
      <AreaChart
        h={250}
        data={data}
        dataKey="date"
        type="stacked"
        curveType="natural"
        series={[
          { name: 'mobile', label: 'スマートフォン', color: 'var(--mantine-primary-color-filled)' },
          { name: 'desktop', label: 'パソコン', color: 'var(--mantine-primary-color-filled)' },
        ]}
        withGradient
        fillOpacity={0.9}
        strokeWidth={1}
        withDots={false}
        withYAxis={false}
        tickLine="none"
        strokeDasharray="0"
        xAxisProps={{ minTickGap: 32 }}
        tooltipAnimationDuration={150}
      />
    </Card>
  );
}

function StatusBadge({ status }: { status: SectionStatus }) {
  return status === 'done' ? (
    <Badge
      variant="outline"
      radius="xl"
      c="dimmed"
      leftSection={<IconCircleCheckFilled size={14} color="var(--mantine-color-green-5)" />}
    >
      完了
    </Badge>
  ) : (
    <Badge variant="outline" radius="xl" c="dimmed" leftSection={<IconLoader size={14} />}>
      作業中
    </Badge>
  );
}

function SectionsTable({ hidden }: { hidden: ColumnKey[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const size = Number(pageSize);
  const totalPages = Math.ceil(SECTIONS.length / size);
  const rows = SECTIONS.slice((page - 1) * size, page * size);
  const pageIds = rows.map((row) => row.id);
  const pageSelected = pageIds.filter((id) => selected.includes(id)).length;
  const shown = (key: ColumnKey) => !hidden.includes(key);

  const toggleRow = (id: number) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  const togglePage = () =>
    setSelected((current) =>
      pageSelected === pageIds.length
        ? current.filter((id) => !pageIds.includes(id))
        : [...new Set([...current, ...pageIds])],
    );

  return (
    <Stack gap="md">
      <Paper withBorder radius="md" className={classes.tableFrame}>
        <Table.ScrollContainer minWidth={920} type="native">
          <Table highlightOnHover>
            <Table.Thead className={classes.thead}>
              <Table.Tr>
                <Table.Th w={44} />
                <Table.Th w={32}>
                  <Checkbox
                    aria-label="このページの行をすべて選ぶ"
                    checked={pageSelected === pageIds.length}
                    indeterminate={pageSelected > 0 && pageSelected < pageIds.length}
                    onChange={togglePage}
                  />
                </Table.Th>
                <Table.Th>見出し</Table.Th>
                {shown('type') && <Table.Th>セクション種別</Table.Th>}
                {shown('status') && <Table.Th>状態</Table.Th>}
                {shown('target') && (
                  <Table.Th w={88} ta="right">
                    目標
                  </Table.Th>
                )}
                {shown('limit') && (
                  <Table.Th w={88} ta="right">
                    上限
                  </Table.Th>
                )}
                {shown('reviewer') && <Table.Th w={200}>担当者</Table.Th>}
                <Table.Th w={52} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row) => (
                <Table.Tr
                  key={row.id}
                  bg={selected.includes(row.id) ? 'var(--mantine-color-default-hover)' : undefined}
                >
                  <Table.Td>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      c="dimmed"
                      size="sm"
                      aria-label="並べ替え"
                    >
                      <IconGripVertical size={12} />
                    </ActionIcon>
                  </Table.Td>
                  <Table.Td>
                    <Checkbox
                      aria-label={`${row.header}を選ぶ`}
                      checked={selected.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </Table.Td>
                  <Table.Td fw={500}>{row.header}</Table.Td>
                  {shown('type') && (
                    <Table.Td>
                      <Badge variant="outline" radius="xl" c="dimmed">
                        {row.type}
                      </Badge>
                    </Table.Td>
                  )}
                  {shown('status') && (
                    <Table.Td>
                      <StatusBadge status={row.status} />
                    </Table.Td>
                  )}
                  {shown('target') && <Table.Td ta="right">{row.target}</Table.Td>}
                  {shown('limit') && <Table.Td ta="right">{row.limit}</Table.Td>}
                  {shown('reviewer') && (
                    <Table.Td>
                      {row.reviewer ?? (
                        <Select
                          size="xs"
                          w={160}
                          placeholder="担当者を選ぶ"
                          data={REVIEWERS}
                          aria-label={`${row.header}の担当者`}
                        />
                      )}
                    </Table.Td>
                  )}
                  <Table.Td>
                    <RowMenu header={row.header} />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
      <Group justify="space-between" px="md">
        <Text fz="sm" c="dimmed" visibleFrom="sm">
          {SECTIONS.length} 行中 {selected.length} 行を選択中
        </Text>
        <Pagination.Root total={totalPages} value={page} onChange={setPage}>
          <Group gap="xl" wrap="nowrap">
            <Group gap="xs" wrap="nowrap" visibleFrom="md">
              <Text fz="sm" fw={500}>
                1 ページの行数
              </Text>
              <Select
                size="sm"
                w={80}
                data={['10', '20', '30', '40', '50']}
                value={pageSize}
                onChange={(value) => {
                  if (!value) return;
                  setPageSize(value);
                  setPage(1);
                }}
                allowDeselect={false}
                aria-label="1 ページの行数"
              />
            </Group>
            <Text fz="sm" fw={500}>
              {totalPages} ページ中 {page} ページ
            </Text>
            <Group gap="xs" wrap="nowrap">
              <Pagination.First visibleFrom="sm" aria-label="最初のページ" />
              <Pagination.Previous aria-label="前のページ" />
              <Pagination.Next aria-label="次のページ" />
              <Pagination.Last visibleFrom="sm" aria-label="最後のページ" />
            </Group>
          </Group>
        </Pagination.Root>
      </Group>
    </Stack>
  );
}

function RowMenu({ header }: { header: string }) {
  return (
    <Menu position="bottom-end" width={160}>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray" c="dimmed" aria-label={`${header}の操作`}>
          <IconDotsVertical size={ICON_SIZE} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>編集</Menu.Item>
        <Menu.Item>複製</Menu.Item>
        <Menu.Item>お気に入りに追加</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red">削除</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function ColumnsMenu({
  hidden,
  onToggle,
}: {
  hidden: ColumnKey[];
  onToggle: (key: ColumnKey) => void;
}) {
  return (
    <Menu position="bottom-end" width={200} closeOnItemClick={false}>
      <Menu.Target>
        <Button
          variant="outline"
          size="sm"
          leftSection={<IconLayoutColumns size={ICON_SIZE} />}
          rightSection={<IconChevronDown size={ICON_SIZE} />}
        >
          表示する列
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {COLUMNS.map((column) => (
          <Menu.Item
            key={column.key}
            leftSection={
              <IconCheck
                size={ICON_SIZE}
                visibility={hidden.includes(column.key) ? 'hidden' : 'visible'}
              />
            }
            onClick={() => onToggle(column.key)}
          >
            {column.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

function DocumentsSection() {
  const [view, setView] = useState('outline');
  const [hidden, setHidden] = useState<ColumnKey[]>([]);
  const toggleColumn = (key: ColumnKey) =>
    setHidden((current) =>
      current.includes(key) ? current.filter((value) => value !== key) : [...current, key],
    );

  return (
    <Tabs value={view} onChange={(value) => value && setView(value)} variant="pills">
      <Group justify="space-between" mb="lg" wrap="nowrap">
        <Select
          hiddenFrom="sm"
          w={128}
          flex="none"
          data={VIEWS.map(({ value, label }) => ({ value, label }))}
          value={view}
          onChange={(value) => value && setView(value)}
          allowDeselect={false}
          aria-label="表示する一覧"
        />
        <Tabs.List visibleFrom="sm">
          {VIEWS.map((item) => (
            <Tabs.Tab
              key={item.value}
              value={item.value}
              rightSection={
                item.count ? (
                  <Badge size="sm" circle variant="default">
                    {item.count}
                  </Badge>
                ) : undefined
              }
            >
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Group gap="xs" wrap="nowrap">
          <ColumnsMenu hidden={hidden} onToggle={toggleColumn} />
          <Button
            variant="outline"
            size="sm"
            leftSection={<IconPlus size={ICON_SIZE} />}
            visibleFrom="sm"
          >
            セクションを追加
          </Button>
          <ActionIcon
            variant="outline"
            size="input-sm"
            hiddenFrom="sm"
            aria-label="セクションを追加"
          >
            <IconPlus size={ICON_SIZE} />
          </ActionIcon>
        </Group>
      </Group>
      <Tabs.Panel value="outline">
        <SectionsTable hidden={hidden} />
      </Tabs.Panel>
      {VIEWS.slice(1).map((item) => (
        <Tabs.Panel key={item.value} value={item.value}>
          <Paper radius="md" h={240} className={classes.emptyPanel} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

function DashboardPage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      className={classes.shell}
      classNames={{ navbar: classes.navbar, main: classes.main }}
      data-sidebar-collapsed={desktopOpened ? undefined : true}
      navbar={{
        width: 288,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      withBorder={false}
    >
      <AppShell.Navbar p="xs">
        <Sidebar onClose={toggleMobile} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Box className={classes.inset}>
          <Group
            component="header"
            h={48}
            px={{ base: 'md', sm: 'lg' }}
            gap="xs"
            wrap="nowrap"
            className={classes.header}
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              hiddenFrom="sm"
              onClick={toggleMobile}
              aria-label="サイドバーを開く"
            >
              <IconLayoutSidebar size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="gray"
              visibleFrom="sm"
              onClick={toggleDesktop}
              aria-label={desktopOpened ? 'サイドバーを閉じる' : 'サイドバーを開く'}
            >
              <IconLayoutSidebar size={ICON_SIZE} />
            </ActionIcon>
            <Divider orientation="vertical" my="md" mx={4} />
            <Text component="h1" fw={500} flex={1}>
              資料
            </Text>
            <Button variant="subtle" color="gray" size="sm" visibleFrom="sm">
              共有
            </Button>
          </Group>
          <Stack gap="lg" p={{ base: 'md', sm: 'lg' }}>
            <SimpleGrid type="container" cols={{ base: 1, '36rem': 2, '64rem': 4 }} spacing="md">
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </SimpleGrid>
            <VisitorsCard />
            <DocumentsSection />
          </Stack>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

export const Dashboard: Story = {
  name: 'ダッシュボード',
  render: () => <DashboardPage />,
};
