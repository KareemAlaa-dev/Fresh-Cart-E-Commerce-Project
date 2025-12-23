declare module "react-slick" {
  import { Component, ReactNode } from "react";

  export interface Settings {
    accessibility?: boolean;
    adaptiveHeight?: boolean;
    afterChange?(currentSlide: number): void;
    appendDots?(dots: ReactNode): ReactNode;
    arrows?: boolean;
    asNavFor?: Slider;
    autoplaySpeed?: number;
    autoplay?: boolean;
    beforeChange?(currentSlide: number, nextSlide: number): void;
    centerMode?: boolean;
    centerPadding?: string;
    className?: string;
    cssEase?: string;
    customPaging?(index: number): ReactNode;
    dotsClass?: string;
    dots?: boolean;
    draggable?: boolean;
    easing?: string;
    edgeFriction?: number;
    fade?: boolean;
    focusOnSelect?: boolean;
    infinite?: boolean;
    initialSlide?: number;
    lazyLoad?: "ondemand" | "progressive";
    nextArrow?: ReactNode;
    onEdge?(swipeDirection: string): void;
    onInit?(): void;
    onLazyLoad?(slidesToLoad: number[]): void;
    onReInit?(): void;
    onSwipe?(swipeDirection: string): void;
    pauseOnDotsHover?: boolean;
    pauseOnFocus?: boolean;
    pauseOnHover?: boolean;
    prevArrow?: ReactNode;
    responsive?: ResponsiveObject[];
    rows?: number;
    rtl?: boolean;
    slidesPerRow?: number;
    slidesToScroll?: number;
    slidesToShow?: number;
    speed?: number;
    swipeToSlide?: boolean;
    swipe?: boolean;
    swipeEvent?(swipeDirection: string): void;
    touchMove?: boolean;
    touchThreshold?: number;
    useCSS?: boolean;
    useTransform?: boolean;
    variableWidth?: boolean;
    vertical?: boolean;
    verticalSwiping?: boolean;
    waitForAnimate?: boolean;
    zIndex?: number;
    children?: ReactNode;
  }

  export interface ResponsiveObject {
    breakpoint: number;
    settings: "unslick" | Settings;
  }

  export default class Slider extends Component<Settings, any> {
    slickNext(): void;
    slickPrev(): void;
    slickGoTo(slide: number, dontAnimate?: boolean): void;
    slickPause(): void;
    slickPlay(): void;
  }
}
