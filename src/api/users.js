import { http } from "@/utils"

/**
 * @description 获取用户列表
 * @param {*} email 
 * @param {*} userName 
 * @returns 
 */
export function getUserList(email, userName) {

    return http.get(`/api/admin/users?email=${email}&userName=${userName}`)
}

/**
  * 获取 总用户数 
  * 获取 今日新增用户
  */
export function getUserCount() {

    return http.get('/api/admin/user-count')
}