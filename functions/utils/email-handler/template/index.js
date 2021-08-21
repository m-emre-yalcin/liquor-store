module.exports = function ({
  name,
  phone,
  address,
  paymentMethod,
  description,
  basket,
  total
}) {
  const orders = basket.map(item => {
    return `
    <tr>  
      <td stlye="padding: 6px;">${item.id}</td>
      <td stlye="padding: 6px;">${item.product.name}</td>
      <td stlye="padding: 6px;">${item.product.price}₺</td>
      <td stlye="padding: 6px;">${item.product.category}</td>
      <td stlye="padding: 6px;">${item.quantity}</td>
      <td stlye="padding: 6px;">${Number(item.quantity * item.product.price)}₺</td>
    </tr>
    `
  }).join('')
  return `
  <table cellspacing="0" border="1">
    <tr>
      <td>İsim</td>
      <td>${name}</td>
    </tr>
    <tr>
      <td>Telefon</td>
      <td>${phone}</td>
    </tr>
    <tr>
      <td>Adres</td>
      <td>${address}</td>
    </tr>
    <tr>
    <td>Sipariş Açıklaması</td>
    <td>${description}</td>
    </tr>
    <tr>
      <td>Ödeme Yöntemi</td>
      <td>${paymentMethod}</td>
    </tr>
  </table>
  <hr>
  <h3>Siparişler</h3>
  <table cellspacing="0" border="1">
  <tr>
    <th stlye="text-align: left; padding: 6px;">id</th>
    <th stlye="text-align: left; padding: 6px;">ürün isim</th>
    <th stlye="text-align: left; padding: 6px;">ürün fiyat</th>
    <th stlye="text-align: left; padding: 6px;">ürün kategori</th>
    <th stlye="text-align: left; padding: 6px;">miktar</th>
    <th stlye="text-align: left; padding: 6px;">toplam</th>
    </tr>
    ${orders}
    <tr>
      <td stlye="padding: 6px;" colspan="6" style="text-align:right;">
      sipariş tutarı + getirme ücreti: <b>${total}</b>
      </td>
    <tr>
  </table>
  `
}