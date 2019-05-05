const Twitter = require('twit');
const config = require('./config');

const twitter = new Twitter(config.twitter);
let rtIdList = [];

const randomElement = (arr) => {
	const index = Math.floor(arr.length * Math.random());
	return arr[index];
};

const createQuoteMessage = (tweet, hashTag) => {
	const login = tweet.user.screen_name;
	return randomElement([
		'Check this out, ' + hashTag + ' tweet from @' + login + '.',
		'Take a look at @' + login + "'s " + hashTag + " post!",
		'One more ' + hashTag + ' tweet!',
		'@' + login + ' posted ' + hashTag + ' tweet today.',
		hashTag + ' update from @' + login + "."
	]);
};

const loginTask = (callback) => {
	twitter.get('account/verify_credentials', {
		include_entities: false,
		skip_status: true,
		include_email: false
	}, (err) => {
		if (err) {
			console.error("Can't login");
		}
		return callback(err);
	});
};

const fetchTweetsTask = (callback) => {
	const hashTag = randomElement(config.hashTags);
	const params = {
		q: hashTag,
		result_type: config.resultType,
		lang: config.lang,
		count: config.count,
	};
	twitter.get('search/tweets', params, (err, res) => {
		if (err) {
			console.error("Can't get latest tweets");
		}
		return callback(err, res, hashTag);
	});
};

const filterTweetsTask = (res, hashTag, callback) => {
	const statuses = res.statuses
		.filter(status => !!status)
		.filter(status => !status.possibly_sensitive)
		.filter(status => !status.retweeted)
		.filter(status => status.entities.urls.length === 0)
		.filter(status => !status.in_reply_to_status_id && !status.in_reply_to_user_id && !status.in_reply_to_screen_name)
		.filter(status => !status.retweeted_status)
		.filter(status => rtIdList.indexOf(status.id_str) === -1)
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
	return callback(null, statuses[0], hashTag);
};

const retweetTask = (tweet, hashTag, callback) => {
	twitter.post('statuses/retweet/:id', {
		id: tweet.id_str
	}, (err, res) => {
		const tweetLink = "http://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;

		if (err) {
			console.error("Can't retweet " + tweetLink);
		} else {
			console.log("Retweeted " + tweetLink);
		}

		if(rtIdList.indexOf(tweet.id_str) === -1) {
			rtIdList.push(tweet.id_str);
		}
		if (rtIdList.length > 151) {// magic numbers is ok
			rtIdList = rtIdList.slice(rtIdList.length - 50, rtIdList.length);
		}
		return callback(err, res);
	});
};

const quoteTask = (tweet, hashTag, callback) => {
	const tweetLink = "http://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
	twitter.post('statuses/update', {
		status: createQuoteMessage(tweet, hashTag) + '\n' + tweetLink ,
	}, (err, res) => {

		if (err) {
			console.error("Can't retweet " + tweetLink);
		} else {
			console.log("Retweeted " + tweetLink);
		}

		if(rtIdList.indexOf(tweet.id_str) === -1) {
			rtIdList.push(tweet.id_str);
		}
		if (rtIdList.length > 151) {// magic numbers is ok
			rtIdList = rtIdList.slice(rtIdList.length - 50, rtIdList.length);
		}
		return callback(err, res);
	});
};

module.exports = {
	loginTask: loginTask,
	fetchTweetsTask: fetchTweetsTask,
	filterTweetsTask: filterTweetsTask,
	retweetTask: retweetTask,
	quoteTask: quoteTask
};
