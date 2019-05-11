const Twitter = require('twit');

export class Tasks {
	constructor(config) {
		this.config = config;
		this.twitter = new Twitter(this.config.twitter);
		this.rtIdList = [];
	}

	loginTask(callback) {
		this.twitter.get('account/verify_credentials', {
			include_entities: false,
			skip_status: true,
			include_email: false
		}, (err) => {
			if (err) {
				this.err(null, "Can't login");
			}
			return callback(err);
		});
	};

	fetchTweetsTask(callback) {
		const hashTag = randomElement(this.config.hashTags);
		const params = {
			q: hashTag,
			result_type: this.config.resultType,
			lang: this.config.lang,
			count: this.config.count,
		};

		this.twitter.get('search/tweets', params, (err, res) => {
			if (err) {
				this.err(null, "Can't get latest tweets");
			}
			return callback(err, res);
		});
	};

	filterTweetsTask(res, callback) {
		const statuses = res.statuses
			.filter(status => !!status)
			.filter(status => !status.possibly_sensitive)
			.filter(status => !status.retweeted)
			.filter(status => status.entities.urls.length <= this.config.maxUrlsCount)
			.filter(status => !status.in_reply_to_status_id && !status.in_reply_to_user_id && !status.in_reply_to_screen_name)
			.filter(status => !status.retweeted_status)
			.filter(status => this.rtIdList.indexOf(status.id_str) === -1)
			.map(status => {
				status.popularity = (status.retweet_count + status.favorite_count) /
					(Math.log(status.user.followers_count + 1) + 1);
				return status;
			})
			.filter(status => status.popularity > 0);

		if (statuses.length === 0) {
			return callback("Nothing to retweet");
		}

		statuses.sort((status1, status2) => status2.popularity - status1.popularity);
		return callback(null, statuses[0]);
	};

	repostTask(tweet, callback) {
		if (Math.random() < this.config.quoteRate) {
			this.quoteTask(tweet, callback);
		} else {
			this.retweetTask(tweet, callback);
		}
	};

	retweetTask(tweet, callback) {
		this.twitter.post('statuses/retweet/:id', {
			id: tweet.id_str
		}, (err, res) => {

			if (err) {
				this.err(null, "Can't retweet " + createTweetLink(tweet));
			} else {
				this.log("Retweeted " + createTweetLink(tweet));
			}

			this.pushTweetToRTList(tweet);
			return callback(err, res);
		});
	};

	quoteTask(tweet, callback) {
		this.twitter.post('statuses/update', {
			status: this.createQuote(tweet),
		}, (err, res) => {

			if (err) {
				this.err(null, "Can't quote " + createTweetLink(tweet));
			} else {
				this.log("Quoted " + createTweetLink(tweet));
			}

			this.pushTweetToRTList(tweet);
			return callback(err, res);
		});
	};

	pushTweetToRTList(tweet) {
		if (this.rtIdList.indexOf(tweet.id_str) === -1) {
			this.rtIdList.push(tweet.id_str);
		}
		if (this.rtIdList.length > 151) {// magic numbers is ok
			this.rtIdList = this.rtIdList.slice(this.rtIdList.length - 50, this.rtIdList.length);
		}
	}

	createQuote(tweet) {
		return this.createQuoteMessage(tweet)
			+ '\n' + createQuoteHashTags(tweet)
			+ '\n' + createTweetLink(tweet);
	};

	createQuoteMessage(tweet) {
		const login = tweet.user.screen_name; // used
		return randomElement(this.config.quoteProducerList)();
	};

	// will redo later
	log(text) {
		if (text) {
			console.log(this.config.name + ' ' + text);
		}
	}

	err(err, text) {
		if (text) {
			console.error(this.config.name + ' ' + text);
		}
		if (err) {
			console.error(err);
		}
	}
}

const createQuoteHashTags = (status) => {
	const hashTags = status.entities.hashtags;
	let str = "";
	for (let i = 0; i < hashTags.length; ++i) {
		str += "#" + hashTags[i].text + " ";
	}
	return str.trim();
};

function createTweetLink(tweet) {
	return "http://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
}

const randomElement = (arr) => {
	const index = Math.floor(arr.length * Math.random());
	return arr[index];
};
