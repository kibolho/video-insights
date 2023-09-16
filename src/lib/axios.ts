import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export const api = axios.create({
  baseURL: 'http://localhost:3000',
})

// const useAxiosAuth = () => {
//   const { data: session } = useSession()
//   useEffect(() => {
//     const requestIntercept = api.interceptors.request.use((config) => {
//       if(!config.headers['Authorization'] && session?.user?.token) {
//         config.headers['Authorization'] = `Bearer ${session?.user?.token}`
//       }
//     })
//   })
// }