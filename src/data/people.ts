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
		notes: { en: ['PERSON WITH ADHD', 'FAVORITE FOOD: HOT PATTIES'], ja: ['ADHDがある', '好きな食べ物: ホットパティ'] },
	},
	{
		nick: 'FAA',
		roles: ['ALUMNI', 'FRIEND'],
		memoir: { en: 'FORMER TOP-3 OSU! PLAYER IN BANGLADESH.', ja: 'バングラデシュの元osu!トップ3プレイヤー。' },
		from: 'BANGLADESH',
		notes: { en: ['OPTICAL POWER: R -6.50 / L -6.75', 'FAVORITE FOOD: CHOTO FUCHKA'], ja: ['目の度数: 右 -6.50 / 左 -6.75', '好きな食べ物: チョト・フチカ'] },
	},

	// {
	// 	nick: 'SABLE',
	// 	roles: ['COMRADE'],
	// 	memoir: {
	// 		en: 'KNOWN EACH OTHER SINCE BEFORE EITHER OF US KNEW WHAT WE WERE DOING. STILL FIGURING IT OUT TOGETHER.',
	// 		ja: 'お互い何もわかってない頃からの知り合い。今もまだ一緒に模索中。',
	// 	},
	// 	from: 'JAPAN',
	// 	notes: {
	// 		en: [
	// 			'REMEMBERS THINGS I THOUGHT I FORGOT.',
	// 			'SOMEHOW ALWAYS AROUND AT THE RIGHT TIME.',
	// 		],
	// 		ja: [
	// 			'自分が忘れたと思っていたことを覚えている。',
	// 			'なぜかいつもいいタイミングにいる。',
	// 		],
	// 	},
	// },
	// {
	// 	nick: 'MIMI',
	// 	roles: ['ALUMNI'],
	// 	memoir: {
	// 		en: 'SCHOOL BROUGHT US TOGETHER, BUT WE STAYED AFTER IT ENDED. THAT SAYS ENOUGH.',
	// 		ja: '学校で出会ったけど、終わった後も続いた。それだけで十分。',
	// 	},
	// 	from: 'FRANCE',
	// 	notes: {
	// 		en: ['THE ONE I CALL WHEN I NEED TO THINK OUT LOUD.'],
	// 		ja: ['声に出して考えたいときに電話する人。'],
	// 	},
	// },
	// {
	// 	nick: 'KES',
	// 	roles: ['MUTUAL'],
	// 	memoir: {
	// 		en: 'A MUTUAL WHO BECAME MORE. QUIET PRESENCE, STRONG OPINIONS ON OBSCURE THINGS.',
	// 		ja: '共通の知り合いから始まった関係。静かだけど、マニアックなことには強い意見を持つ。',
	// 	},
	// 	from: 'UNKNOWN',
	// 	notes: {
	// 		en: ['RECOMMENDED A FILM THAT I THINK ABOUT EVERY OTHER WEEK.'],
	// 		ja: ['隔週くらいで思い出す映画を勧めてくれた人。'],
	// 	},
	// },
	// {
	// 	nick: 'ORYN',
	// 	roles: ['COMRADE'],
	// 	memoir: {
	// 		en: 'STARTED IRL, CONTINUED ONLINE. ONE OF THOSE RARE ONES WHERE THE DISTANCE DOESN\'T REALLY MATTER.',
	// 		ja: 'リアルで始まり、オンラインに続いた。距離が関係ない数少ない人のひとり。',
	// 	},
	// 	from: 'JAPAN',
	// 	notes: {
	// 		en: [
	// 			'MAKES ME LAUGH WITHOUT TRYING.',
	// 			'KNOWS WHEN NOT TO SAY ANYTHING.',
	// 		],
	// 		ja: [
	// 			'意識せずに笑わせてくれる。',
	// 			'何も言わないべきときを知っている。',
	// 		],
	// 	},
	// },
	// {
	// 	nick: 'VES',
	// 	roles: ['MUTUAL'],
	// 	memoir: {
	// 		en: 'FOUND THROUGH A SHARED INTEREST IN SOMETHING OBSCURE. STAYED FOR EVERYTHING ELSE.',
	// 		ja: 'マニアックな共通の趣味で知り合った。それ以外でも続いた。',
	// 	},
	// 	from: 'UNKNOWN',
	// 	notes: {
	// 		en: ['ALWAYS HAS A RECOMMENDATION READY.'],
	// 		ja: ['いつもおすすめを持っている。'],
	// 	},
	// },
	// {
	// 	nick: 'LUNE',
	// 	roles: ['COMRADE', 'ALUMNI'],
	// 	memoir: {
	// 		en: 'SCHOOL TO NOW. A RARE CONSTANT IN A WORLD OF VARIABLES.',
	// 		ja: '学校から今まで。変数だらけの世界の中の、珍しい定数。',
	// 	},
	// 	from: 'JAPAN',
	// 	notes: {
	// 		en: ['HONEST IN A WAY THAT ACTUALLY HELPS.'],
	// 		ja: ['本当に役立つ正直さを持っている。'],
	// 	},
	// },
	// {
	// 	nick: 'WREN',
	// 	roles: ['COMRADE'],
	// 	memoir: {
	// 		en: 'THE KIND OF FRIEND YOU CAN NOT TALK TO FOR MONTHS AND PICK UP EXACTLY WHERE YOU LEFT OFF.',
	// 		ja: '何ヶ月話さなくても、続きからすぐ話せる友達。',
	// 	},
	// 	from: 'JAPAN',
	// 	notes: {
	// 		en: ['LOW MAINTENANCE, HIGH VALUE.'],
	// 		ja: ['手がかからない分、価値が高い。'],
	// 	},
	// },
	// {
	// 	nick: 'IO',
	// 	roles: ['COMRADE'],
	// 	memoir: {
	// 		en: 'MET DURING A WEIRD PERIOD OF MY LIFE. SOMEHOW THAT MADE THE FRIENDSHIP STRONGER.',
	// 		ja: '人生の変な時期に出会った。それがかえって友情を深めた。',
	// 	},
	// 	from: 'UNKNOWN',
	// 	notes: {
	// 		en: ['HAS SEEN ME AT MY WORST AND DIDN\'T LEAVE.'],
	// 		ja: ['最悪な状態を見ても去らなかった。'],
	// 	},
	// },
	// {
	// 	nick: 'SOL',
	// 	roles: ['ALUMNI'],
	// 	memoir: {
	// 		en: 'WE BONDED OVER SHARED EXHAUSTION. SOMETIMES THAT\'S ENOUGH.',
	// 		ja: '共通の疲弊で仲良くなった。それで十分なこともある。',
	// 	},
	// 	from: 'JAPAN',
	// 	notes: {
	// 		en: ['THE PERSON I TEXT WHEN SOMETHING IS TOO ABSURD TO KEEP TO MYSELF.'],
	// 		ja: ['バカバカしすぎて一人で抱えられないときに送る相手。'],
	// 	},
	// },
	// {
	// 	nick: 'MOSS',
	// 	roles: ['MUTUAL'],
	// 	memoir: {
	// 		en: 'A QUIET PRESENCE IN MY CORNER OF THE INTERNET. CONSISTENT IN THE BEST WAY.',
	// 		ja: 'インターネットの隅で静かにいる存在。いい意味でブレない。',
	// 	},
	// 	from: 'UNKNOWN',
	// 	notes: {
	// 		en: ['NEVER OVERSTAYS, NEVER DISAPPEARS.'],
	// 		ja: ['長居もしないし、消えもしない。'],
	// 	},
	// },
	// {
	// 	nick: 'DAY',
	// 	roles: ['COMRADE'],
	// 	memoir: {
	// 		en: 'ENERGY THAT FILLS A ROOM. THE KIND OF PERSON WHO MAKES EVERY PLAN FEEL LIKE AN EVENT.',
	// 		ja: '部屋を満たすエネルギー。どんな予定もイベントにしてしまう人。',
	// 	},
	// 	from: 'JAPAN',
	// 	notes: {
	// 		en: ['IMPOSSIBLE TO BE IN A BAD MOOD AROUND.'],
	// 		ja: ['この人といると不機嫌でいられない。'],
	// 	},
	// },
	// {
	// 	nick: 'QUINN',
	// 	roles: ['ALUMNI'],
	// 	memoir: {
	// 		en: 'WE DIDN\'T TALK MUCH DURING SCHOOL. AFTER WAS A DIFFERENT STORY.',
	// 		ja: '学校ではあまり話さなかった。卒業後は別の話になった。',
	// 	},
	// 	from: 'JAPAN',
	// 	notes: {
	// 		en: ['PROOF THAT TIMING MATTERS MORE THAN PROXIMITY.'],
	// 		ja: ['距離より タイミングの方が大事だという証拠。'],
	// 	},
	// },
	// {
	// 	nick: 'SER',
	// 	roles: ['MUTUAL'],
	// 	memoir: {
	// 		en: 'WE\'VE NEVER MET BUT WE\'VE TALKED ABOUT THINGS I HAVEN\'T TOLD ANYONE ELSE.',
	// 		ja: '会ったことはないけど、誰にも言っていないことを話した。',
	// 	},
	// 	from: 'UNKNOWN',
	// 	notes: {
	// 		en: ['DISTANCE MAKES HONESTY EASIER SOMETIMES.'],
	// 		ja: ['距離があると正直になりやすいこともある。'],
	// 	},
	// },
	// {
	// 	nick: 'B',
	// 	roles: ['COMRADE'],
	// 	memoir: {
	// 		en: 'THE KIND OF PERSON WHO FIXES THINGS WITHOUT BEING ASKED. PRACTICAL AND QUIETLY GENEROUS.',
	// 		ja: '頼まなくても何かを直してくれる人。実用的で、静かに寛大。',
	// 	},
	// 	from: 'SWEDEN',
	// 	notes: {
	// 		en: ['ACTIONS OVER WORDS, EVERY TIME.'],
	// 		ja: ['いつも言葉より行動。'],
	// 	},
	// },
]

export default people
