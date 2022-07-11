import request from '@/utils/request'


// get /admin/product/list/{page}/{limit} 
export const reqSkuList = (page,limit)=>request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

//get /admin/product/cancelSale/{skuId} 
//get /admin/product/onSale/{skuId}
export const reqCancelSale = (skuId)=>request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})
export const reqOnSale = (skuId)=>request({url:`/admin/product/onSale/${skuId}`,method:'get'})


// get /admin/product/getSkuById/{skuId} 
export const reqSkuById = (skuId)=>request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})