import { http } from '@/utils/http/axios';

/**
 * @description: 角色列表
 */
export function getRoleList(params) {
  let url = '/admin/user/role/list'
  return http.request({
    method: 'GET',
    url
  });
}
