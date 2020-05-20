
    // function isValidDate(DateStr) {
    //     if (!DateStr) return false;
    //     var sDate = DateStr.replace(/(^\s+|\s+$)/g, '')
    //     if (sDate === '') {
    //         return true;
    //     }
    //     var s = sDate.replace(/[\d]{ 4,4 }[\-/]{1}[\d]{1,2}[\-/]{1}[\d]{1,2}/g, '')
    //     if (s === '') {
    //         var t = new Date(sDate.replace(/\-/g, '/'))
    //         var ar = sDate.split(/[-/:]/)
    //         if (ar[0] !== t.getYear() || ar[1] !== t.getMonth() + 1 || ar[2] !== t.getDate()) {
    //             return false
    //         }
    //     } else {
    //         return false
    //     }
    //     return true
    // }

    function isObject(o) {
        var gettype = Object.prototype.toString
        return gettype.call(o) === '[object Object]'
    }

    function getItsVal(object, key) {
        if (!key)
            return null
        var val = null
        if (key && typeof(key) === "function") {
            val = key(object)
        } else {
            val = getPropertyValue(object, key)
        }
        return val
    }

    function getPropertyValue(object, key) {
        try {
            var keys = key.split('.')
            if (keys.length == 1) {
                return object[key]
            }
            var nextKeys = key.substring(key.indexOf('.') + 1)
            var nextObject = object[keys[0]]
            return getPropertyValue(nextObject, nextKeys)
        } catch (e) {
            return null
        }
    }

    function isEmpty(val) {
        // if (isValidDate(val)) {
        //     return false
        // }
        if (isObject(val)) {
            return Object.keys(val).length === 0
        }
        return !val
    }

    function isValid(val, regExp) {
        console.log(val)
        var pattern = new RegExp(regExp, 'im')
        console.log(pattern.test(val))
        return !pattern.test(val);
    }

    // function dateTransform(date) {
    //     // var date=new Date(date).getTime();
    //     var curdate = new Date(typeof(date) == "string" ? date.replace(/-/g, '/') : date);
    //     return curdate.getTime();
    // }
    var validator = function(model, validatorConfig) {
        for (var key in validatorConfig) {

            var rule = validatorConfig[key];
            var description = typeof(rule.description) == "function" ? rule.description(model) : rule.description;
            var preCondition = rule.preCondition;

            var val = getItsVal(model, rule.getVal || key)

            // required
            if (
                (preCondition == undefined || (preCondition && preCondition(model))) &&
                rule.required && isEmpty(val)) {
                // toast(description)
                // return false;
                return {
                    status: false,
                    msg: description
                }                 
            }
            // regExp
            if (
                (preCondition == undefined || (preCondition && preCondition(model))) &&
                rule.regExp && isValid(val, rule.regExp)) {
                // toast(rule.regExpMsg)
                // return false;
                return {
                    status: false,
                    msg: rule.regExpMsg
                }                
            }
            //expression
            if (
                (preCondition == undefined || (preCondition && preCondition(model))) &&
                rule.expression && rule.expression(model)) {
                // toast(rule.expressionMsg)
                // return false;
                return {
                    status: false,
                    msg: rule.expressionMsg
                }
            }                                                                     
        }
        return {
            status: true
        }
    }

export default validator