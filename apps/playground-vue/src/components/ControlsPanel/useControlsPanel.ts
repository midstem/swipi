// @ts-nocheck
import {
  PlaygroundState,
  PlaygroundStateKey,
  UseControlsPanelProps,
  UseControlsPanelReturn
} from '@swipi/playground-core'

export const useControlsPanel = ({
  update
}: UseControlsPanelProps): UseControlsPanelReturn => {
  const change =
    <Key extends PlaygroundStateKey>(key: Key) =>
    (value: PlaygroundState[Key]): void =>
      update(key, value)

  return {
    change,
    changeStageWidth: (width: number) => () => update('stageWidth', width)
  }
}
