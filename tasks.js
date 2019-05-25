const fs = require('fs');
const Twitter = require('twit');

const logToConsole = true;

const Tasks = class Tasks {
	constructor(config) {
		this.config = config;
		this.twitter = new Twitter(this.config.twitter);
		this.rtIdList = [];
	}

	loginTask(callback) {
		this.log("Woke up for " + this.config.name);
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
			.filter(status => !status.in_reply_to_status_id && !status.in_reply_to_user_id && !status.in_reply_to_screen_name)
			.filter(status => !status.retweeted_status)
			.filter(status => status.entities.urls.length <= this.config.maxUrlsCount)
			.filter(status => this.config.maxUrlsCount <= 0 || !this.hasDeniedHost(status))
			.filter(status => this.rtIdList.indexOf(status.id_str) === -1)
			.map(status => {
				status.popularity = (status.retweet_count + status.favorite_count) /
					(Math.log(status.user.followers_count + 1) + 1);
				return status;
			})
			.filter(status => status.popularity >= this.config.minPopularity);

		if (statuses.length === 0) {
			return callback("Nothing to retweet");
		}

		statuses.sort((status1, status2) => status2.popularity - status1.popularity);
		return callback(null, statuses[0]);
	};

	repostTask(tweet, callback) {
		if (tweet.popularity >= this.config.minQuotePopularity && Math.random() < this.config.quoteRate) {
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
		return randomElement(this.config.quoteProducerList)(login);
	};

	hasDeniedHost(status) {
		let host = null;
		for (let i = 0; i < status.entities.urls.length; ++i) {
			try {
				host = new URL(status.entities.urls[i].expanded_url).host;
				if (this.config.denyHosts.indexOf(host) > -1) {
					return true;
				}
			} catch (e) {
				this.err(status.entities.urls);
				this.err(this.config.denyHosts);
				this.err(null);
				this.err(e,"WTF happened");
				throw e;
			}
		}
		return false;
	}

	// will redo later
	log(text) {
		if (text) {
			const message = new Date().toISOString() + ' ' + this.config.name + ' ' + text;
			if (logToConsole) console.log(message);
			fs.appendFile('info.log', message + "\n", (err) => {
				if (err) {
					console.error(err);
					this.err(err, "Can't log info message to file.");
				}
			});
		}
	}

	err(err, text) {
		const message = new Date().toISOString() + ' ' + this.config.name + ' ' + (text || '');
		if(logToConsole) console.error(message);
		fs.appendFile('error.log', message + "\n",  (fsErr) => {
			if (fsErr) {
				console.error("Can't log error");
				console.error(fsErr);
			}
		});

		if (err) {
			if (logToConsole) console.error(err);
			fs.appendFile('error.log', JSON.stringify(err) + "\n",  (fsErr) => {
				if (fsErr) {
					console.error("Can't log error");
					console.error(fsErr);
				}
			});
		}
	}
};

const createQuoteHashTags = (status) => {
	const hashTags = status.entities.hashtags;
	let str = "";
	for (let i = 0; i < hashTags.length; ++i) {
		str += "#" + hashTags[i].text + " ";
	}
	return str.trim();
};

const createTweetLink = (tweet) => {
	return "http://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
};

const randomElement = (arr) => {
	const index = Math.floor(arr.length * Math.random());
	return arr[index];
};

module.exports = Tasks;
