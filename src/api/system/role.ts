import { http } from '@/utils/http/axios';
import { setObjToUrlParams } from '@/utils/urlUtils'

/**
 * @description: 角色列表
 */
export function getRoleList(params) {
  let url = setObjToUrlParams('/admin/user/role/list', params)
  return http.request({
    method: 'GET',
    url
  });
}

/**
 * 新增角色
 * @param params 
 * @returns 
 */
export function addRole<T>(params:T) {
  return http.request({
    method: 'POST',
    url: '/admin/user/role/add',
    params
  });
}
