const JueJin = require('./juejin')
const schedule = require('node-schedule');

const jueJin = new JueJin()

let rule = new schedule.RecurrenceRule();
rule.hour = 7;
rule.minute = 0;
rule.second = 0;

// 启动任务
 schedule.scheduleJob(rule, () => {
     jueJin.init()
 });







