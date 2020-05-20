
import { service } from './service';

export default {
    data() {
        return {

        }
    },
    created() {

    },
    methods: {
        /**
         * 查询时间是否可用
         */
        async dateIsAble(date, delayDay) {
            const params = {
                calyear: new Date().getFullYear(),
                calmonth: new Date().getMonth() + 1
            }
            const res = await service.getDateConfig(params)
            if(res.success) {
                let count = 0;
                let lastDate;
                res.content.forEach((item, index) => {
                    if(!item.isHoliday) {
                        count++;
                    }
                    if(count == delayDay) {
                        lastDate = res.content[index+1].calDate;
                        count++;
                    }
                });
                return new Date(date) < new Date(lastDate);
            }
        }
    }
}