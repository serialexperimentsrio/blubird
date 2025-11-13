// modal animation configuration
// modify these values to customize animation behavior

export const ANIMATION_CONFIG = {
	// backdrop fade animation
	backdropTransition: {
		duration: 1000, // milliseconds
		easing: 'ease'
	},
	// modal open/close animation
	modalTransition: {
		duration: 400, // milliseconds
		easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
		// unmount the modal content this many milliseconds before the animation ends
		// this prevents content from being visible during the final frames of closing
		unmountBeforeEnd: 100, // milliseconds
		// CSS filters for the initial state of the modal animation
		// these create the "fade in from dimmed" effect
		initialFilters: {
			light: 'contrast(0.1) brightness(2)', // light theme: very bright and low contrast
			dark: 'contrast(0.4) brightness(0.35)' // dark theme: dim and low contrast
		}
	},
	// nested modal transition (when switching between modals)
	// this controls how long the close animation plays before being cancelled
	// the modal will start closing normally but after this duration it will
	// be interrupted and the new modal will open
	nestedTransition: {
		duration: 50 // milliseconds of close animation to play
	}
}
