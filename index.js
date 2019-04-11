const Twitter = require('twit');

const twitter = new Twitter({
	consumer_key: process.env.CONSUMENR_KEY,
	consumer_secret: process.env.CONSUMENR_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const retweetIds = ['1116226971938091008'];
twitter.get('account/verify_credentials', {
	include_entities: false,
	skip_status: true,
	include_email: false
}, (err, res) => {
	if (err) {
		throw err
	}

	console.log('Authentication successful. Running bot...');

	const params = {
		q: '#lifting',
		result_type: 'recent',
		lang: 'en',
		count: 100,
	};

	const retweeter = (since_id) => {
		console.log("RETWETTER IS HERE");
		params.since_id = since_id;
		twitter.get('search/tweets', params, (err, res) => {
			if (err) {
				console.error(err);
				return;
			}

			console.log(res.statuses.length);
			if (res.statuses.length === 0) {
				console.log("Nothing to retweet");
				setTimeout(retweeter, 66 * 1000);
				return;
			}

			let statuses = res.statuses;
			statuses = statuses
				.filter(status => !status.possibly_sensitive)
				.filter(status => !status.retweeted)
				.filter(status => status.entities.urls.length === 0)
				.filter(status => !status.in_reply_to_status_id && !status.in_reply_to_user_id && !status.in_reply_to_screen_name)
				.filter(status => !status.retweeted_status)
				.filter(status => retweetIds.indexOf(status.id_str) === -1)
				.map(status => {
					status.popularity = (status.retweet_count + status.favorite_count) / (status.user.followers_count + 2);
					return status;
				})
				.filter(status => status.popularity > 0.001);

			if (statuses.length > 0) {
				statuses.sort((status1, status2) => status2.popularity - status1.popularity);
				const retweetId = statuses[0].id_str;
				console.log(statuses[0]);
				console.log("http://twitter.com/" + statuses[0].user.screen_name + "/status/" + retweetId);
				console.log(statuses[0].popularity);


				twitter.post('statuses/retweet/:id', {
					id: retweetId
				}, (err, res) => {
					if (err) {
						console.error('Something went wrong while RETWEETING... Duplication maybe...');
						console.error(err);
						if(retweetIds.indexOf(retweetId) === -1) {
							retweetIds.push(retweetId);
						}
						setTimeout(retweeter,66 * 1000);
					} else if (res) {
						retweetIds.push(retweetId);
						console.log('retwetted');
						setTimeout(retweeter, 35 * 60 * 1000);
					}
				});
			} else {
				console.log('Nothing to retweet');
				setTimeout(retweeter, 66 * 1000);
			}
		});
	};

	retweeter(undefined)
});

