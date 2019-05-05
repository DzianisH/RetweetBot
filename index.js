const waterfall = require('async/waterfall');
const tasks = require('./tasks');

const ERROR_TIMEOUT = 70 * 1000;
const SUCCESS_TIMEOUT = 37 * 60 * 1000;

const botLoop = () => {
	waterfall([
		tasks.loginTask,
		tasks.fetchTweetsTask,
		tasks.filterTweetsTask,
		tasks.retweetTask
	], function (err) {
		if (err) {
			console.error(err);
			setTimeout(botLoop, ERROR_TIMEOUT);
		} else {
			setTimeout(botLoop, SUCCESS_TIMEOUT);
		}
	});
};

botLoop();

