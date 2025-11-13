import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'experimental-edge'

const SUPPORTED_LANGUAGES = ['en', 'ja']
const DEFAULT_LANGUAGE = 'ja'

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Check if pathname already has a language prefix
	const pathnameHasLanguage = SUPPORTED_LANGUAGES.some(
		(lang) => pathname.startsWith(`/${lang}`) || pathname === `/${lang}`
	)

	if (pathnameHasLanguage) {
		return NextResponse.next()
	}

	// If root path, redirect to preferred language or default
	if (pathname === '/') {
		const preferredLang = request.cookies.get('NEXT_LANGUAGE')?.value || DEFAULT_LANGUAGE
		return NextResponse.redirect(new URL(`/${preferredLang}`, request.url))
	}

	// For any other path, prepend default language
	return NextResponse.redirect(new URL(`/${DEFAULT_LANGUAGE}${pathname}`, request.url))
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|api|favicon.ico|fonts|flags|cdn-cgi).*)'],
}
