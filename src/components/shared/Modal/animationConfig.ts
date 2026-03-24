// modal animation configuration
// modify these values to customize animation behavior

export const ANIMATION_CONFIG = {
	modalTransition: {
		duration: 400,
		easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
		initialFilters: {
			light: 'contrast(0.1) brightness(2)',
			dark: 'contrast(0.4) brightness(0.35)'
		}
	},
	nestedTransition: {
		duration: 50
	}
}
