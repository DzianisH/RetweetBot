const Twitter = require('twit');

const twitter = new Twitter({
	consumer_key: process.env.CONSUMENR_KEY,
	consumer_secret: process.env.CONSUMENR_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
const queries = ['#fitness', '#fitnessmotivation', '#lifting', '#gym', '#workout'];

let rtIdList = ['1124725709807734786'];

const randomElement = (arr) => {
	const index = Math.floor(arr.length * Math.random());
	return arr[index];
};

const loginTask = (callback) => {
	twitter.get('account/verify_credentials', {
		include_entities: false,
		skip_status: true,
		include_email: false
	}, (err, res) => {
		if (err) {
			console.error("Can't login");
		}
		return callback(err);
	});
};

const fetchTweetsTask = (callback) => {
	const params = {
		q: randomElement(queries),
		result_type: 'recent',
		lang: 'en',
		count: 100,
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
			status.popularity = (status.retweet_count + status.favorite_count) / (Math.log(status.user.followers_count + 1) + 2);
			return status;
		})
		.filter(status => status.popularity > 0);

	if (res.statuses.length === 0) {
		return callback("Nothing to retweet");
	}

	statuses.sort((status1, status2) => status2.popularity - status1.popularity);
	const retweetId = statuses[0].id_str;
	console.log("Gonna retweet " +
		"http://twitter.com/" + statuses[0].user.screen_name + "/status/" + retweetId +
		"  " + statuses[0].popularity);

	return callback(null, retweetId);
};

const retweetTask = (retweetId, callback) => {
	twitter.post('statuses/retweet/:id', {
		id: retweetId
	}, (err, res) => {
		if (err) {
			console.error("Can't retweet " + retweetId);
		}

		if(rtIdList.indexOf(retweetId) === -1) {
			rtIdList.push(retweetId);
		}
		if (rtIdList.length > 151) {
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
