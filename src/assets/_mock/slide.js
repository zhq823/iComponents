let Mock = require('mockjs'),
    Random = Mock.Random;

const slideList =  Mock.mock([
        Random.dataImage('300x250', '#000000', '占位一'),
        Random.dataImage('300x250', '#000000', '占位二'),
        Random.dataImage('300x250', '#000000', '占位三'),
        Random.dataImage('300x250', '#000000', '占位四'),
    ])


export default slideList