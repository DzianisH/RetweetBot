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
		hashTags: '#fitness #fitnessmotivation #lifting #gym #workout #bodybuilding'.split(' '),
		maxUrlsCount: 0,
		minPopularity: estimatePopularity(2, 100),
		minQuotePopularity: estimatePopularity(7, 100),
		resultType: 'recent',
		lang: 'en',
		count: 100,
		quoteRate: 0.13, // probability
		quoteProducerList: [
			(login) => `Check @${login} tweet out!`,
			(login) => `Take a look at @${login}'s post!`,
			() => `One more awesome tweet!`,
			(login) => `@${login} posted tweet today.`,
			(login) => `Update from @${login}.`,
			(login) => `Guys, check fitness update from @${login}.`,
		],
		// ms
		errorDelay: 71 * 1000,
		successDelay: 42 * 60 * 1000,
		startupDelay: 0
	},
	{
		skip: false,
		name: 'cooking',
		twitter: {
			consumer_key: process.env.COOK_CONSUMENR_KEY || '',
			consumer_secret: process.env.COOK_CONSUMENR_SECRET || '',
			access_token: process.env.COOK_ACCESS_TOKEN || '',
			access_token_secret: process.env.COOK_ACCESS_TOKEN_SECRET || ''
		},
		hashTags: '#lovefood #recipe #recipes #cooking'.split(' '),
		maxUrlsCount: 1,
		minPopularity: estimatePopularity(2, 100),
		minQuotePopularity: estimatePopularity(10, 100),
		resultType: 'recent',
		lang: 'en',
		count: 100,
		quoteRate: 0.09,
		quoteProducerList: [
			(login) => `@${login} tweeted new delicious.`,
			(login) => `@${login} posted tweet today.`,
			(login) => `New recipe from @${login}.`,
			(login) => `Yummy stuff @${login} has tweeted.`
		],
		// ms
		errorDelay: 63 * 1000,
		successDelay: 83 * 60 * 1000,
		startupDelay: 1001
	},
	{
		skip: false,
		name: 'travel_blogger',
		twitter: {
			consumer_key: process.env.TRAVEL_CONSUMENR_KEY || '',
			consumer_secret: process.env.TRAVEL_CONSUMENR_SECRET || '',
			access_token: process.env.TRAVEL_ACCESS_TOKEN || '',
			access_token_secret: process.env.TRAVEL_ACCESS_TOKEN_SECRET || ''
		},
		hashTags: '#travelblogger #travelblog #travel #traveling'.split(' '),
		maxUrlsCount: 1,
		minPopularity: estimatePopularity(2, 100),
		minQuotePopularity: estimatePopularity(10, 100),
		resultType: 'recent',
		lang: 'en',
		count: 100,
		quoteRate: 0,
		quoteProducerList: [
		],
		// ms
		errorDelay: 63 * 1000,
		successDelay: 63 * 60 * 1000,
		startupDelay: 2002
	},
	{
		skip: false,
		name: 'yoga',
		twitter: {
			consumer_key: process.env.YOGA_CONSUMENR_KEY || '',
			consumer_secret: process.env.YOGA_CONSUMENR_SECRET || '',
			access_token: process.env.YOGA_ACCESS_TOKEN || '',
			access_token_secret: process.env.YOGA_ACCESS_TOKEN_SECRET || ''
		},
		hashTags: '#yoga #yogi #meditation'.split(' '),
		maxUrlsCount: 1,
		minPopularity: estimatePopularity(2, 100),
		minQuotePopularity: estimatePopularity(10, 100),
		resultType: 'recent',
		lang: 'en',
		count: 100,
		quoteRate: 0,
		quoteProducerList: [
		],
		// ms
		errorDelay: 63 * 1000,
		successDelay: 38 * 60 * 1000,
		startupDelay: 3003
	}
].filter(config => !config.skip);

module.exports = configs;

//wtf
function estimatePopularity(engagement, impression) {
	return engagement / (Math.log(impression + 1) + 1);
}