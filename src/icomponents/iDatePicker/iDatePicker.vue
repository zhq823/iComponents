<template>
	<section class="container">
        <mt-popup v-model="isVisible" position="bottom" popup-transition="popup-fade" class="popup_container">
            <div class="popup-header">
                <div class="left" @click="isVisible = false">取消</div>
                <div class="right" @click="onOk(); isVisible = false">确定</div>
            </div>
            <mt-picker ref="datePicker" :slots="slots" @change="onValuesChange" :visibleItemCount="7"></mt-picker>
        </mt-popup>
	</section>
</template>

<script>
    import { service } from './service';
    // import dateControl from './dateControl';
	export default {
        // name: 'idate-picker',
        // extends: dateControl,
		props: {
			delayDay: {
				type: Number,
				default: 0
            },
            dayList: {
				type: Array,
				default: function() { return [] }
            },
            hourList: {
				type: Array,
				default: function() { return [] }
            },
            minuteList: {
				type: Array,
				default: function() { return [] }
            }
		},
		data() {
			return {
                slots: [],
                slotsList: [],
                isVisible: false,
                days: [],
                temp: []
			}
        },
		created() {
            // this.dateIsAble('2019-5-6', 5).then(res => {
            //     console.log('dateIsAble=', res);
            // });
		},
		methods: {
            /**
             * 查询时间
             */
            getDateConfig(picker, values = [], flag) {
                this.days = [];

                const params = {
                    calyear: values[0] || new Date().getFullYear(),
                    calmonth: values[1] || new Date().getMonth() + 1
                }
                
                service.getDateConfig(params).then(res => {
                    if(res.success) {
                        this.isVisible = true;
                        res.content.filter(item => !item.isHoliday).map(item => {
                            if(item.calDay < 10) {
                                this.days.push('0' + item.calDay);
                            }else {
                                this.days.push('' + item.calDay);
                            }
                        });

                        // for(let i = 1; i < 31; i++) {
                        //     if(i < 10) {
                        //         this.days.push('0' + i);
                        //     }else {
                        //         this.days.push('' + i);
                        //     }
                        // }

                        if(flag == 'year') {
                            picker.setSlotValues(2, this.resetDay(values[0]==new Date().getFullYear() && values[1]==new Date().getMonth()+1, picker));
                        }else if(flag == 'month') {
                            picker.setSlotValues(2, this.resetDay(values[1]==new Date().getMonth()+1, picker));
                        }else{
                            this.resetDatePicker();
                        }
                    }
                });

            },
            /**
             * 设置/重置当前年
             */
            resetYear() {
                const year = new Date().getFullYear();
                this.temp[0] = year;

                return [year, year + 1]
            },
            /**
             * 设置/重置当前月
             */
            resetMonth(year = true, picker = undefined) {
                let months = [];
                const nowMonth = new Date().getMonth();

                for(let i = 1; i < 13; i++) {
                    if(i < 10) {
                        months.push('0' + i);
                    }else {
                        months.push('' + i);
                    }
                }

                if(year) {
                    months = months.filter((item, index) => index >= nowMonth);
                }

                picker && picker.setSlotValue(1, months[0]);

                !picker && (this.temp[1] = months[0]);
                // console.log('months=', months);
                return months;
            },
            /**
             * 设置/重置当前天
             */
            resetDay(month = true, picker = undefined) {
                // console.log('resetDay=', month);
                const nowDay = new Date().getDate();

                if(month) {
                    this.days = this.days.filter(item => Number(item) >= nowDay);
                }

                //延迟工作日
                if((this.delayDay || this.delayDay == 0) && this.temp[0] == new Date().getFullYear() && this.temp[1] == new Date().getMonth() + 1) {
                    this.days = this.days.filter((item, index) => index > this.delayDay);
                }

                picker && picker.setSlotValue(2, this.days[0]);
                !picker && (this.temp[2] = this.days[0]);

                // console.log(this.days);
                return this.days;
            },
            /**
             * 设置/重置当前小时
             */
            resetHour(/**day = true, */ picker = undefined) {
                let hours = [];
                // const nowHour = new Date().getHours();

                for(let i = 0; i < 24; i++) {
                    if(i < 10) {
                        hours.push('0' + i);
                    }else {
                        hours.push('' + i);
                    }
                }

                // if(day) {
                //     hours = hours.filter(item => Number(item) >= nowHour);
                // }

                // picker && picker.setSlotValue(3, hours[0]);

                !picker && (this.temp[3] = hours[0]);
                // console.log('hours=', hours);
                return hours;
            },
            /**
             * 设置/重置当前分钟
             */
            resetMinute(/**hour = true, */ picker = undefined) {
                let minutes = this.minuteList || [];
                // const nowMinute = new Date().getMinutes();

                if(minutes.length == 0) {
                    for(let i = 0; i < 60; i++) {
                        if(i < 10) {
                            minutes.push('0' + i);
                        }else {
                            minutes.push('' + i);
                        }
                    }
                }

                // if(hour) {
                //     minutes = minutes.filter(item => Number(item) >= nowMinute);
                // }

                // picker && picker.setSlotValue(4, minutes[0]);

                !picker && (this.temp[4] = minutes[0]);
                // console.log('minutes=', minutes);
                return minutes.length ? minutes : ['00'];
            },
            /**
             * 重置时间组件
             */
            resetDatePicker() {
                this.slots = [{
                        flex: 1,
                        values: this.resetYear(),
                        defaultIndex: 0,
                        className: 'slot1',
                        textAlign: 'right'
                    }, {
                        flex: 1,
                        values: this.resetMonth(),
                        defaultIndex: 0,
                        className: 'slot2',
                        textAlign: 'center'
                    }, {
                        flex: 1,
                        values: this.resetDay(),
                        defaultIndex: 0,
                        className: 'slot3',
                        textAlign: 'center'
                    }, {
                        flex: 1,
                        values: this.resetHour(),
                        defaultIndex: 0,
                        className: 'slot4',
                        textAlign: 'center'
                    }, {
                        flex: 1,
                        values: this.resetMinute(),
                        defaultIndex: 0,
                        className: 'slot5',
                        textAlign: 'left'
                    }]

                
            },
			/**
             * 时间选择变更回调
             */
            onValuesChange(picker, values) {
                // console.log('picker=', picker);
                // console.log('new value: ', values);
                // console.log('old value: ', this.temp);
                if(this.temp[0]) {
                    if(this.temp[0] != values[0]) {
                        // console.log('year');
                        picker.setSlotValues(1, this.resetMonth(values[0]==new Date().getFullYear(), picker));
                        // picker.setSlotValues(3, this.resetHour(values[0]==new Date().getFullYear() && values[1]==new Date().getMonth() + 1 && values[2]==new Date().getDate(), picker));
                        // picker.setSlotValues(4, this.resetMinute(values[0]==new Date().getFullYear() && values[1]==new Date().getMonth() + 1 && values[2]==new Date().getDate() && values[3]==new Date().getHours(), picker));
                        // this.getDateConfig(picker, values, 'year');
                    }else if(this.temp[1] != values[1]) {
                        // console.log('month');
                        // picker.setSlotValues(3, this.resetHour(values[1]==(new Date().getMonth() + 1) && values[2]==new Date().getDate(), picker));
                        // picker.setSlotValues(4, this.resetMinute(values[1]==(new Date().getMonth() + 1) && values[2]==new Date().getDate() && values[3]==new Date().getHours(), picker));
                        this.getDateConfig(picker, values, 'month');
                    }
                    // else if(this.temp[2] != values[2]) {
                    //     // console.log('day');
                    //     picker.setSlotValues(3, this.resetHour(values[2]==new Date().getDate(), picker));
                    //     picker.setSlotValues(4, this.resetMinute(values[2]==new Date().getDate() && values[3]==new Date().getHours(), picker));
                    // }else if(this.temp[3] != values[3]) {
                    //     // console.log('hour');
                    //     picker.setSlotValues(4, this.resetMinute(values[3]==new Date().getHours(), picker));
                    // }else if(this.temp[4] != values[4]) {
                    //     // console.log('minute');
                    //     picker.setSlotValues(4, this.resetMinute(values[3]==new Date().getHours()));
                    // }
                }
                this.temp = values.map(item => item);
            },
            onOk() {
                let values = this.$refs.datePicker.$children.filter(child => child.currentValue !== undefined).map(child => child.currentValue);
                // let date = `${values[0]}-${values[1]}-${values[2]} ${values[3]}:${values[4]}`;
                let date = new Date(values[0], values[1], values[2], values[3], values[4]);
                // console.log('date==', date);
                this.$emit('callback', date);
            }
		}
	}
</script>

<style scoped="scoped" lang="scss">
.container{
    .popup_container{
        width: 100vw;
        .popup-header {
            width: 100vw;
            height: .4rem;
            border-bottom: .01rem solid #eee;
            position: relative;
            div {
                width: 40vw;
                text-align: center;
                line-height: .4rem;
                color: #1672FB;

                &.left {
                    position: absolute;
                    left: 0;
                }
                &.right {
                    position: absolute;
                    right: 0;
                }
            }
        }
    }
}
</style>