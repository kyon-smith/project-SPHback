import request from '@/utils/request'

export function reqCategory1() {
  return request({
    url: `/admin/product/getCategory1`,
    method: 'get',
  })
}

export function reqCategory2(category1Id) {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get',
  })
}

export function reqCategory3(category2Id) {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get',
  })
}

export function reqAttrInfoList(category1Id, category2Id, category3Id) {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get',
  })
}
