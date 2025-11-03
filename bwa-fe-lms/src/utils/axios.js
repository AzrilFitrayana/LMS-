import axios from 'axios'

const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 3000
})

export default apiInstance