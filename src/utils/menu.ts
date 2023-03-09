import { filter } from 'lodash'
/**
 * 网络请求menu
 */
export interface IMenu {
    id: number
    name: string
    icon: string
    key: string
    status: number
    parent: number
    type: number
    permission: string
    path: string
    redirect: string
    component: string
    sort: number
}

/**
 * 系统转换菜单数
 */
interface IMenuTree {
    id: number
    label: string
    path: string
    name: string
    subtitle: string,
    key: string
    component: string
    auth: string
    type: number
    parent: number
    icon: string
    meta: {
        label: string
        title: string
        icon: string
        permission: string
    }
    children: Partial<IMenuTree>[]
}

interface IConverFunc {
    (menus: Partial<IMenu>[]): Partial<IMenuTree>[]
}

export class MenuTree {
    constructor(private allMenus: Partial<IMenu>[]){

    }

    private converMenu(menu: Partial<IMenu>): Partial<IMenuTree>{
        return {
            id: menu.id,
            label: menu.name,
            type: menu.type,
            key: menu.key,
            path: menu.path,
            auth: menu.permission,
            component: menu.component,
            parent: menu.parent,
            children: this.getChildren(menu.id),
            icon: menu.icon,
            meta: {
                label: menu.name as string,
                title: menu.name as string,
                icon: menu.icon as string,
                permission: menu.permission as string
            }
        }
    }

    private getChildren(parentId?: number){
        return filter(this.allMenus, (menu) => menu.parent == parentId)
    }

    /**
     * 菜单数据类型转换
     */
    private buildTree(menus: Partial<IMenu>[]){
        let that = this
        return menus.map( menu => {
            let converData = that.converMenu(menu)
            if(converData.children && converData.children.length > 0){
                converData.children = that.buildTree(converData.children)
            }else{
                converData.children = null as any
            }
            return converData
        } )
    }

    genMenuTree(){
        let parentMenus = filter(this.allMenus, (menu) => !menu.parent)
        return this.buildTree(parentMenus)
    }


}

