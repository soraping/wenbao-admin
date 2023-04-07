import { defineStore } from 'pinia';
import { store } from '@/store';


interface IMember {
    id: number
    username: string
    age: number
    mobile: string
    card_id: string
    inviter_user_id: string
    invite_owner_code: string
}

/**
 * 会员相关
 */
export const useMemberStore = defineStore({
    id: 'app-member',
    state: (): IMember => ({
        id: 0,
        username: "",
        age: 0,
        mobile: '',
        card_id: '',
        invite_owner_code: '',
        inviter_user_id: ''
    }),
    getters: {

    },
    actions: {
        
    }

  });
  
  // Need to be used outside the setup
  export function useUserStoreWidthOut() {
    return useMemberStore(store);
  }