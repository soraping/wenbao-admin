import { http } from '@/utils/http/axios';
import { setObjToUrlParams } from '@/utils/urlUtils'


/**
 * 会员列表
 * @param params 
 * @returns 
 */
export function memberListApi(params){
  return http.request({
    url: setObjToUrlParams('/admin/user/member/list', params),
    method: 'GET'
  })
}

/**
 * 添加会员
 * @param params 
 * @returns 
 */
export function addMemberApi(params){
  return http.request({
    url: '/admin/user/member/add',
    method: 'POST',
    params
  })
}
