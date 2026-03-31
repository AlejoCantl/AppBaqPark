import React from 'react';
import { View } from 'react-native';

// Safe child filter: only render valid React elements, never raw text nodes
const safeChildren = (children) =>
  React.Children.map(children, (child) =>
    React.isValidElement(child) ? child : null
  );

const MapView = ({ style, children, ...props }) => (
  <View style={style}>{safeChildren(children)}</View>
);

MapView.Marker = ({ children }) => (
  <View>{safeChildren(children)}</View>
);
MapView.Polygon = () => null;
MapView.Polyline = () => null;
MapView.Callout = ({ children }) => (
  <View>{safeChildren(children)}</View>
);
MapView.Circle = () => null;
MapView.PROVIDER_GOOGLE = 'google';
MapView.PROVIDER_DEFAULT = 'default';

export default MapView;
export const Marker = MapView.Marker;
export const Polygon = MapView.Polygon;
export const Polyline = MapView.Polyline;
export const Callout = MapView.Callout;
export const Circle = MapView.Circle;
export const PROVIDER_GOOGLE = MapView.PROVIDER_GOOGLE;
export const PROVIDER_DEFAULT = MapView.PROVIDER_DEFAULT;
