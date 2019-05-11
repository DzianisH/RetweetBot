const waterfall = require('async/waterfall');
const Tasks = require('./tasks');
const configs = require('./config');


configs.forEach(config => {
	const tasks = new Tasks(config);
	const botLoop = () => {
		waterfall([
			tasks.loginTask.bind(tasks),
			tasks.fetchTweetsTask.bind(tasks),
			tasks.filterTweetsTask.bind(tasks),
			tasks.repostTask.bind(tasks),
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
