import request from '@/utils/request'


// 获取品牌列表接口 GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

//  处理添加品牌 POST /admin/product/baseTrademark/save
// 修改品牌 PUT /admin/product/baseTrademark/update
export const reqAddorUpdateTradeMark = (trademark)=>{
    if(trademark.id){
       return request({url:'/admin/product/baseTrademark/update',method:'put',data:trademark})
    }else{
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:trademark}) 
    }
}

// 删除品牌 DELETE /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})