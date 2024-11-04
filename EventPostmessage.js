/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2024-10-24 10:52:08
 * @LastEditors: ankeji
 * @LastEditTime: 2024-10-29 09:56:39
 */
// EventRatel.js
class EventRatel {
    constructor() {
        if (EventRatel.instance) {
            return EventRatel.instance; // 如果实例已存在，直接返回
        }

        this.messageStore = {};
        this.receiveMessage = this.receiveMessage.bind(this);
        window.addEventListener("message", this.receiveMessage, false);

        EventRatel.instance = this; // 保存实例
    }

    sendMessage(eventType, eventName, payload, IframeId, target = '*') {
        window.top.postMessage({ eventType, event: eventName, data: payload, IframeId }, target);
    }

    receiveMessage(event) {
        const { event: eventName, data, eventType, IframeId } = event.data;
        if (eventName) {
            // 发送消息类型
            if (eventType === 'IframeMessage') {
                if (IframeId) {
                    const iframes = document.getElementById(IframeId);
                    if (iframes) {
                        iframes.contentWindow && iframes.contentWindow.postMessage({ event: eventName, data: data }, iframes.src)
                    } else {
                        console.log(`未找到id为${IframeId}对应的iframe`);
                    }
                } else {
                    const iframes = document.getElementsByTagName('iframe');
                    for (let i = 0; i < iframes.length; i++) {
                        const iframe = iframes[i];
                        iframe.contentWindow && iframe.contentWindow.postMessage({ event: eventName, data: data }, iframe.src)
                    }
                }
            }
        }

        if (eventName && this.messageStore[eventName]) {
            this.messageStore[eventName].forEach(callback => callback(data));
        }
    }

    /**
     * @name 消息监听
     * @param {String} eventName 监听的事件名称
     * @param {Function} callback 监听的事件回调
     */
    on(eventName, callback) {
        if (!this.messageStore[eventName]) {
            this.messageStore[eventName] = [];
        }
        this.messageStore[eventName].push(callback);
    }

    /**
     * @name 发送消息通信
     * @param {String} eventName 事件名称 必传
     * @param {Object} payload 消息体 必传
     * @param {String} IframeId iframe的id，需要特定发给某个iframe，非必传
     */
    emit(eventName, payload, IframeId = '') {
        this.sendMessage('IframeMessage', eventName, payload, IframeId);
    }

    /**
     * @name 只给主框架发送消息，不推送给iframe子页面
     * @param {String} eventName 事件名称 必传
     * @param {Object} payload 消息体 必传
     */
    emitParent(eventName, payload) {
        this.sendMessage('ParentMessage', eventName, payload);
    }

    /**
     * @name 销毁监听事件
     * @param {String} eventName 事件名称 必传
     * @param {Function} callback 事件回调
     * @returns 
     */
    off(eventName, callback) {
        if (!this.messageStore[eventName]) return;
        this.messageStore[eventName] = this.messageStore[eventName].filter(cb => cb !== callback);
    }

    static getInstance() {
        return EventRatel.instance || (EventRatel.instance = new EventRatel());
    }
}


// UMD 模式
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // 浏览器全局
        root.EventRatel = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    return EventRatel;
}));
