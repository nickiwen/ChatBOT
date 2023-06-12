import { defineStore } from "pinia"

export const useShowFlagStore = defineStore("showStopFlag", {
    state: () => {
        return {
            showStopFlag: false
        }
    }
})