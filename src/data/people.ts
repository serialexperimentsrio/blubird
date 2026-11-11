export type Person = {
	nick: string
	isMe?: boolean
	roles: string[]
	memoir: {
		en: string
		ja: string
	}
	from?: string | string[]
	notes: {
		en: string[]
		ja: string[]
	}
}

const people: Person[] = [
	{
		nick: 'RIO',
		isMe: true,
		roles: ['SELF'],
		memoir: {
			en: "SOLE PROGRAMMER OF RIO'S WORLD.",
			ja: '理央の世界の唯一のプログラマー。',
		},
		from: ['SOUTH KOREA', 'BANGLADESH'],
		notes: {
			en: ['RAADS-R SCORE: 186', 'FAVORITE FOOD: OMELETTE'],
			ja: ['RAADS-Rスコア: 186', '好きな食べ物: オムレツ'],
		},
	},
	{
		nick: 'MIN',
		roles: ['SIBLING'],
		memoir: {
			en: 'G.O.A.T.',
			ja: '史上最高。',
		},
		from: 'BANGLADESH',
		notes: { en: ['ADHD (CONFIRMED)', 'FAVORITE FOOD: HOT PATTIES'], ja: ['ADHDがある', '好きな食べ物: ホットパティ'] },
	},
	{
		nick: 'FAA',
		roles: ['ALUMNI', 'FRIEND'],
		memoir: { en: 'FORMER TOP-3 OSU! PLAYER OF BANGLADESH.', ja: 'バングラデシュの元osu!トップ3プレイヤー。' },
		from: 'BANGLADESH',
		notes: { en: ['OPTICAL POWER: R -6.50 / L -6.75', 'FAVORITE FOOD: CHOTO FUCHKA'], ja: ['目の度数: 右 -6.50 / 左 -6.75', '好きな食べ物: チョト・フチカ'] },
	},
	{
		nick: 'YSF',
		roles: ['ALUMNI', 'FRIEND'],
		memoir: { en: 'ASHEN ONE.', ja: '灰の方。' },
		from: 'BANGLADESH',
		notes: { en: ['STREAKY', 'FAVORITE FOOD: SOUP'], ja: ['ムラがある', '好きな食べ物: ソウプ'] },
	},
		{
		nick: 'MEL',
		roles: ['ALUMNI', 'FRIEND'],
		memoir: { en: 'SUSPECTED SLEEPER / UNDERCOVER GOV. OPERATIVE.', ja: '休眠工作員 / 政府の潜入工作員の疑い。' },
		from: 'BANGLADESH',
		notes: { en: ['BODYWEIGHT: ~120 KG', 'FAVORITE FOOD: PIPE ICE CREAM'], ja: ['体重: 約120kg', '好きな食べ物: パイプアイスクリーム'] },
	},
]

export default people
