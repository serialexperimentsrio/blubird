import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LANG, isLang } from '@/lib/lang'

export const runtime = 'experimental-edge'

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Already prefixed with a supported language (`/en`, `/ja/diary`, ...)
	if (isLang(pathname.split('/')[1])) {
		return NextResponse.next()
	}

	// If root path, redirect to preferred language or default
	if (pathname === '/') {
		const cookieLang = request.cookies.get('NEXT_LANGUAGE')?.value
		const preferredLang = isLang(cookieLang) ? cookieLang : DEFAULT_LANG
		return NextResponse.redirect(new URL(`/${preferredLang}`, request.url))
	}

	// For any other path, prepend default language
	return NextResponse.redirect(new URL(`/${DEFAULT_LANG}${pathname}`, request.url))
}

export const config = {
	// Exclude Next internals, APIs, public folders and any path with a file
	// extension (robots.txt, favicon.ico, ...) so they are served directly and
	// not redirected to a language-prefixed route.
	matcher: ['/((?!_next/static|_next/image|api|fonts|icons|cdn-cgi|diary|.*\\..*).*)'],
}
