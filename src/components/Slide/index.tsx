import { SlideWrapper, ChildNumber } from './styles'

const Slide = ({ child }: { child: string }): JSX.Element => (
  <SlideWrapper>
    <ChildNumber>{child}</ChildNumber>
  </SlideWrapper>
)

export default Slide
