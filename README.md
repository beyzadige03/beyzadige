# Prompt Koçu

TÜBİTAK 4006B projesi için jüriyi ilk bakışta etkileyebilecek yapay zekâ destekli "prompt koçu" aracı. Bu küçük web uygulaması ile 2 ila 10 kelimelik kısa promptlarını analiz eder, puanlar ve daha etkili hale getirmek için öneriler üretir.

## Özellikler
- 🎯 **Anında Puanlama:** Kelime sayısı, bağlam, eylem fiili ve çıktı beklentisine göre 0-100 arası puan.
- 💡 **Akıllı İpuçları:** Eksik olan noktaları tespit eder, kişiselleştirilmiş tüyolar verir.
- ✏️ **Alternatif Prompt:** Aynı isteği daha iyi anlatan örnek bir cümle önerir.
- 🧠 **AI Yorumu:** Yapay zekânın promptu nasıl gördüğünü anlatan yorum mesajı.

## Nasıl Kullanılır?
1. Depoyu klonla veya dosyaları indir.
   - Git kullanıyorsan:
     ```bash
     git clone https://github.com/<kullanici-adi>/beyzadige.git
     cd beyzadige
     ```
     Yukarıdaki komutlardan sonra klasörde `index.html`, `script.js` ve `styles.css` dosyalarını görmelisin.
   - GitHub arayüzünden indiriyorsan: Sayfada **Code** düğmesine bas ➜ **Download ZIP** seçeneğini seç ➜ indirdiğin ZIP dosyasını açtığında aynı dosyaların içeride bulunduğunu kontrol et.
2. `index.html` dosyasını bir tarayıcıda aç.
3. Metin kutusuna en az 2, en fazla 10 kelimeden oluşan promptunu yaz.
4. "Analiz Et" düğmesine tıkla; puanını, yorumları ve ipuçlarını incele.

## Geliştirme
- Tasarım ve etkileşimler saf HTML, CSS ve JavaScript ile hazırlandı.
- Ek bir paket kurmaya gerek yoktur.
- İstersen farklı kriterler eklemek için `script.js` içinde yer alan `analysePrompt` fonksiyonunu genişletebilirsin.

Keyifli sunumlar! 🎉
