const Twitter = require('twit');

const twitter = new Twitter({
	consumer_key: process.env.CONSUMENR_KEY,
	consumer_secret: process.env.CONSUMENR_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

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
		q: '#fitness',
		result_type: 'recent',
		lang: 'en',
		count: 50,
	};

	twitter.get('search/tweets', params, (err, res) => {
		if (err) {
			console.error(err);
			return;
		}

		let statuses = res.statuses
			.filter(status => !status.possibly_sensitive)
			.filter(status => !status.retweeted)
			.filter(status => status.entities.urls.length === 0)
			.filter(status => !status.in_reply_to_status_id && !status.in_reply_to_user_id && !status.in_reply_to_screen_name)
			.map(status => {
				if (status.user.followers_count) {
					status.popularity = (status.retweet_count + status.favorite_count) / status.user.followers_count;
				} else {
					status.popularity = 0.;
				}
				return status;
			});

		statuses.sort((status1, status2) => status2.popularity - status1.popularity);
		console.log(statuses);
		if (statuses.length > 0) {
			const retwitId = statuses[0].id_str;

			twitter.post('statuses/retweet/:id', {
				id: retwitId
			}, (err, res) => {
				if (err) {
					console.error('Something went wrong while RETWEETING... Duplication maybe...');
					console.error(err);
				} else if (res) {
					console.log('Retweeted!!!');
					console.log(res);
				}
			});
		}
	});
});

