import request from '@/utils/request'

export function reqTrademark(page, limit) {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })
}

export function reqUpdateTrademark(trademark) {
  if (trademark.id) return request({
    url: `/admin/product/baseTrademark/update`,
    method: 'put',
    data: trademark
  })
  else return request({
    url: `/admin/product/baseTrademark/save`,
    method: 'post',
    data: trademark
  })
}

export function reqDeleteTrademark(id) {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}
