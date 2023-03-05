const popNotif = () => {
  alert('yeahh malah di klik, tapi gapapa larangan adalah sebuah perintah')
  alert('oke kalo gitu kita main tebak-tebakan aja yaa')
  const answer = prompt('Tebak siapa aku : aku adalah orang yang selalu ada buat dia dimana pun dan kapan pun, tetapi apa yang aku lakukan itu sangat tidak berarti buat nya. jadi siapakah aku?')

  switch (answer.toLowerCase()) {
    case 'badut':
      alert(`yaps kamu benar, jawabanya memang ${answer}. jadi gimana apakah sama kamu juga merasakan hal seperti itu wkwk.`)
      alert('baik sudah yaa nanti lagi tebakan nya.')
      alert('Terima Kasih senang bermain dengan anda.')
      break;
    default:
      alert('yahh maaf ya kali ini kamu salah menjawab tebakan mungkin di lain waktu kamu bisa menjawabnya. keep strong jangan patah semangat ya.')
      alert('baik sudah yaa nanti lagi tebakan nya.')
      alert('Terima Kasih senang bermain dengan anda.')
      break;
  }
}

const currentTitle = document.title;
window.addEventListener("blur", () => {
  document.title = "Heyy Mau Ke Mana Bruhh!!"
})
window.addEventListener("focus", () => {
  document.title = currentTitle
})
