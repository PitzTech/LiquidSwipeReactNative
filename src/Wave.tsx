import React, { ReactNode } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import Animated, {
	Extrapolate,
	interpolate,
	useAnimatedProps,
	useDerivedValue,
	withSpring,
} from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"
import MaskedView from "@react-native-community/masked-view"
import { Vector } from "react-native-redash"

export const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen")
export const MIN_LEDGE = 25
export const MARGIN_WIDTH = MIN_LEDGE + 50

// 0.5522847498 is taken from https://spencermortensen.com/articles/bezier-circle/
const C = 0.5522847498

const AnimatedPath = Animated.createAnimatedComponent(Path)

const vec2 = (x: number, y: number): { x: number; y: number } => {
	"worklet"
	return { x, y }
}
const curve = (c1: Vector, c2: Vector, to: Vector): string => {
	"worklet"
	return `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y}`
}

export enum Side {
	LEFT,
	RIGHT,
	NONE,
}

interface WaveProps {
	side: Side
	children: ReactNode
	position: Vector<Animated.SharedValue<number>>
}

function Wave({ side, children, position }: WaveProps): JSX.Element {
	const animatedProps = useAnimatedProps(() => {
		const d = [`M 0 0`, `H ${position.x.value}`, `V ${HEIGHT}`, `H 0`, `Z`]

		return {
			d: d.join(" "),
		}
	})

	return (
		<MaskedView
			style={StyleSheet.absoluteFill}
			maskElement={
				<Svg
					style={
						(StyleSheet.absoluteFill,
						{
							transform: [
								{ rotateY: side === Side.RIGHT ? "180deg" : "0deg" },
							],
						})
					}
				>
					<AnimatedPath animatedProps={animatedProps} fill="black" />
				</Svg>
			}
		>
			{children}
		</MaskedView>
	)
}

export default Wave
