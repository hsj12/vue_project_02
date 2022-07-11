import request from '@/utils/request'

//  /admin/product/getCategory1
export const reqCategory1List = ()=>request({url:'/admin/product/getCategory1',method:'get'})
export const reqCategory2List = (category1Id)=>request({url:`/admin/product/getCategory2/${category1Id} `,method:'get'})
export const reqCategory3List = (category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

// get /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} 
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加属性值  post /admin/product/saveAttrInfo 
// {
//     "attrName": "string",属性名
//     "attrValueList": [
//       {
//         "attrId": 0,
//         "valueName": "string"
//       }
//     ],
//     "categoryId": 0,
//     "categoryLevel": 0,
//   }
export const reqSaveAttrInfo = (data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data})

// 删除属性  delete /admin/product/deleteAttr/{attrId} 


// 保存属性 
