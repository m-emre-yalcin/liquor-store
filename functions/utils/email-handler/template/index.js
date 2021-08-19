module.exports = function ({
  name,
  phone,
  address,
  paymentMethod,
  description
}) {
  return `
  <table cellspacing="0" border="0">
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
  `
}