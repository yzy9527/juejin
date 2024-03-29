const service = require('../api/request')
const userHome = require('os').homedir();
const path = require('path');
const pathExists = require('path-exists').sync;
const dotenv = require('dotenv');
const {getRandomInt, sendEmailFromQQ} = require('../utils/index')


class JueJin {
    constructor() {
        this.luckUserList = null //用户列表
    }

    async init() {
       try {
           this.checkEnv()
           // 查询今日是否已经签到
           const todayStatus = await this.getStatus()
           //签到
           !todayStatus && await this.checkIn()
           const hasFreeCount = await this.checkLottery()

           if (hasFreeCount) {
               // 幸运用户列表
               await this.getLuckUserList()
               // 沾喜点
               await this.getLuckUserPoint()
               //抽奖
               await this.getDraw()
           }
           await this.getCurPoint()

           await this.getCount()
       }catch (e) {
           console.log('e',e)
           sendEmailFromQQ('错误',e.message)
       }
    }

    checkEnv() {
        const dotenvPath = path.resolve(userHome, '.jue_jin');
        if (pathExists(dotenvPath)) {
            dotenv.config({
                path: dotenvPath
            });
        } else {
            throw new Error(`请创建${dotenvPath}文件`)
        }
    }

    async getStatus() {
        const todayStatus = await service.get('/growth_api/v1/get_today_status').catch(e=>{
           throw new Error('登录token失效,请重新设置')
        })
        if (todayStatus) {
            console.log('今日已签到')
        } else {
            console.log('今日未签到')
        }
        return todayStatus
    }

    async checkIn() {
        console.log('开始签到...')
        const result = await service.post('/growth_api/v1/check_in')
        const {incr_point, sum_point} = result
        console.log(`签到获得${incr_point}矿石`)
        // sendEmailFromQQ('签到成功', `签到获得${incr_point}矿石，当前${sum_point}矿石`)
    }

    async checkLottery() {
        console.log('开始检查抽奖次数...')
        const result = await service.get('/growth_api/v1/lottery_config/get')
        console.log('抽奖次数剩余：', result.free_count)
        return result.free_count
    }

    async getLuckUserList() {
        console.log('开始准备粘喜气...')
        const result = await service.post('/growth_api/v1/lottery_history/global_big', {
            page_no: 1,
            page_size: 5,
        })
        this.luckUserList = result.lotteries
    }

    async getLuckUserPoint() {
        const random = getRandomInt(0, 5)
        const result = await service.post('/growth_api/v1/lottery_lucky/dip_lucky', {
            lottery_history_id: this.luckUserList[random].history_id
        })
        console.log('幸运值增加', result.dip_value)
    }

    async getDraw() {
        // _signature
        const result = await service.post('/growth_api/v1/lottery/draw')
        console.log('抽中一个：', result.lottery_name)
        if (!/矿石|Bug/.test(result.lottery_name)) {
            sendEmailFromQQ('抽中一个:', result.lottery_name)
        }
    }

    async getCurPoint() {
        const result = await service.get('/growth_api/v1/get_cur_point')
        console.log('当前矿石数：', result)

    }

    async getCount() {
        const result = await service.get('/growth_api/v1/get_counts')
        const {cont_count, sum_count} = result
        console.log(`连续签到 ${cont_count} 天,累计签到 ${sum_count} 天`)
    }
}

module.exports = JueJin
