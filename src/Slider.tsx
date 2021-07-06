import React, { useEffect } from "react"
import { StyleSheet, View, StatusBar } from "react-native"
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated"
import { PanGestureHandler } from "react-native-gesture-handler"
import { useVector } from "react-native-redash"

import Wave, { HEIGHT, MARGIN_WIDTH, Side, WIDTH } from "./Wave"
import Button from "./Button"

const PREV = WIDTH
const NEXT = 0

interface SliderProps {
	index: number
	setIndex: (value: number) => void
	children: JSX.Element
	prev?: JSX.Element
	next?: JSX.Element
}

function Slider({
	index,
	children: current,
	prev,
	next,
	setIndex,
}: SliderProps): JSX.Element {
	const hasPrev = !!prev
	const hasNext = !!next

	const activeSide = useSharedValue(Side.NONE)
	const left = useVector()
	const right = useVector()

	const leftStyle = useAnimatedStyle(() => ({
		zIndex: activeSide.value === Side.LEFT ? 100 : 0,
	}))

	useEffect(() => {
		left.x.value = withSpring(MARGIN_WIDTH)
		right.x.value = withSpring(MARGIN_WIDTH)
	}, [left.x, right.x])

	// prettier-ignore
	const onGestureEvent = useAnimatedGestureHandler({
		onStart: ({ x }) => {
			if (x < MARGIN_WIDTH)
				activeSide.value = Side.LEFT
			else if (x > WIDTH - MARGIN_WIDTH)
				activeSide.value = Side.RIGHT
			else
				activeSide.value = Side.NONE
		},
		onActive: ({ x, y }) => {
			if (activeSide.value === Side.LEFT) {
				left.x.value = x
				left.y.value = y
			} else if (activeSide.value === Side.RIGHT) {
				right.x.value = WIDTH - x
				right.y.value = y
			}
		}
	})

	return (
		<PanGestureHandler onGestureEvent={onGestureEvent}>
			<Animated.View style={StyleSheet.absoluteFill}>
				<StatusBar translucent backgroundColor="transparent" />

				{current}

				{prev && (
					<Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
						<Wave side={Side.LEFT} position={left}>
							{prev}
						</Wave>
					</Animated.View>
				)}
				{next && (
					<View style={StyleSheet.absoluteFill}>
						<Wave side={Side.RIGHT} position={right}>
							{next}
						</Wave>
					</View>
				)}
			</Animated.View>
		</PanGestureHandler>
	)
}

export default Slider
