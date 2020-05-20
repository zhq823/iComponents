import accounting from 'accounting';

const formatMoney = (val,num=2)=>{
	if(val == null){
		return null;
	}else{
		return accounting.formatMoney(val, "￥", num); // €4.999,99
	}
}

export { formatMoney as default }
