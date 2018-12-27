const Bull = require('bull');

const config = require('./config')
class Consumer {
    constructor() {
        this.queue = new Bull(config.queueName);
    }

    async start() {
        let self = this;
        self.queue.process(config.messageName, 1, async (job) => {
            return self.doSomething(job);
        });

        self.queue.process(config.repeatJobId, 1, async (job) => {
            return self.repeatJobHander(job);
        });
    }

    repeatJobHander(job) {
        console.log('receive repeatJob data ', job.data, Date.now(), new Date());
        return Promise.resolve();
    }

    doSomething(job) {
        console.log('receive queue data ', job.data, Date.now(), new Date());
        return Promise.resolve();
    }
}

module.exports = new Consumer();