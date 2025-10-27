# HTS Yakın Eşleşme Analizörü

Baz istasyonu (HTS) kayıtları ile olay yeri/ zamanı arasında hızlıca ilişki kurmanızı sağlayan küçük bir web aracı. Tek yapmanız gereken olayın tarih-saat bilgisini, konum koordinatlarını ve CSV/TSV formatındaki HTS satırlarını girmek; araç en yakın kayıtları zaman ve mesafe ağırlıklı bir skorla sıralar.

## Özellikler
- ⚡ **Anında sıralama:** Mesafe ve zaman farkını aynı tabloda değerlendirerek en yakın 5 kaydı öne çıkarır.
- 📍 **Konum odaklı:** Haversine formülü ile metre cinsinden gerçekçi uzaklık hesabı yapar.
- ⏱️ **Tolerans raporu:** Belirlediğiniz dakika/metre toleransı içinde kalan kayıt sayılarını gösterir.
- 🧮 **Esnek skor:** Zaman farkını metreye çevirmek için kullanacağınız m/s değerini siz belirlersiniz.
- 🧾 **Format uyumu:** Tarih sütunları `tarih`, `timestamp`, `datetime`; koordinatlar `enlem/lat`, `boylam/lon` isimlerini kullandığında otomatik algılar.

## Nasıl Kullanılır?
1. Depoyu klonla veya dosyaları indir.
   ```bash
   git clone https://github.com/<kullanici-adi>/beyzadige.git
   cd beyzadige
   ```
2. `index.html` dosyasını bir tarayıcıda aç.
3. Formdaki olay tarih-saatini ve koordinatları (WGS84 formatında) gir.
4. HTS kayıtlarını başlık satırıyla birlikte CSV/TSV olarak metin alanına yapıştır.
5. İsteğe bağlı olarak dakika/metre toleransları ve zaman ağırlığını (m/s) belirle.
6. **Eşleşmeleri Bul** düğmesine tıkla; özet kartı, istatistikler ve en yakın 5 kayıt ekrana gelsin.

## Veri Formatı İpuçları
```text
hat_no,tarih_saat,enlem,boylam,cid
905321234567,2024-02-18 21:36:00,41.0091,28.9655,TR34101
905321234567,2024-02-18 21:42:10,41.0103,28.9721,TR34105
905321987654,2024-02-18 21:39:41,41.0084,28.9736,TR34210
```
- Tarihler `YYYY-MM-DD HH:MM:SS`, `DD.MM.YYYY HH:MM` gibi yaygın formatlarda kabul edilir.
- Koordinatları ondalık (.) formatında yazın. Virgülle gelen değerler otomatik dönüştürülür.
- Hücre/CI bilgisi opsiyoneldir; boşsa “—” olarak gösterilir.

## Geliştirme Notları
- Proje saf HTML, CSS ve JavaScript ile hazırlandı, ek paket gerektirmez.
- Mesafe hesabı için yarıçapı 6.371 km olan standart Haversine formülü kullanılır.
- Skor hesabı `mesafe + (zaman_farkı × seçilen_m/s)` olarak yapılır; değer düşüldükçe olayla uyum artar.

Keyifli analizler! 🔍
