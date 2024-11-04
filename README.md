# EventRatel

#### 介绍
一个微前端使用的postmessage消息透传库

#### 软件架构
软件架构说明


#### 安装教程

1.  在 Node.js 中使用 require

    ```
    const EventRatel = require('./EventRatel');
    const eventRatel = EventRatel.getInstance();
    ```

2.  在 ES6 模块中使用 import

    ```
    import EventRatel from './EventRatel';
    const eventRatel = EventRatel.getInstance();
    ```
3.  在 HTML 页面中使用 ``<script>``标签

    ```
    <script src="EventRatel.js"></script>
    <script>
        const eventRatel = EventRatel.getInstance();
        eventRatel.on('someEvent', (data) => {
            console.log('Received:', data);
        });
        eventRatel.emit('someEvent', { message: 'Hello, World!' });
    </script>
    ```

#### 使用说明

1.  发送透传消息
    ```
    eventRatel.emit('someEvent', data)
    eventRatel.emit('someEvent', data, 'iframeId') //指定iframe监听
    eventRatel.emitParent('someEvent', data) // 只给父级窗口发送消息
    eventRatel.on('someEvent', (data) => {
        console.log('Received:', data);
    })
    eventRatel.off('someEvent')

    ```
    这里的`off`事件，需要把`on`监听的方法单独抽离出来，跟`vue`的`bus`监听是一样的用法，例如：
    ```
    created() {
        eventRatel.on("someEvent", this.handleMessage);
    },
    methods: {
        handleMessage(data) {
            console.log(data);
        },
    },
    beforeDestroy() {
        eventRatel.off("someEvent", this.handleMessage);
    },
    ```

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
