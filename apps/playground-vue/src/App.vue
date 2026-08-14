<template>
  <div class="pg">
    <header class="pg-header">
      <div>
        <h1
          class="pg-header__title"
          style="display: flex; align-items: center; gap: 8px"
        >
          <svg class="logo" viewBox="0 0 128 128" width="24" height="24">
            <path
              fill="#42b883"
              d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z"
            />
            <path
              fill="#35495e"
              d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z"
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
        <button type="button" class="pg-button" @click="remount">
          Remount
        </button>
        <button type="button" class="pg-button" @click="reset">
          Reset props
        </button>
      </div>
    </header>

    <div class="pg-layout">
      <ControlsPanel :state="state" :update="update" />

      <main class="pg-stage">
        <Stage
          :key="remountKey"
          :state="state"
          :slides="slides"
          @select="handleSelect"
          @change="handleChange"
          @ready="handleReady"
        />
        <ImperativeApi :carousel="swipiRef" :slides-count="state.slidesCount" />
        <StatePanel :swipi-state="swipiState" :positions="positions" />
        <EventLog :events="events" @clear="clearEvents" />
        <CodeSnippet :state="state" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayground } from './usePlayground'
import CodeSnippet from './components/CodeSnippet/index.vue'
import ControlsPanel from './components/ControlsPanel/index.vue'
import EventLog from './components/EventLog/index.vue'
import ImperativeApi from './components/ImperativeApi/index.vue'
import Stage from './components/Stage/index.vue'
import StatePanel from './components/StatePanel/index.vue'

const {
  state,
  slides,
  events,
  swipiRef,
  swipiState,
  positions,
  remountKey,
  update,
  remount,
  reset,
  clearEvents,
  handleSelect,
  handleChange,
  handleReady
} = usePlayground()
</script>
