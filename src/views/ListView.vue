<template>
    <div class="aside">
        <h3 class="aside-header">历史搜索记录</h3>
        <div class="list" v-for="(item,index) in searchHistory.list" :key="index">
            <div class="item">{{ item.info }}</div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from "vue" 

const searchHistory = reactive({
    list:[]
})

</script>

<style lang="less" scoped>

.aside{
    width: 100%;
    height: 100%;
    background-color: rgb(32,33,35);
    .aside-header{
        text-align: center;
        padding: 10px;
    }
    .list{
        padding: 10px;
        .item{
            width: 100%;
            height: 40px;
            overflow: hidden;
            line-height: 40px;
            padding-left: 10px;
            box-sizing: border-box;
            background-color: rgb(52, 53, 65);
            border-radius: 5px;
        }
    }
}

</style>