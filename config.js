const consumerKeyConfig = process.env.CONSUMENR_KEY || "";
const consumerSecretConfig = process.env.CONSUMENR_SECRET || "";
const accessTokenConfig = process.env.ACCESS_TOKEN || "";
const accessTokenSecretConfig = process.env.ACCESS_TOKEN_SECRET || "";
const hashTagsConfig = process.env.HASH_TAGS || '';

const configs = {
	skip: false,
	name: 'fitness',
	twitter: {
		consumer_key: consumerKeyConfig,
		consumer_secret: consumerSecretConfig,
		access_token: accessTokenConfig,
		access_token_secret: accessTokenSecretConfig
	},
	hashTags: hashTagsConfig.split(' '),
	maxUrlsCount: 0,
	resultType: 'recent',
	lang: 'en',
	count: 100,
	quoteRate: 0.15, // probability
	// ms
	errorDelay: 71 * 1000,
	successDelay: 41 * 60 * 1000,
	startupDelay: 1
};

console.log("Use the following configs");
console.log(configs);

module.exports = configs;