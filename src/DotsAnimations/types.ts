import { FunctionComponent } from 'react'
import { DotsAnimation } from '../Swipi/types'
import { DotsTypes } from '../types'

export type AnimationsTypes = {
  [key in DotsAnimation]: FunctionComponent<DotsTypes>
}
