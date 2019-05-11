const waterfall = require('async/waterfall');
const Tasks = require('./tasks').Tasks;
const configs = require('./config');


configs.forEach(config => {
	const tasks = new Tasks(config);

	const botLoop = () => {
		waterfall([
			tasks.loginTask,
			tasks.fetchTweetsTask,
			tasks.filterTweetsTask,
			tasks.repostTask,
		], function (err) {
			if (err) {
				tasks.err(err);
				setTimeout(botLoop, config.errorDelay);
			} else {
				setTimeout(botLoop, config.successDelay);
			}
		});
	};

	setTimeout(() => botLoop(), config.startupDelay);
});
