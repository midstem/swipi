import {
  useEffect,
  useRef,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from 'react';
import { reduceSlide } from './constants';
import {
  ReturnSlideWidthType,
  ConfigType,
  NextPrevDotType,
  AnimationsTypes,
} from './types';
import {
  addUniqueId,
  isCornerSlide,
  returnCountSlides,
  returnSlideWidth,
  returnSpaceBetween,
  calculateSlideIndex,
  startAutoplay,
} from './helpers';
import Default from '../DotsAnimations/Default';
import Sliding from '../DotsAnimations/Sliding';

export const useSlider = (
  children: JSX.Element[],
  config: ConfigType[],
  customActiveDot: JSX.Element | undefined,
  customDot: JSX.Element | undefined,
  slidesNumber: number,
  spaceBetweenSlides: number,
  autoplay: boolean,
  autoplaySpeed: number,
  dotsAnimation: string
) => {
  const [animation, setAnimation] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [endX, setEndX] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [movePath, setMovePath] = useState<number>(0);
  const [transform, setTransform] = useState<number>(0);
  const [currentRef, setCurrentRef] = useState<HTMLDivElement | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const slidesWrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const visibleCountSlides = returnCountSlides(
    config,
    windowWidth,
    slidesNumber
  );

  const spaceBetween = returnSpaceBetween(
    config,
    windowWidth,
    spaceBetweenSlides
  );

  const isButton = children.length > visibleCountSlides;

  const returnSlideWidthArgs: ReturnSlideWidthType = useMemo(
    () => ({
      visibleCountSlides,
      spaceBetween,
      current: currentRef,
    }),
    [currentRef, spaceBetween, visibleCountSlides]
  );

  const slideWidth = useMemo(
    () =>
      isCornerSlide(config, windowWidth)
        ? returnSlideWidth(returnSlideWidthArgs) * reduceSlide
        : returnSlideWidth(returnSlideWidthArgs),
    [config, returnSlideWidthArgs, windowWidth]
  );

  const slides = useMemo(
    () =>
      isButton
        ? addUniqueId([...children, ...children, ...children])
        : addUniqueId(children),
    [isButton, children]
  );

  const startTransform = -slideWidth * children.length;

  const ANIMATIONS: AnimationsTypes = {
    default: Default,
    sliding: Sliding,
  };

  const Dots = ANIMATIONS[dotsAnimation];

  const resetCoordinates = (): void => {
    setEndX(0);
    setMovePath(0);
    setStartX(0);
  };

  const checkSliderCorner = (): boolean =>
    transform <= startTransform * 2 + slideWidth / 2 ||
    transform >= -slideWidth / 2;

  const checkAreaWithoutSlides = (): boolean =>
    transform <= startTransform * 2 - slideWidth || transform >= slideWidth / 2;

  const putInTheInitialPosition = (callback?: () => void): (() => void) => {
    setTransform(startTransform);
    setAnimation(false);
    const timer = setTimeout(() => {
      callback?.();
      setAnimation(true);
    }, 1);
    return () => clearTimeout(timer);
  };

  const turnInitialPositionByTouched = (): void => {
    setAnimation(false);
    setTransform(prev => (prev ? prev - startTransform : startTransform));
  };

  const moveSlides = (): void => {
    const pathTaken = endX && startX - endX;
    setTransform(prev => prev - pathTaken + movePath);
    setMovePath(pathTaken);
  };

  const jumpToTheLastSlide = (): void => {
    const lineLengthOfSlides = slideWidth * slides.length;
    const numberOfSlidesBack =
      visibleCountSlides === 1 ? 2 : visibleCountSlides;
    const rightJump = -(lineLengthOfSlides - slideWidth * numberOfSlidesBack);
    setTransform(movePath > 0 ? rightJump : 0);
  };

  const nextDot = (args: NextPrevDotType): void =>
    setSlideIndex(
      calculateSlideIndex(
        args.prev - args.slideWidth,
        args.slideWidth,
        args.children
      )
    );

  const previousDot = (args: NextPrevDotType): void =>
    setSlideIndex(
      calculateSlideIndex(
        args.prev + args.slideWidth,
        args.slideWidth,
        args.children
      )
    );

  const nextImg = (): void => {
    setTransform(prev => {
      nextDot({ prev, slideWidth, children });

      return prev - slideWidth;
    });

    setAnimation(true);
    checkSliderCorner() &&
      putInTheInitialPosition(() =>
        setTransform(prev => {
          nextDot({ prev, slideWidth, children });
          return prev - slideWidth;
        })
      );
  };

  const prevImg = (): void => {
    setTransform(prev => {
      previousDot({ prev, slideWidth, children });
      return prev + slideWidth;
    });

    setAnimation(true);
    checkSliderCorner() &&
      putInTheInitialPosition(() =>
        setTransform(prev => {
          previousDot({ prev, slideWidth, children });
          return prev + slideWidth;
        })
      );
  };

  const onSwipe = (): void => {
    setTransform(prev => Math.round(prev / slideWidth) * slideWidth);
  };

  const startTouchByScreen = (X: number): void => {
    checkSliderCorner() && turnInitialPositionByTouched();
    setStartX(X);
    setMouseDown(true);
  };

  const moveTouchScreen = (X: number): void => {
    if (!mouseDown) return;
    setAnimation(false);
    moveSlides();
    setEndX(X);
    setSlideIndex(calculateSlideIndex(transform, slideWidth, children));
  };

  const endTouchScreen = (): void => {
    setAnimation(true);
    onSwipe();
    checkAreaWithoutSlides() && jumpToTheLastSlide();
    resetCoordinates();
    setMouseDown(false);
  };

  const handleDotClick = (index: number): void => {
    setAnimation(true);
    setTransform(-index * slideWidth);
    setSlideIndex(index);
  };

  const returnCustomDots = (index: number): ReactNode =>
    slideIndex === index ? customActiveDot : customDot;

  const resizeHandler = useCallback((): void => {
    setWindowWidth(window.innerWidth);
    setAnimation(true);
    setSlideIndex(0);
    setTransform(0);
  }, []);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setCurrentRef(slidesWrapperRef.current);
  }, []);

  useEffect(() => {
    if (slideWidth) {
      window.addEventListener('resize', resizeHandler);
    }

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [slideWidth, resizeHandler]);

  useEffect(() => {
    if (!autoplay) return;
    startAutoplay(autoplaySpeed, buttonRef);
  }, [buttonRef, autoplaySpeed, autoplay]);

  return {
    animation,
    slides,
    transform,
    slideWidth,
    slidesWrapperRef,
    isButton,
    spaceBetween,
    slideIndex,
    buttonRef,
    Dots,
    nextImg,
    prevImg,
    setTransform,
    setAnimation,
    handleDotClick,
    endTouchScreen,
    returnCustomDots,
    moveTouchScreen: isButton ? moveTouchScreen : () => {},
    startTouchByScreen: isButton ? startTouchByScreen : () => {},
  };
};
