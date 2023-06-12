import axios from "../utils/request"
import base from "./base"

const api = {
    getChat(params){
        return axios.post(base.baseURL + base.chat,params)
    }
}

export default api