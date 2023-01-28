import React from 'react';
import { SIZES } from '../constants';
import { Spacing } from '../types';

type Stiles = {
  display?: string;
  sx?: object;
  m?: Spacing;
  ml?: Spacing;
  mr?: Spacing;
  mt?: Spacing;
  mb?: Spacing;
  p?: Spacing;
  pl?: Spacing;
  pr?: Spacing;
  pt?: Spacing;
  pb?: Spacing;
  tag?: any;
};

const setStyles = (props: Stiles) => ({
  display: props.display,
  margin: `${props.m ? SIZES[props.m] : 'auto'}rem`,
  marginLeft: `${props.ml ? SIZES[props.ml] : 'auto'}rem`,
  marginRight: `${props.mr ? SIZES[props.mr] : 'auto'}rem`,
  marginTop: `${props.mt ? SIZES[props.mt] : 'auto'}rem`,
  marginBottom: `${props.mb ? SIZES[props.mb] : 'auto'}rem`,
  padding: `${props.p ? SIZES[props.p] : 'auto'}rem`,
  paddingLeft: `${props.pl ? SIZES[props.pl] : 'auto'}rem`,
  paddingRight: `${props.pr ? SIZES[props.pr] : 'auto'}rem`,
  paddingTop: `${props.pt ? SIZES[props.pt] : 'auto'}rem`,
  paddingBottom: `${props.pb ? SIZES[props.pb] : 'auto'}rem`,
  ...props.sx,
});

type BoxProps = {
  children?: any;
} & Stiles;

export const Box = ({
  display = 'block',
  sx = {},
  m = 0,
  ml = 0,
  mr = 0,
  mt = 0,
  mb = 0,
  p = 0,
  pl = 0,
  pr = 0,
  pt = 0,
  pb = 0,
  tag: Tag = 'div',
  children,
}: BoxProps) => (
  <Tag style={setStyles({ sx, display, m, ml, mr, mt, mb, p, pl, pr, pt, pb })}>
    {children}
  </Tag>
);
