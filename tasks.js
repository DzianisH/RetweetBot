const Twitter = require('twit');
const config = require('./config');

const twitter = new Twitter(config.twitter);
let rtIdList = [];

const randomElement = (arr) => {
	const index = Math.floor(arr.length * Math.random());
	return arr[index];
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
	const params = {
		q: randomElement(config.hashTags),
		result_type: config.resultType,
		lang: config.lang,
		count: config.count,
	};
	twitter.get('search/tweets', params, (err, res) => {
		if (err) {
			console.error("Can't get latest tweets");
		}
		return callback(err, res);
	});
};

const filterTweetsTask = (res, callback) => {
	const statuses = res.statuses
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

	if (res.statuses.length === 0) {
		return callback("Nothing to retweet");
	}

	statuses.sort((status1, status2) => status2.popularity - status1.popularity);
	return callback(null, statuses[0]);
};

const retweetTask = (tweet, callback) => {
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

module.exports = {
	loginTask: loginTask,
	fetchTweetsTask: fetchTweetsTask,
	filterTweetsTask: filterTweetsTask,
	retweetTask: retweetTask
};
