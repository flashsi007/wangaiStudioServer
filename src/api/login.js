import { http } from "@/utils"

/**
 * @description 登录
 * @param {*} data 
 * @returns 
 */
export function login(data) {
    return http.post("/api/admin/login", data)
}