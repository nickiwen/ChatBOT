<template>
    <div class="chat-container">
        <!-- 侧边栏适配 -->
        <!-- <div class="left">
            <ListView />
        </div> -->
        <div class="right">
            <div class="content" ref="scrollRef">
                <UserInfo />
                <div v-for="(item, index) in QAList.list" :key="index">
                    <div class="q-info">
                        <i class="q-info-icon">ME</i>
                        <div class="q-info-content">{{ item.q }}</div>
                    </div>
                    <div class="a-info">
                        <i class="a-info-icon">AI</i>
                        <div class="a-info-content" style="white-space: pre-wrap;">
                            <p class="text" v-if="showLoading && QAList.list.length - 1 == index">请等待<span
                                    class="dot">...</span></p>{{ item.message }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="stop" v-show="store.showStopFlag"><span @click="stopHandler">停止</span></div>
            <div class="search">
                <SearchView @onMessageEvent="getMessageHandler" />
            </div>
        </div>
    </div>
</template>

<script setup>
import UserInfo from "./UserInfo.vue"
import SearchView from "./SearchView.vue";
import ListView from './ListView.vue';
import { reactive, ref, onMounted } from "vue"
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useShowFlagStore } from "../stores/showFlag"


let scrollRef = ref(null);   // 内容超出高度，自动滚动
const controller = ref(null); // 强制停止EventStream对象
let showLoading = ref(false) // loading显示逻辑
const store = useShowFlagStore() // 停止按钮显示逻辑


// 问答数据源
const QAList = reactive({
    list: []
})

// 刷新重置信息
onMounted(() => {
    QAList.list = JSON.parse(sessionStorage.getItem("info")) || []
    setTimeout(() => {
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
    }, 20);
})

const getMessageHandler = (data) => {
    // loading显示逻辑
    showLoading.value = true
    // 停止按钮显示逻辑
    store.showStopFlag = true
    // 问答显示提问
    QAList.list.push({
        q: data,
        message: ""
    })
    // 获取历史对话信息
    let currentQA = JSON.parse(sessionStorage.getItem("info")) || []
    // 合并历史数据，上下文
    let currentParams = []
    for (var i = 0; i < currentQA.length; i++) {
        currentParams.push({
            "role": "user",
            "content": currentQA[i].q
        })
        currentParams.push({
            "role": "assistant",
            "content": currentQA[i].message
        })
    }
    currentParams.push({ "role": "user", "content": data })
    // 当前数据累加
    let chunk = "";
    // 流的方式逐字追加
    // 强制停止EventStream对象
    controller.value = new AbortController();
    // http://itbaizhann.natapp1.cc/v1/chat/completions
    fetchEventSource('http://itbaizhann.natapp1.cc/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
            "model": "chatglm-6b",
            "messages": currentParams,
            "stream": true
        }),
        signal: controller.value.signal,
        // 响应数据
        onmessage(ev) {
            if (ev.data != "[DONE]") {
                if (JSON.parse(ev.data).choices[0].delta.content) {
                    chunk += JSON.parse(ev.data).choices[0].delta.content
                    if (chunk.length > 0) {
                        showLoading.value = false
                    }
                }
                QAList.list.pop()
                QAList.list.push({
                    q: data,
                    message: chunk
                })
                // 内容超出高度，自动滚动
                setTimeout(() => {
                    scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
                }, 20);
            } else {
                store.showStopFlag = false;
                controller.value.abort();
                sessionStorage.setItem("info", JSON.stringify(QAList.list))
            }
        },
        onclose() {
            controller.value.abort();
            store.showStopFlag = false;
        },
        onerror(error) {
            alert("当前访问人数过多，请稍后再试")
            controller.value.abort();
            store.showStopFlag = false;
        }
    });
}


const stopHandler = () => {
    controller.value.abort();
    store.showStopFlag = false;
    sessionStorage.setItem("info", JSON.stringify(QAList.list))
}

</script>

<style lang="less" scoped>
.chat-container {
    width: 100%;
    height: 100%;
    background-color: rgb(52, 53, 65);
    color: #fff;

    // .left {
    //     // 侧边栏适配
    //     width: 15%;
    //     height: 100%;
    //     float: left;
    // }


    @media screen and (max-width: 768px) {
        .content .q-info {
            padding: 30px 5%;
        }

        .content .a-info {
            padding: 30px 5%;
        }
    }

    @media screen and (min-width: 768px) {
        .content .q-info {
            padding: 30px 20%;
        }

        .content .a-info {
            padding: 30px 20%;
        }
    }

    .right {
        float: left;
        // width: 85%; // 侧边栏适配
        width: 100%;
        height: 100%;
        position: relative;
        text-align: left;

        .content {
            width: 100%;
            height: 80%;
            overflow-x: hidden;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 10px;
                height: 6px;
            }

            &::-webkit-scrollbar-button {
                display: none;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }

            &::-webkit-scrollbar-track-piece {
                background-color: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.5);
                cursor: pointer;
                border-radius: 4px;
            }

            &::-webkit-scrollbar-corner {
                display: none;
            }

            &::-webkit-resizer {
                display: none;
            }

            .q-info {
                // padding: 30px 20%;
                overflow: hidden;
                clear: both;

                .q-info-icon {
                    display: block;
                    width: 20px;
                    height: 20px;
                    background-color: rgb(51, 152, 218);
                    border-radius: 5px;
                    font-style: normal;
                    padding: 10px;
                    text-align: center;
                    float: left;
                }

                .q-info-content {
                    padding-left: 60px;
                    padding-top: 5px;
                }
            }

            .a-info {
                // padding: 30px 20%;
                background-color: rgb(68, 70, 84);
                overflow: hidden;
                clear: both;

                .a-info-icon {
                    display: block;
                    width: 20px;
                    height: 20px;
                    background-color: rgb(25, 195, 125);
                    border-radius: 5px;
                    font-style: normal;
                    padding: 10px;
                    text-align: center;
                    float: left;
                }

                .a-info-content {
                    padding-left: 60px;
                    padding-top: 5px;

                    // 等待三个点
                    .span {
                        display: inline-block;
                        text-align: center;
                        margin: 0 auto;
                        overflow: hidden;
                        height: 1em;
                        line-height: 1em;
                        vertical-align: -.25em;
                    }

                    .span::before {
                        display: block;
                        content: '...\A..\A.';
                        white-space: pre-wrap;
                        animation: dot 3s infinite step-start both;
                    }

                    @keyframes dot {
                        33% {
                            transform: translateY(-2em);
                        }

                        66% {
                            transform: translateY(-1em);
                        }
                    }
                }
            }
        }

        .stop {
            text-align: center;
            margin-top: 40px;

            span {
                width: 100px;
                height: 30px;
                border: 1px solid rgba(255, 255, 255, 0.5);
                color: rgba(255, 255, 255, 0.8);
                padding: 10px 40px;
                border-radius: 5px;
                cursor: pointer;
            }

            span:hover {
                border: 1px solid rgba(255, 255, 255, 0.7);
                color: rgba(255, 255, 255, 1);
            }
        }

        .search {
            width: 70%;
            position: absolute;
            bottom: 5%;
            margin-left: 15%;
        }
    }
}
</style>


