const configs = [
	{
		skip: false,
		name: 'fitness',
		twitter: {
			consumer_key: process.env.FIT_CONSUMENR_KEY || '',
			consumer_secret: process.env.FIT_CONSUMENR_SECRET || '',
			access_token: process.env.FIT_ACCESS_TOKEN || '',
			access_token_secret: process.env.FIT_ACCESS_TOKEN_SECRET || ''
		},
		hashTags: '#fitness #fitnessmotivation #lifting #gym #workout'.split(' '),
		maxUrlsCount: 1,
		resultType: 'recent',
		lang: 'en',
		count: 100,
		quoteRate: 0.15, // probability
		quoteProducerList: [
			() => `Check @${login} tweet out!`,
			() => `Take a look at @${login}'s post!`,
			() => `One more awesome tweet!`,
			() => `@${login} posted tweet today.`,
			() => `Update from @${login}.`
		],
		// ms
		errorDelay: 71 * 1000,
		successDelay: 41 * 60 * 1000,
		startupDelay: 1
	},
	{
		skip: false,
		name: 'cook',
		twitter: {
			consumer_key: process.env.COOK_CONSUMENR_KEY || '',
			consumer_secret: process.env.COOK_CONSUMENR_SECRET || '',
			access_token: process.env.COOK_ACCESS_TOKEN || '',
			access_token_secret: process.env.COOK_ACCESS_TOKEN_SECRET || ''
		},
		hashTags: '#lovefood #recipe #recipe'.split(' '),
		maxUrlsCount: 0,
		resultType: 'recent',
		lang: 'en',
		count: 100,
		quoteRate: 0.05, // probability
		quoteProducerList: [
			() => `@${login} tweeted new delicious.`,
			() => `@${login} posted tweet today.`,
			() => `New recipe from @${login}.`
		],
		// ms
		errorDelay: 71 * 1000,
		successDelay: 92 * 60 * 1000,
		startupDelay: 111
	}
].filter(config => !config.skip);

console.log("Using the following configs");
console.log(configs);

module.exports = configs;