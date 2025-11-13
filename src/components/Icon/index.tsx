import type { ForwardedRef, ImgHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import style from './style.module.css'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
	width?: number
	height?: number
}

export const Icon = forwardRef(
	(
		{ width, height, ...rest }: Props,
		ref: ForwardedRef<HTMLImageElement>
	) => {
		return (
			<img
				{...rest}
				draggable={false}
				ref={ref}
				alt={rest.alt || 'Icon'}
				style={{
					width: (width ?? height ?? 8) * 2,
					height: (height ?? width ?? 8) * 2,
					...rest.style
				}}
				className={`${rest.className} ${style.icon}`}
			/>
		)
	}
)

Icon.displayName = 'Icon'
