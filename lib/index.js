const JueJin = require('./juejin')
const schedule = require('node-schedule');
const {getRandomInt} = require('../utils')

const jueJin = new JueJin()

let rule = new schedule.RecurrenceRule();
rule.hour = 7;
rule.minute = getRandomInt(0, 59);
rule.second = getRandomInt(0, 59);

// 启动任务
 schedule.scheduleJob(rule, () => {
     jueJin.init()
 });










