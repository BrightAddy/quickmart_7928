import React from 'react';
import { View, StyleSheet, Animated, Easing, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  children: React.ReactNode;
  radius?: number;
  glowColor?: string;
  thickness?: number;
  durationMs?: number;
  style?: any;
};

// A subtle animated glowing line that travels clockwise around a rounded card
export default function GlowingBorderCard({
  children,
  radius = 16,
  glowColor = '#1CA77C',
  thickness = 2,
  durationMs = 6000,
  style,
}: Props) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const progress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: durationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [durationMs]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  // Compute animated segment position around the perimeter
  const perimeter = 2 * (size.width + size.height);

  return (
    <View onLayout={onLayout} style={[{ borderRadius: radius }, style]}>
      <View style={[styles.card, { borderRadius: radius }]}>{children}</View>
      {/* Glowing segments overlay */}
      {size.width > 0 && size.height > 0 && perimeter > 0 && (
        <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { borderRadius: radius }]}> 
          {/* TOP */}
          <Animated.View style={{ opacity: progress.interpolate({ inputRange: [0, size.width / perimeter, (size.width + size.height) / perimeter, 1], outputRange: [1, 1, 0, 0], extrapolate: 'clamp' }) }}>
            <LinearGradient
              colors={[`${glowColor}00`, `${glowColor}66`, `${glowColor}00`]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: size.width,
                height: thickness,
              }}
            />
          </Animated.View>
          {/* RIGHT */}
          <Animated.View style={{ opacity: progress.interpolate({ inputRange: [size.width / perimeter, (size.width + size.height) / perimeter, (2 * size.width + size.height) / perimeter, 1], outputRange: [0, 1, 1, 0], extrapolate: 'clamp' }) }}>
            <LinearGradient
              colors={[`${glowColor}00`, `${glowColor}66`, `${glowColor}00`]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: thickness,
                height: size.height,
              }}
            />
          </Animated.View>
          {/* BOTTOM */}
          <Animated.View style={{ opacity: progress.interpolate({ inputRange: [(size.width + size.height) / perimeter, (2 * size.width + size.height) / perimeter, 1], outputRange: [0, 1, 1], extrapolate: 'clamp' }) }}>
            <LinearGradient
              colors={[`${glowColor}00`, `${glowColor}66`, `${glowColor}00`]}
              start={{ x: 1, y: 0.5 }}
              end={{ x: 0, y: 0.5 }}
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: size.width,
                height: thickness,
              }}
            />
          </Animated.View>
          {/* LEFT */}
          <Animated.View style={{ opacity: progress.interpolate({ inputRange: [0, (2 * size.width + size.height) / perimeter, 1], outputRange: [0, 0, 1], extrapolate: 'clamp' }) }}>
            <LinearGradient
              colors={[`${glowColor}00`, `${glowColor}66`, `${glowColor}00`]}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: thickness,
                height: size.height,
              }}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
  },
});


