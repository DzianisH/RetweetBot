const standardDenyHosts = ['bit.ly', 'amzn.to', 'goo.gl', 'tiny.cc', 'ow.ly', 'buff.ly', 'instagram.com', 'amazon.com'];
const startupDelayAdder = 7000;

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
		hashTags: '#fitness #fitnessmotivation #gym #workout #bodybuilding'.split(' '),
		maxUrlsCount: 0,
		minPopularity: estimatePopularity(4, 100),
		minQuotePopularity: estimatePopularity(10, 100),
		resultType: 'recent',
		lang: 'en',
		count: 100,
		quoteRate: 0.25, // probability
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
		successDelay: 83 * 60 * 1000,
		startupDelay: 1
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
		maxUrlsCount: 99,
		denyHosts: standardDenyHosts,
		minPopularity: estimatePopularity(4, 100),
		minQuotePopularity: estimatePopularity(10, 100),
		resultType: 'recent',
		lang: 'en',
		count: 100,
		quoteRate: 0.11,
		quoteProducerList: [
			(login) => `@${login} tweeted new delicious.`,
			(login) => `@${login} posted tweet today.`,
			(login) => `New recipe from @${login}.`,
			(login) => `Yummy stuff @${login} has tweeted.`,
			(login) => `I guess this tweet from @${login} can be useful for those, likes to cook.`,
		],
		// ms
		errorDelay: 71 * 1000,
		successDelay: 83 * 60 * 1000,
		startupDelay: startupDelayAdder
	},
	{
		skip: false,
		name: 'travel',
		twitter: {
			consumer_key: process.env.TRAVEL_CONSUMENR_KEY || '',
			consumer_secret: process.env.TRAVEL_CONSUMENR_SECRET || '',
			access_token: process.env.TRAVEL_ACCESS_TOKEN || '',
			access_token_secret: process.env.TRAVEL_ACCESS_TOKEN_SECRET || ''
		},
		hashTags: '#travelblogger #travelblog #travel #traveling #travelphotography #travelphoto #exprole #nature'.split(' '),
		maxUrlsCount: 1,
		denyHosts: standardDenyHosts,
		minPopularity: estimatePopularity(4, 100),
		minQuotePopularity: estimatePopularity(10, 100),
		resultType: 'recent',
		lang: 'en',
		count: 100,
		quoteRate: 0.11,
		quoteProducerList: [
			(login) => `@${login} tweeted today.`,
			(login) => `@${login} posted tweet today.`,
			(login) => `New travel post from @${login}.`,
			(login) => `Take a look at @${login}'s tweet!`,
			(login) => `Take a look at @${login}'s post!`,
			(login) => `I guess this tweet from @${login} can be useful for those, who likes to travel.`,
		],
		// ms
		errorDelay: 71 * 1000,
		successDelay: 83 * 60 * 1000,
		startupDelay: 2 * startupDelayAdder
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
		// filter #yogapants
		hashTags: '#yoga #yogi #meditation #YogaTTC #yogaeveryday'.split(' '),
		maxUrlsCount: 1,
		denyHosts: standardDenyHosts,
		minPopularity: estimatePopularity(4, 100),
		minQuotePopularity: estimatePopularity(10, 100),
		resultType: 'recent',
		lang: 'en',
		count: 100,
		quoteRate: 0.11,
		quoteProducerList: [
			(login) => `@${login} tweeted today.`,
			(login) => `@${login} posted tweet today.`,
			(login) => `New yoga post from @${login}.`,
			(login) => `Take a look at @${login}'s tweet!`,
			(login) => `Take a look at @${login}'s post!`,
			(login) => `I guess this tweet from @${login} can be useful for those, who practice yoga.`,
		],
		// ms
		errorDelay: 71 * 1000,
		successDelay: 83 * 60 * 1000,
		startupDelay: 3 * startupDelayAdder
	}
].filter(config => !config.skip);

module.exports = configs;

//wtf
function estimatePopularity(engagement, impression) {
	return engagement / (Math.log(impression + 1) + 1);
}