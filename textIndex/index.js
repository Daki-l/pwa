(function () {
let applicationServerPublicKey = 'BK9EXouvCE0erXBRwj6gn1PCNc7tLb5PHlnPwUhbRzJT6_eveZrPYEsAPCKU2jwta8es_jSwpGYbDsvD04b7nvQ';
let swRegistration = null;
var btnAction = { refresh: $('.header-btn'), dingyue: $('.today-top') };
var selectCity = $('#selectCityToAdd');
var card = {
    city: $('.today-city'),
    wendu: $('.wendu'),
    fengxiang: $('.fengxiang'),
    fengli: $('.fengli'),
    type: $('.type'),
    high: $('.high'),
    low: $('.low'),
    ganmao: $('.ganmao')
};

// 绑定事件
selectCity.change(e => {refresh()});
btnAction.refresh.click(e => { refresh()});
btnAction.dingyue.click(e => { subscribeUser(); });

// 对公钥进行转码 转成一个数组
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function initial() {
    setMessage(initData);
}

function setMessage(data) {
    card.city.text(data.city);
    card.wendu.text(data.wendu);
    card.ganmao.text(data.ganmao);

    card.fengxiang.text(data.forecast[0].fengxiang);
    card.fengli.text(data.forecast[0].fengli);
    card.type.text(data.forecast[0].type);
    card.high.text(data.forecast[0].high);
    card.low.text(data.forecast[0].low);

    data.forecast.map((e, k) => {
        if (k > 0) {
            $(`.otherday${k}-date`).text(e.date);
            $(`.otherday${k}-type`).text(e.type);
            $(`.otherday${k}-high`).text(e.high);
            $(`.otherday${k}-low`).text(e.low);
        }
    })
}

// 发送推送请求
function subscribeUser() {
    console.log('调用订阅')
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    var options = {
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    };
    // 调用pushManager的subscribe方法订阅了一个推送服务
    swRegistration.pushManager.subscribe(options).then(subscription => {
        console.log('用户成功订阅', subscription);
        // updataMessageFromSubscription(subscription);
        // // 更改是否订阅变量状态，并调用更新按钮function
        // isSubscribed = true;
        // updateBtn();
    }).catch(err => {
        console.log('用户没有订阅', err);
    })
}

function refresh() {
    let city = selectCity.val();
    $.ajax({
        type: 'get',
        url: `https://www.apiopen.top/weatherApi?city=${city}`
    }).then(res => {
        setMessage(res.data);
    })
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        console.log('Service Worker Registered', reg);
        swRegistration = reg;
        initial();
    }).catch(err => console.log(err));
}

var initData = {
    yesterday: {
        date: "8日星期五",
        high: "高温 12℃",
        fx: "东风",
        low: "低温 6℃",
        fl: "<![CDATA[<3级]]>",
        type: "阴"
    },
    city: "上海",
    aqi: null,
    forecast: [
        {
            date: "9日星期六",
            high: "高温 13℃",
            fengli: "<![CDATA[<3级]]>",
            low: "低温 8℃",
            fengxiang: "北风",
            type: "小雨"
        },
        {
            date: "10日星期天",
            high: "高温 13℃",
            fengli: "<![CDATA[<3级]]>",
            low: "低温 7℃",
            fengxiang: "西北风",
            type: "多云"
        },
        {
            date: "11日星期一",
            high: "高温 18℃",
            fengli: "<![CDATA[<3级]]>",
            low: "低温 7℃",
            fengxiang: "西风",
            type: "多云"
        },
        {
            date: "12日星期二",
            high: "高温 17℃",
            fengli: "<![CDATA[4-5级]]>",
            low: "低温 8℃",
            fengxiang: "西风",
            type: "晴"
        },
        {
            date: "13日星期三",
            high: "高温 16℃",
            fengli: "<![CDATA[<3级]]>",
            low: "低温 9℃",
            fengxiang: "东风",
            type: "多云"
        }
    ],
    ganmao: "天冷空气湿度大，易发生感冒，请注意适当增加衣服，加强自我防护避免感冒。",
    wendu: "10"
};
})()