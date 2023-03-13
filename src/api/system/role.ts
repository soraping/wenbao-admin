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
