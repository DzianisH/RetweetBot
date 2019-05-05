const consumerKeyConfig = process.env.CONSUMENR_KEY || "";
const consumerSecretConfig = process.env.CONSUMENR_SECRET || "";
const accessTokenConfig = process.env.ACCESS_TOKEN || "";
const accessTokenSecretConfig = process.env.ACCESS_TOKEN_SECRET || "";
const hashTagsConfig = process.env.HASH_TAGS || '';

const configs = {
	twitter: {
		consumer_key: consumerKeyConfig,
		consumer_secret: consumerSecretConfig,
		access_token: accessTokenConfig,
		access_token_secret: accessTokenSecretConfig
	},
	hashTags: hashTagsConfig.split(' '),
	resultType: 'recent',
	lang: 'en',
	count: 100,
	// ms
	errorTimeout: 71 * 1000,
	successTimeout: 41 * 60 * 1000
};

console.log("Use the following configs");
console.log(configs);

module.exports = configs;