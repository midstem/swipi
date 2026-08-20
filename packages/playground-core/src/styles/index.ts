const INPUT_BASE =
  'rounded-md border border-pg-border bg-black px-2 py-1.5 text-sm text-white placeholder:text-pg-faint focus-visible:border-pg-accent focus-visible:outline-none disabled:opacity-50'

const BUTTON_BASE =
  'cursor-pointer rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const SEGMENT_BASE =
  'cursor-pointer rounded px-2.5 py-1 text-xs font-semibold transition-colors'

export const STYLES = {
  page: 'mx-auto w-full max-w-[1400px] px-5 pt-6 pb-16',
  header: 'mb-5 flex flex-wrap items-start justify-between gap-3 embed:hidden',
  headerTitle: 'mb-1 flex items-center gap-2 text-3xl font-bold text-white',
  headerActions: 'flex flex-wrap items-center gap-2',
  layout: 'grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]',
  controls:
    'order-1 flex flex-col gap-2.5 lg:sticky lg:top-4 lg:order-none lg:max-h-[calc(100vh-32px)] lg:overflow-y-auto lg:pr-1',
  stage: 'flex min-w-0 flex-col gap-4',

  section:
    'group rounded-lg border border-pg-border bg-pg-surface data-[origin=hook]:border-l-[3px] data-[origin=hook]:border-l-pg-accent',
  sectionTitle:
    'flex cursor-pointer items-center justify-between gap-2 px-3.5 py-3 font-semibold text-white select-none',
  sectionBadge:
    'rounded-full border border-pg-border px-2 py-0.5 text-xs font-medium tracking-[0.02em] text-pg-muted group-data-[origin=hook]:border-pg-accent group-data-[origin=hook]:text-pg-accent',
  sectionBody: 'flex flex-col gap-3.5 px-3.5 pb-3.5',

  card: 'rounded-lg border border-pg-border bg-pg-surface p-4',
  cardSplit:
    'grid gap-4 rounded-lg border border-pg-border bg-pg-surface p-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]',
  cardHeader:
    'mb-2.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2',
  cardTitle: 'text-sm tracking-[0.04em] text-pg-muted uppercase',

  field: 'flex flex-col gap-1.5 data-[disabled=true]:opacity-50',
  fieldRow: 'flex items-center gap-2',
  label: 'text-sm font-semibold text-white',
  hint: 'text-xs leading-snug text-pg-muted',
  input: `${INPUT_BASE} w-full`,
  numberInput: `${INPUT_BASE} w-[72px] flex-none`,
  select: `${INPUT_BASE} w-full cursor-pointer`,
  range: 'h-1.5 min-w-0 flex-1 cursor-pointer accent-pg-accent',
  checkbox: 'mt-0.5 size-4 flex-none cursor-pointer accent-pg-accent',
  toggle: 'flex cursor-pointer items-start gap-2',
  toggleInline: 'flex cursor-pointer items-center gap-2',
  toggleText: 'flex flex-col gap-0.5',

  button: `${BUTTON_BASE} border-pg-accent-strong bg-pg-accent-strong text-white hover:not-disabled:border-pg-accent hover:not-disabled:bg-pg-accent`,
  ghostButton: `${BUTTON_BASE} border-pg-border bg-transparent text-pg-subtle hover:not-disabled:border-pg-faint hover:not-disabled:bg-white/10 hover:not-disabled:text-white`,

  config: 'flex flex-col gap-2.5 data-[disabled=true]:opacity-50',
  configItem:
    'flex flex-col gap-2 rounded-lg border border-dashed border-pg-border p-2.5',
  configGrid: 'grid grid-cols-3 gap-2',
  configCell: 'flex min-w-0 flex-col gap-1',
  configInput: `${INPUT_BASE} w-full`,
  configFooter: 'flex items-center justify-between gap-2',

  row: 'flex flex-wrap items-center gap-2',
  rowGroup: 'flex items-center gap-1',
  toolbarGroup: 'flex items-center gap-2',
  toolbarLabel:
    'text-xs font-semibold tracking-[0.06em] text-pg-muted uppercase',
  toolbarDivider: 'w-px self-stretch bg-pg-border',
  segmented:
    'flex items-center gap-1 rounded-md border border-pg-border bg-black p-0.5',
  segment: `${SEGMENT_BASE} bg-transparent text-pg-muted hover:text-white`,
  segmentActive: `${SEGMENT_BASE} bg-pg-accent-strong text-white`,

  code: 'overflow-x-auto rounded-md bg-black p-3 text-xs leading-relaxed text-pg-subtle',
  events: 'flex max-h-[200px] flex-col gap-1.5 overflow-y-auto',
  event: 'flex items-baseline gap-2 text-xs text-pg-subtle',
  eventName: 'w-[72px] flex-none font-semibold text-pg-accent',

  slider: 'mx-auto mb-4 max-w-full resize-x overflow-hidden',
  carousel: 'relative flex flex-col items-center gap-5',
  carouselRow:
    'flex w-full items-center gap-3 data-[axis=y]:flex-col data-[axis=y]:gap-1',
  viewport:
    'w-full overflow-hidden [touch-action:pan-y] data-[axis=y]:[touch-action:pan-x]',
  track:
    'ml-[calc(-1*var(--swipi-slide-gap,0px))] flex cursor-grab select-none active:cursor-grabbing data-[axis=y]:ml-0 data-[axis=y]:mt-[calc(-1*var(--swipi-slide-gap,0px))] data-[axis=y]:h-full data-[axis=y]:flex-col',
  slide:
    'flex h-[250px] min-w-0 flex-[0_0_var(--pg-basis)] pl-[var(--swipi-slide-gap,0px)] data-[axis=y]:h-auto data-[axis=y]:min-h-0 data-[axis=y]:pt-[var(--swipi-slide-gap,0px)] data-[axis=y]:pl-0',
  slideBox:
    'flex size-full items-center justify-center rounded-md text-5xl font-bold text-white select-none',
  arrow:
    'z-1 cursor-pointer bg-transparent text-3xl text-white disabled:cursor-default disabled:opacity-35',
  dots: 'flex h-3.5 items-center gap-2.5',
  dot: 'inline-flex size-3.5 cursor-pointer items-center justify-center bg-transparent p-0 leading-none',
  dotMark:
    'aspect-square w-3 flex-none rounded-full bg-pg-muted data-[active=true]:w-3.5 data-[active=true]:bg-pg-accent',

  facts: 'flex flex-wrap gap-4 text-xs text-pg-muted',
  warning:
    'mt-3 rounded-md bg-pg-accent-soft px-2.5 py-2 text-xs text-pg-accent',
  visuallyHidden: 'sr-only'
}
