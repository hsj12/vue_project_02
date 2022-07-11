import request from '@/utils/request'

// get /admin/product/{page}/{limit} 获取spu列表数据
export const reqSpuList = (page,limit,category3Id) => request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})


// get /admin/product/getSpuById/{spuId}  获取某一个spu信息
export const reqSpu = (spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})
// /admin/product/baseTrademark/getTrademarkList 
export const reqTrademarkList = ()=> request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})
// /admin/product/baseSaleAttrList  
export const reqBaseSaleAttrList = ()=> request({url:'/admin/product/baseSaleAttrList',method:'get'}) 
//  /admin/product/spuImageList/{spuId} 获取spu图片列表
export const reqSpuImageList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 获取销售属性的数据 get /admin/product/spuSaleAttrList/{spuId} 
export const reqSpuSaleAttrList = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})
// 获取平台属性的数据  get /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} 
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
// post /admin/product/updateSpuInfo 修改spu
// post /admin/product/saveSpuInfo 
export const saveOrUpdateSpuInfo = (spuInfo)=>{
    if(spuInfo.id){
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
    }else{
        console.log('正在添加')
        return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
    }
}

// 删除spu delete /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

// 添加sku  post /admin/product/saveSkuInfo 
export const reqSaveAttrInfo = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

// 获取sku列表展示 get /admin/product/findBySpuId/{spuId} 
export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})