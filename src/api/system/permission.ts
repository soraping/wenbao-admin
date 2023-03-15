import { http } from '@/utils/http/axios';

/**
 * 权限列表
 * @returns 
 */
 export function getPermissionList(){
  return http.request({
    method: 'GET',
    url: '/admin/user/permission/list'
  });
}

/**
 * 查询角色绑定的权限
 * @param role_id 
 */
export function getPermissionByRole(role_id: number){
  return http.request({
    method: 'GET',
    url: `/admin/user/permission/role/${role_id}`
  });
}

/**
 * 根据个人角色设置权限
 * @param params 
 * @returns 
 */
export function modifyPermissionByRole(params){
  return http.request({
    method: 'POST',
    url: `/admin/user/permission-role/modify`,
    params
  });
}
