export type Person = {
	nick: string
	isMe?: boolean
	roles: string[]
	memoir: {
		en: string
		ja: string
	}
	from?: string
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
			en: 'THE ONE MAINTAINING THIS PLACE. A COLLECTOR OF THINGS. MIGHT BE AUTISTIC.',
			ja: 'この場所を管理している人。物事、人、瞬間を集める人。',
		},
		from: 'SOUTH KOREA',
		notes: {
			en: ['LOOKING FOR A JOB THAT PAYS.'],
			ja: ['このサイト全体が、ひとつの記憶みたいなもの。'],
		},
	},
	{
		nick: 'MISU',
		roles: ['SIBLING', 'COMRADE'],
		memoir: {
			en: 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR.',
			ja: '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。',
		},
		from: 'BANGLADESH',
		notes: {
			en: [
				'THERE AT YOUR WORST.',
				'KNOWS YOU BETTER THAN YOU DO.',
			],
			ja: [
				'何でも意見を持っていて、たいてい正しい。',
				'好きな音楽の半分はこの人のせい。',
			],
		},
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
	{ nick: 'FOO', roles: ['N/A'], memoir: { en: 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.', ja: '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'BAR', roles: ['N/A'], memoir: { en: 'SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA.', ja: '何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'BAZ', roles: ['N/A'], memoir: { en: 'UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS.', ja: '吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'QUX', roles: ['N/A'], memoir: { en: 'DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM.', ja: '人間の中でも特に獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話だ。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'QUUX', roles: ['N/A'], memoir: { en: 'EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT SUNT IN CULPA.', ja: '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'CORGE', roles: ['N/A'], memoir: { en: 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD.', ja: '何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'GRAULT', roles: ['N/A'], memoir: { en: 'TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA UT ENIM AD MINIM.', ja: '吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'GARPLY', roles: ['N/A'], memoir: { en: 'VENIAM QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA.', ja: '人間の中でも特に獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話だ。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'WALDO', roles: ['N/A'], memoir: { en: 'COMMODO CONSEQUAT DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE.', ja: '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'FRED', roles: ['N/A'], memoir: { en: 'VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR SINT OCCAECAT.', ja: '何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'PLUGH', roles: ['N/A'], memoir: { en: 'CUPIDATAT NON PROIDENT SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM.', ja: '吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'XYZZY', roles: ['N/A'], memoir: { en: 'ID EST LABORUM ET DOLORUM FUGA ET HARUM QUIDEM RERUM FACILIS EST.', ja: '人間の中でも特に獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話だ。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'THUD', roles: ['N/A'], memoir: { en: 'NAM LIBERO TEMPORE CUM SOLUTA NOBIS EST ELIGENDI OPTIO CUMQUE NIHIL.', ja: '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'FLOB', roles: ['N/A'], memoir: { en: 'IMPEDIT QUO MINUS ID QUOD MAXIME PLACEAT FACERE POSSIMUS OMNIS VOLUPTAS.', ja: '何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
	{ nick: 'ZORK', roles: ['N/A'], memoir: { en: 'ASSUMENDA EST OMNIS DOLOR REPELLENDUS TEMPORIBUS AUTEM QUIBUSDAM OFFICIIS.', ja: '吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という。' }, from: 'UNKNOWN', notes: { en: ['N/A'], ja: ['N/A'] } },
]

export default people
