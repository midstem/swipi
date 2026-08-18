<script lang="ts">
  import { usePlayground } from './usePlayground.svelte'
  import CodeSnippet from './components/CodeSnippet/index.svelte'
  import ControlsPanel from './components/ControlsPanel/index.svelte'
  import EventLog from './components/EventLog/index.svelte'
  import ImperativeApi from './components/ImperativeApi/index.svelte'
  import Stage from './components/Stage/index.svelte'
  import StatePanel from './components/StatePanel/index.svelte'

  const playground = usePlayground()

  const {
    update,
    remount,
    reset,
    clearEvents,
    handleSelect,
    handleChange,
    handleReady
  } = playground
</script>

<div class="pg">
  <header class="pg-header">
    <div>
      <h1
        class="pg-header__title"
        style="display: flex; align-items: center; gap: 8px"
      >
        <svg class="logo" viewBox="0 0 107 128" width="24" height="24">
          <path
            fill="#ff3e00"
            d="M94.1566,22.8189c-10.4-14.8851-30.94-19.2971-45.7914-9.8348L22.2825,29.6078A29.9234,29.9234,0,0,0,8.7639,49.6506a31.5136,31.5136,0,0,0,3.1076,20.2318A30.0061,30.0061,0,0,0,7.3953,81.0653a31.8886,31.8886,0,0,0,5.4473,24.1157c10.4022,14.8865,30.9423,19.2966,45.7914,9.8348L84.7167,98.3921A29.9177,29.9177,0,0,0,98.2353,78.3493,31.5263,31.5263,0,0,0,95.13,58.117a30,30,0,0,0,4.4743-11.1824,31.88,31.88,0,0,0-5.4473-24.1157"
          />
          <path
            fill="#ffffff"
            d="M45.8171,106.5815A20.7182,20.7182,0,0,1,23.58,98.3389a19.1739,19.1739,0,0,1-3.2766-14.5025,18.1886,18.1886,0,0,1,.6233-2.4357l.4912-1.4978,1.3363.9815a33.6443,33.6443,0,0,0,10.203,5.0978l.9694.2941-.0893.9675a5.8474,5.8474,0,0,0,1.052,3.8781,6.2389,6.2389,0,0,0,6.6952,2.485,5.7449,5.7449,0,0,0,1.6021-.7041L69.27,76.281a5.4306,5.4306,0,0,0,2.4506-3.631,5.7948,5.7948,0,0,0-.9875-4.3712,6.2436,6.2436,0,0,0-6.6978-2.4864,5.7427,5.7427,0,0,0-1.6.7036l-9.9532,6.3449a19.0329,19.0329,0,0,1-5.2965,2.3259,20.7181,20.7181,0,0,1-22.2368-8.2427,19.1725,19.1725,0,0,1-3.2766-14.5024,17.9885,17.9885,0,0,1,8.13-12.0513L55.8833,23.7472a19.0038,19.0038,0,0,1,5.3-2.3287A20.7182,20.7182,0,0,1,83.42,29.6611a19.1739,19.1739,0,0,1,3.2766,14.5025,18.4,18.4,0,0,1-.6233,2.4357l-.4912,1.4978-1.3356-.98a33.6175,33.6175,0,0,0-10.2037-5.1l-.9694-.2942.0893-.9675a5.8588,5.8588,0,0,0-1.052-3.878,6.2389,6.2389,0,0,0-6.6952-2.485,5.7449,5.7449,0,0,0-1.6021.7041L37.73,51.719a5.4218,5.4218,0,0,0-2.4487,3.63,5.7862,5.7862,0,0,0,.9856,4.3717,6.2437,6.2437,0,0,0,6.6978,2.4864,5.7652,5.7652,0,0,0,1.602-.7041l9.9519-6.3425a18.978,18.978,0,0,1,5.2959-2.3278,20.7181,20.7181,0,0,1,22.2368,8.2427,19.1725,19.1725,0,0,1,3.2766,14.5024,17.9977,17.9977,0,0,1-8.13,12.0532L51.1167,104.2528a19.0038,19.0038,0,0,1-5.3,2.3287"
          />
        </svg>
        Swipi playground
      </h1>
      <p class="pg-hint">
        Every option of the hook is editable here, next to the layout the
        playground draws around it — the settings are kept in
        <code>localStorage</code> between reloads.
      </p>
    </div>
    <div class="pg-header__actions">
      <button type="button" class="pg-button" onclick={remount}>Remount</button>
      <button type="button" class="pg-button" onclick={reset}>
        Reset props
      </button>
    </div>
  </header>

  <div class="pg-layout">
    <ControlsPanel state={playground.state} {update} />

    <main class="pg-stage">
      {#key playground.remountKey}
        <Stage
          state={playground.state}
          slides={playground.slides}
          onSelect={handleSelect}
          onChange={handleChange}
          onReady={handleReady}
        />
      {/key}
      <ImperativeApi
        carousel={playground.carousel}
        slidesCount={playground.state.slidesCount}
      />
      <StatePanel
        swipiState={playground.swipiState}
        positions={playground.positions}
      />
      <EventLog events={playground.events} onClear={clearEvents} />
      <CodeSnippet state={playground.state} />
    </main>
  </div>
</div>
