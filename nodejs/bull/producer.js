
const Bull = require('bull');
const moment = require('moment');
const config = require('./config');

class Producer {
    constructor() {
        this.queue = new Bull(config.queueName);
        this.count = 0;
    }

    async start() {
        let self = this;
        setInterval(async () => {
            this.count++;
            await self.queue.add(config.messageName, self.count, { removeOnComplelete: true });
        }, 5000);

        await this.repeatJob();
    }

    async repeatJob() {
        let startDate = moment().second(0).millisecond(0).valueOf();
        let endDate = moment(startDate).add(5, 'minutes').valueOf();
        await this.queue.add(config.repeatJobId, {time: moment().valueOf()}, { repeat: { cron: '* * * * *', startDate, endDate},removeOnComplete:true ,priority: 1})
        console.log('startDate %s endDate %s', startDate, endDate);
        let repeatJobsCount = await this.queue.getRepeatableCount();
        console.log('repeatJobsCount ', repeatJobsCount);
    }
}

module.exports = new Producer();