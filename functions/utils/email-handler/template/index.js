module.exports = function ({ fullname, email, age, gender, description }) {
  return `
  <table cellspacing="0" border="0">
    <tr>
      <td>İsim</td>
      <td>${fullname}</td>
    </tr>
    <tr>
      <td>Email</td>
      <td>${email}</td>
    </tr>
    <tr>
      <td>Yaş</td>
      <td>${age}</td>
    </tr>
    <tr>
      <td>Cinsiyet</td>
      <td>${gender}</td>
    </tr>
    <tr>
      <td>Açıklama</td>
      <td>${description}</td>
    </tr>
    <tr>
      <td colspan="2"><a href="https://estefulya.com">Estefulya.com</a> üzerinden gönderilmiştir.</td>
    </tr>
  </table>
  `
}