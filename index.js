const waterfall = require('async/waterfall');
const tasks = require('./tasks');
const config = require('./config');

const botLoop = () => {
	waterfall([
		tasks.loginTask,
		tasks.fetchTweetsTask,
		tasks.filterTweetsTask,
		tasks.retweetTask
	], function (err) {
		if (err) {
			console.error(err);
			setTimeout(botLoop, config.errorTimeout);
		} else {
			setTimeout(botLoop, config.successTimeout);
		}
	});
};

botLoop();

