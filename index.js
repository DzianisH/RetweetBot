const waterfall = require('async/waterfall');
const tasks = require('./tasks');
const config = require('./config');

const botLoop = () => {
	waterfall([
		tasks.loginTask,
		tasks.fetchTweetsTask,
		tasks.filterTweetsTask,
		Math.random() < config.quoteRate ? tasks.quoteTask : tasks.retweetTask
	], function (err) {
		if (err) {
			console.error(err);
			setTimeout(botLoop, config.errorDelay);
		} else {
			setTimeout(botLoop, config.successDelay);
		}
	});
};

setTimeout(() => botLoop(), config.startupDelay);
