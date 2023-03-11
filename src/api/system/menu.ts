import { http } from '@/utils/http/axios';

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return http.request({
    url: '/admin/user/owner/menu/list',
    method: 'GET',
  });
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return http.request({
    url: '/admin/user/all/menu/list',
    method: 'GET',
    params,
  });
}

/**
 * 新增菜单
 * @param params 
 * @returns 
 */
export function addMenu<T>(params: T){
  return http.request({
    url: '/admin/user/menu/add',
    method: 'POST',
    params
  })
}

/**
 * 删除菜单
 * @param id 
 * @returns 
 */
export function delMenu(id){
  return http.request({
    url: `/admin/user/menu/del/${id}`,
    method: 'DELETE'
  })
}
