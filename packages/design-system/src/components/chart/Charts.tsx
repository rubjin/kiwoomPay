import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { chartColor } from './chartColors';
import { useResolvedColors } from './useResolvedColors';
import styles from './Charts.module.scss';

// Figma KWPC01010000 당월 거래금액 추이(29946:98292) · 결제수단별 거래비중(29961:98293)
const BAR_SIZE = 15;
const BAR_GAP = 4;
const BAR_RADIUS: [number, number, number, number] = [2, 2, 0, 0];
const LINE_WIDTH = 2;
const DOT_RADIUS = 2.5;
const AXIS_WIDTH = 52; // 단위 글자(금액(억원))가 들어가는 폭
const DONUT_SIZE = 164;
const DONUT_THICKNESS = 26;

export interface ChartSeries {
  /** data의 값 키 */
  key: string;
  /** 범례 · 툴팁 이름 */
  name: string;
  /** 색 (기본: 순서대로 Chart Category) */
  color?: string;
}

export interface ChartAxis {
  /** 0 자리에 대신 쓰는 단위 (예: 금액(억원)) */
  unit?: string;
  /** 눈금 값 — 마지막 값이 축 최대 */
  ticks: number[];
}

// 행 객체 (xKey · 계열 key 값을 가진다)
type Datum = object;

// ── 범례 ──
function Legend({ items }: { items: { name: string; color: string; line?: boolean }[] }) {
  return (
    <ul className={styles.legend}>
      {items.map((item) => (
        <li key={item.name} className={styles.legendItem}>
          <span
            className={clsx(styles.swatch, item.line && styles.swatchLine)}
            style={{ color: item.color }}
          />
          {item.name}
        </li>
      ))}
    </ul>
  );
}

// ── 툴팁 (Chart Tooltip 토큰) ──
interface TipEntry {
  name?: string | number;
  value?: string | number | (string | number)[];
  color?: string;
  dataKey?: string | number | ((obj: unknown) => unknown);
}

function ChartTip({
  active,
  label,
  payload,
  format,
}: {
  active?: boolean;
  label?: ReactNode;
  payload?: readonly TipEntry[];
  format?: (key: string, value: number) => ReactNode;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      {label !== undefined && <div className={styles.tooltipTitle}>{label}</div>}
      {payload.map((entry) => {
        const key = String(entry.dataKey ?? entry.name);
        const value = Number(entry.value);
        return (
          <div key={key} className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ color: entry.color }} />
            <span>{entry.name}</span>
            <span className={styles.tooltipValue}>
              {format ? format(key, value) : value.toLocaleString('ko-KR')}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── ComboChart: 막대(왼쪽 축) + 선(오른쪽 축) ─────────────────
export interface ComboChartProps extends HTMLAttributes<HTMLDivElement> {
  data: Datum[];
  /** X축 값 키 (예: date) */
  xKey: string;
  /** 막대 계열 (왼쪽 축) */
  bars: ChartSeries[];
  /** 선 계열 (오른쪽 축) */
  line?: ChartSeries;
  leftAxis: ChartAxis;
  rightAxis?: ChartAxis;
  /** 툴팁 값 글자 (기본 천 단위 쉼표) */
  formatValue?: (key: string, value: number) => ReactNode;
  /** 그래프 높이 (기본 150 — 범례 제외) */
  height?: number;
}

/** 막대 + 선 혼합 차트 (Recharts). 범례는 위 가운데, 마우스를 올리면 툴팁 */
export function ComboChart({
  data,
  xKey,
  bars,
  line,
  leftAxis,
  rightAxis,
  formatValue,
  height = 150,
  className,
  ...rest
}: ComboChartProps) {
  const series = line ? [...bars, line] : bars;
  const colors = useResolvedColors(
    series.map((s, i) => s.color ?? chartColor(i === bars.length ? 2 : i)),
  );
  const grid = useResolvedColors([
    'var(--kp-color-chart-line)',
    'var(--kp-color-base-white)',
    'var(--kp-color-chart-text)',
  ]);
  const tick = { fill: grid[2] };
  const tickLabel = (unit?: string) => (value: number) =>
    value === 0 && unit ? unit : value.toLocaleString('ko-KR');

  return (
    <div {...rest} className={clsx(styles.chart, className)}>
      <Legend
        items={series.map((s, i) => ({
          name: s.name,
          color: colors[i] ?? '',
          line: line !== undefined && i === bars.length,
        }))}
      />
      <div className={styles.plot} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            barGap={BAR_GAP}
            margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke={grid[0]} />
            <XAxis dataKey={xKey} axisLine={false} tickLine={false} interval={0} tick={tick} />
            <YAxis
              yAxisId="left"
              width={AXIS_WIDTH}
              domain={[0, leftAxis.ticks[leftAxis.ticks.length - 1] ?? 'auto']}
              ticks={leftAxis.ticks}
              tickFormatter={tickLabel(leftAxis.unit)}
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={tick}
            />
            {line && rightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                width={AXIS_WIDTH}
                domain={[0, rightAxis.ticks[rightAxis.ticks.length - 1] ?? 'auto']}
                ticks={rightAxis.ticks}
                tickFormatter={tickLabel(rightAxis.unit)}
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={tick}
              />
            )}
            <Tooltip
              cursor={{ fill: grid[0], fillOpacity: 0.5 }}
              content={(props) => (
                <ChartTip
                  active={props.active}
                  label={props.label as ReactNode}
                  payload={props.payload as readonly TipEntry[] | undefined}
                  format={formatValue}
                />
              )}
            />
            {bars.map((bar, i) => (
              <Bar
                key={bar.key}
                yAxisId="left"
                dataKey={bar.key}
                name={bar.name}
                fill={colors[i]}
                barSize={BAR_SIZE}
                radius={BAR_RADIUS}
                isAnimationActive={false}
              />
            ))}
            {line && (
              <Line
                yAxisId={rightAxis ? 'right' : 'left'}
                dataKey={line.key}
                name={line.name}
                stroke={colors[bars.length]}
                strokeWidth={LINE_WIDTH}
                dot={{
                  r: DOT_RADIUS,
                  fill: grid[1],
                  stroke: colors[bars.length],
                  strokeWidth: LINE_WIDTH,
                }}
                activeDot={{ r: DOT_RADIUS + 1 }}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── DonutChart: 비중 도넛 + 가운데 합계 + 오른쪽 범례 ─────────
export interface DonutChartItem {
  name: string;
  /** 비중 (%) */
  value: number;
  color?: string;
}

export interface DonutChartProps extends HTMLAttributes<HTMLDivElement> {
  items: DonutChartItem[];
  /** 가운데 위 작은 글자 (예: 총 거래금액) */
  centerLabel?: ReactNode;
  /** 가운데 값 (예: ₩4,286,950,120) */
  centerValue?: ReactNode;
  /** 비중 표시 (기본 52.3%) */
  formatValue?: (value: number) => ReactNode;
}

/** 비중 도넛 (Recharts) — 12시 방향부터 시계 방향, 범례에 계열 색 · 이름 · 비중 */
export function DonutChart({
  items,
  centerLabel,
  centerValue,
  formatValue = (value) => `${value}%`,
  className,
  ...rest
}: DonutChartProps) {
  const colors = useResolvedColors(items.map((item, i) => item.color ?? chartColor(i)));
  const [white] = useResolvedColors(['var(--kp-color-base-white)']);
  return (
    <div {...rest} className={clsx(styles.donutWrap, className)}>
      <div className={styles.donut} style={{ width: DONUT_SIZE, height: DONUT_SIZE }}>
        <PieChart width={DONUT_SIZE} height={DONUT_SIZE}>
          <Pie
            data={items}
            dataKey="value"
            nameKey="name"
            startAngle={90}
            endAngle={-270}
            innerRadius={DONUT_SIZE / 2 - DONUT_THICKNESS}
            outerRadius={DONUT_SIZE / 2}
            stroke={white}
            strokeWidth={1}
            isAnimationActive={false}
          >
            {items.map((item, i) => (
              <Cell key={item.name} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip
            content={(props) => (
              <ChartTip
                active={props.active}
                payload={(props.payload as readonly TipEntry[] | undefined)?.map((p, i) => ({
                  ...p,
                  color: colors[items.findIndex((it) => it.name === p.name)] ?? colors[i],
                }))}
                format={(_, value) => formatValue(value)}
              />
            )}
          />
        </PieChart>
        {(centerLabel || centerValue) && (
          <div className={styles.donutCenter}>
            {centerLabel && <span className={styles.donutCenterLabel}>{centerLabel}</span>}
            {centerValue && <span className={styles.donutCenterValue}>{centerValue}</span>}
          </div>
        )}
      </div>
      <ul className={styles.donutLegend}>
        {items.map((item, i) => (
          <li key={item.name} className={styles.donutLegendRow}>
            <span className={styles.donutLegendName}>
              <span className={styles.dot} style={{ color: colors[i] }} />
              {item.name}
            </span>
            <span className={styles.donutLegendValue}>{formatValue(item.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
