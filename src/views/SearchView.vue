<template>
    <div class="search-container">
        <input :disabled="store.showStopFlag" v-model="message" v-myfocus="true" @keyup.enter="sendMessage" type="text" placeholder="说出你的问题">
        <button @click="sendMessage" >发送</button>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useShowFlagStore } from "../stores/showFlag"

const message = ref(null)
const emit = defineEmits(["onMessageEvent"])
const store = useShowFlagStore()

const sendMessage = () =>{
    emit("onMessageEvent",message.value)
    message.value = ""
}

</script>

<style lang="less" scoped>

.search-container{
    position: relative;
    width: 100%;
    padding: 0 20%;
    box-sizing: border-box;
    input{
        width: 100%;
        height: 60px;
        border: 0;
        border-radius: 10px;
        background: rgb(64,65,79);
        outline: none;
        padding-left: 20px;
        color: #fff;
        font-size: 20px;
    }
    button{
        position: absolute;
        right: 20%;
        top: 10px;
        width: 40px;
        height: 40px;
        background: rgb(25,195,125);
        border: 0;
        color: #fff;
        border-radius: 10px;
        font-size: 15px;
    }
}

</style>