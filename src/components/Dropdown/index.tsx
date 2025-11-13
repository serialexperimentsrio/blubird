import { Loading } from '../Loading'
import { useState } from 'react'
import WithPopover from '../Popover'
import style from './style.module.css'

interface DropdownItem {
	key: string
	label: string
	onPick: () => unknown
}

function DropdownContent({
	items,
	close
}: {
	items: DropdownItem[]
	close: () => void
}) {
	const [loadingIndex, setLoadingIndex] = useState<undefined | number>(
		undefined
	)

	return (
		<div className={style.dropdown}>
			{items.map((item, index) => (
				<div
					key={item.key}
					style={{
						pointerEvents: loadingIndex != null ? 'none' : undefined
					}}
					onClick={async () => {
						setLoadingIndex(index)
						try {
							await item.onPick()
							close()
						} finally {
							setLoadingIndex(undefined)
						}
					}}
				>
					<span
						style={{
							opacity:
								(loadingIndex != null &&
									(loadingIndex === index ? 0.3 : 0.7)) ||
								1
						}}
					>
						{item.label}
					</span>
					{loadingIndex === index && <Loading />}
				</div>
			))}
		</div>
	)
}

export default function WithDropdown({
	children,
	items,
	above
}: {
	children: React.ReactElement
	items: DropdownItem[]
	above?: boolean
}) {
	return (
		<WithPopover
			above={above}
			content={(closePopover) => (
				<>
					<DropdownContent items={items} close={closePopover} />
				</>
			)}
		>
			{children}
		</WithPopover>
	)
}
