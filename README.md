# Göz Takibi ile Sanal Fare

Bu proje, göz hareketlerini ve göz kırpma eylemini kullanarak bir web sayfasındaki sanal fare imlecini kontrol etmeyi sağlayan deneysel bir demodur. Kullanıcı kameraya bakarak imleci hareket ettirir, tek bir göz kırpmasıyla ise sağ tıklama simülasyonu tetikler.

## Özellikler
- 👁️ **Bakış Takibi:** TensorFlow.js ve MediaPipe FaceMesh modeli sayesinde iris koordinatlarından imleç pozisyonu tahmin edilir.
- 🖱️ **Sanal Sağ Tıklama:** Tek bir göz kırpması algılandığında, sayfa üzerinde özel bir bağlam menüsü açılır.
- 📸 **Canlı Kamera Önizlemesi:** Ayna görünümüyle kamera akışı, göz ve iris çizimleriyle birlikte ekrana yansıtılır.
- 🎯 **Kalibrasyon Düğmesi:** İmleci hızlıca sahnenin merkezine taşır ve yeniden hizalama sağlar.

## Nasıl Kullanılır?
1. Depoyu klonla veya indir:
   ```bash
   git clone https://github.com/<kullanici-adi>/beyzadige.git
   cd beyzadige
   ```
2. `index.html` dosyasını modern bir tarayıcıda aç (Chrome veya Edge önerilir).
3. "Kamerayı Aç" düğmesine tıkla ve tarayıcıya kamera erişimi izni ver.
4. Ekrandaki sanal imleci gözlerinle yönlendir; kısa bir göz kırpmasıyla sağ tıklama menüsünü aç.

> **Not:** Bu uygulama yalnızca tarayıcı içerisinde çalışır, işletim sisteminin gerçek faresini kontrol etmez.

## Teknik Detaylar
- TensorFlow.js `face-landmarks-detection` modeli, MediaPipe FaceMesh altyapısını kullanır.
- Göz kırpma tespiti için Eye Aspect Ratio (EAR) metodundan yararlanılmıştır.
- Tüm arayüz HTML, CSS ve saf JavaScript ile geliştirilmiştir; ek yapılandırma veya derleme adımı gerektirmez.

Keyifli denemeler! 🚀
