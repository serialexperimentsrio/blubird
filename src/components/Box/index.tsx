import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import style from './style.module.css'

type BoxProps = {
	image?: string
	icon?: string
	shadowless?: boolean
} & HTMLAttributes<HTMLDivElement>

export const Box = forwardRef(
	(
		{ image, icon, shadowless, className, children, ...rest }: BoxProps,
		ref: ForwardedRef<HTMLDivElement>
	) => {
		return (
			<div
				{...rest}
				ref={ref}
				className={`${style.box} ${shadowless ? '' : 'shadow'} ${className || ''}`}
			>
				{image && (
					<img src={image} className={`boxbg ${style.bg}`} alt="Background decoration" />
				)}
				{icon && (
					<img
						src={icon}
						className={`boxiconbg ${style.iconbg}`}
						alt="Icon background decoration"
					/>
				)}
				{children}
			</div>
		)
	}
)

Box.displayName = 'Box'
