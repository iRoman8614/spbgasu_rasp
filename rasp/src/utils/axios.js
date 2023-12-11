import axios from "axios"

const instance = axios.create({
    baseURL: "rasp.spbgasu.ru/api/v1"
})

export default instance