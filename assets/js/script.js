const popNotif = () => {
  alert('Sudah ku bilang jangan di klik ihh >_<')
}

const currentTitle = document.title;
window.addEventListener("blur", () => {
  document.title = "Heyy Mau Ke Mana Bruhh!!"
})
window.addEventListener("focus", () => {
  document.title = currentTitle
})