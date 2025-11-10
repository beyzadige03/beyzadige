const rainfallScenarios = [
  {
    range: [0, 349],
    title: 'Şiddetli kurak yıl',
    description:
      'Yağışın 350 mm altına düştüğü yıllarda nadaslı veya anıza ekim yaparak toprağın nemini koru. Nohut, mercimek ve korunga gibi kuraklığa dayanıklı türler ön plana çıkar.',
    crops: [
      {
        name: 'Nohut',
        sowing: 'Mart sonu &ndash; Nisan başı',
        seed: '10&ndash;12 kg/da',
        fertilizer: '6&ndash;8 kg/da DAP (18-46-0)',
        tip: 'Sertifikalı nohut çeşitleri kısa sürede çiçeklenir ve yaz sıcaklarına yakalanmaz.'
      },
      {
        name: 'Mercimek',
        sowing: 'Şubat sonu &ndash; Mart ortası',
        seed: '8&ndash;10 kg/da',
        fertilizer: '5&ndash;6 kg/da DAP',
        tip: 'Yabancı ot baskısını azaltmak için ekim öncesi yüzlek sürüm yap.'
      },
      {
        name: 'Korunga / Aspir',
        sowing: 'Mart ortası',
        seed: 'Korunga 4&ndash;5 kg/da, aspir 3&ndash;4 kg/da',
        fertilizer: '5&ndash;6 kg/da 20-20-0',
        tip: 'Yem amaçlı korunga, kurak meralara dayanır; aspir yağ bitkisi olarak pazarlanabilir.'
      }
    ]
  },
  {
    range: [350, 449],
    title: 'Orta kurak yıl',
    description:
      '350&ndash;450 mm arası yağışta erken ekim ve toprak nemini tutacak işleme yöntemleri kritik. Arpa ve makarnalık buğday kurak stresine daha dayanıklıdır.',
    crops: [
      {
        name: 'Makarnalık buğday',
        sowing: 'Ekim ortası &ndash; Kasım ortası',
        seed: '18&ndash;20 kg/da',
        fertilizer: '20&ndash;25 kg/da 20-20-0 + sapa kalkmada 8 kg/da üre',
        tip: 'Erken ekim kardeşlenmeyi artırır ve başaklanma dönemine güçlü girer.'
      },
      {
        name: 'Arpa',
        sowing: 'Ekim başı &ndash; Kasım başı',
        seed: '18&ndash;22 kg/da',
        fertilizer: '18&ndash;20 kg/da 20-20-0 + ilkbaharda 8 kg/da amonyum sülfat',
        tip: 'Maltlık çeşitlerde sık ekimden kaçın, hava sirkülasyonunu koru.'
      },
      {
        name: 'Fiğ (yem)',
        sowing: 'Ekim sonu &ndash; Kasım',
        seed: '12&ndash;14 kg/da',
        fertilizer: '6&ndash;8 kg/da 20-20-0',
        tip: 'Arpa ile karışık ekerek yem kalitesini artırabilir, erken biçimle ot verimini yükseltebilirsin.'
      }
    ]
  },
  {
    range: [450, 550],
    title: 'Orta nemli yıl',
    description:
      '450&ndash;550 mm aralığında kış yağışları kuvvetlidir. Ekmeklik buğday ve yulaf verimi yükselir, sulu alanlarda yağ bitkileri değerlendirilebilir.',
    crops: [
      {
        name: 'Ekmeklik buğday',
        sowing: '15 Ekim &ndash; 15 Kasım',
        seed: '18&ndash;20 kg/da (kuru), 16&ndash;18 kg/da (sulu)',
        fertilizer: '20&ndash;25 kg/da 20-20-0 + sapa kalkmadan önce 8&ndash;10 kg/da üre',
        tip: 'Anızlı ekim nemi korur, üst gübreyi kardeşlenme bitmeden uygula.'
      },
      {
        name: 'Yulaf',
        sowing: 'Ekim sonu &ndash; Kasım',
        seed: '16&ndash;18 kg/da',
        fertilizer: '18&ndash;20 kg/da 20-20-0 + ilkbaharda 6 kg/da amonyum nitrat',
        tip: 'Yulaf samanı yağışlı yıllarda yüksek biyokütle verir, kaba yem açığını kapatır.'
      },
      {
        name: 'Yem bezelyesi',
        sowing: 'Ekim &ndash; Kasım',
        seed: '14&ndash;16 kg/da',
        fertilizer: '6&ndash;8 kg/da 20-20-0',
        tip: 'Fiğ ile karışık ekim, protein oranını yükseltir ve otlatmaya uygun karışım oluşturur.'
      }
    ]
  },
  {
    range: [551, Infinity],
    title: 'Nispeten yağışlı yıl',
    description:
      'Yağışın 550 mm üzerine çıktığı yüksek rakımlı veya sulu parsellerde mısır, çavdar ve üçgül gibi nem seven türleri değerlendirebilirsin.',
    crops: [
      {
        name: 'Silajlık mısır (sulu)',
        sowing: 'Nisan sonu &ndash; Mayıs',
        seed: '4.5&ndash;5 kg/da (hibrit)',
        fertilizer: 'Tabanda 20 kg/da 20-20-0 + üstte 12 kg/da üre',
        tip: 'Çıkış sonrası çapalama ile havalanmayı artır, su yönetimini hassas yap.'
      },
      {
        name: 'Çavdar',
        sowing: 'Ekim ortası &ndash; Kasım',
        seed: '16&ndash;18 kg/da',
        fertilizer: '16&ndash;18 kg/da 20-20-0 + erken ilkbaharda 8 kg/da amonyum nitrat',
        tip: 'Dona dayanıklıdır; hasat sonrası sapı toprak örtüsü olarak bırakılabilir.'
      },
      {
        name: 'Üçgül veya patates (sulu)',
        sowing: 'Üçgül: Mart, Patates: Nisan başı',
        seed: 'Üçgül 1.5&ndash;2 kg/da, Patates 2500&ndash;3000 kg/ha',
        fertilizer: 'Organik maddece zengin tarlalarda 15-15-15 ile destekle',
        tip: 'Üçgül uzun süreli kaba yem sağlar; patates için mutlaka sulama planı oluştur.'
      }
    ]
  }
];

const monthlyRainfall = [
  { month: 'Oca', amount: 65 },
  { month: 'Şub', amount: 58 },
  { month: 'Mar', amount: 55 },
  { month: 'Nis', amount: 48 },
  { month: 'May', amount: 38 },
  { month: 'Haz', amount: 24 },
  { month: 'Tem', amount: 12 },
  { month: 'Ağu', amount: 10 },
  { month: 'Eyl', amount: 18 },
  { month: 'Eki', amount: 36 },
  { month: 'Kas', amount: 52 },
  { month: 'Ara', amount: 64 }
];

const rainfallInput = document.querySelector('#rainfallInput');
const rainfallValue = document.querySelector('#rainfallValue');
const scenarioTitle = document.querySelector('#scenarioTitle');
const scenarioDescription = document.querySelector('#scenarioDescription');
const recommendedCrops = document.querySelector('#recommendedCrops');
const rainfallBars = document.querySelector('#rainfallBars');

function formatRainfall(value) {
  return `${value} mm`;
}

function selectScenario(value) {
  const amount = Number(value);
  return rainfallScenarios.find(({ range }) => amount >= range[0] && amount <= range[1]) ?? rainfallScenarios[0];
}

function renderCrops(scenario) {
  recommendedCrops.innerHTML = '';

  scenario.crops.forEach((crop) => {
    const card = document.createElement('article');
    card.className = 'crop-card';
    card.innerHTML = `
      <header>
        <span class="range-label">Önerilen mahsul</span>
        <h3>${crop.name}</h3>
        <p class="sowing-window">Ekim zamanı: ${crop.sowing}</p>
      </header>
      <ul>
        <li><strong>Tohum:</strong> ${crop.seed}</li>
        <li><strong>Gübre:</strong> ${crop.fertilizer}</li>
        <li><strong>İpucu:</strong> ${crop.tip}</li>
      </ul>
      <footer>Yağış aralığı: ${scenario.title}</footer>
    `;
    recommendedCrops.appendChild(card);
  });
}

function updateScenario() {
  const value = Number(rainfallInput.value);
  rainfallValue.textContent = formatRainfall(value);
  const scenario = selectScenario(value);
  scenarioTitle.textContent = scenario.title;
  scenarioDescription.textContent = scenario.description;
  renderCrops(scenario);
}

function renderRainfallChart() {
  const max = Math.max(...monthlyRainfall.map((item) => item.amount));
  monthlyRainfall.forEach((item) => {
    const bar = document.createElement('div');
    bar.className = 'rainfall-bar';
    bar.style.height = `${(item.amount / max) * 100}%`;
    bar.dataset.amount = item.amount;

    const label = document.createElement('span');
    label.textContent = item.month;
    bar.appendChild(label);

    rainfallBars.appendChild(bar);
  });
}

rainfallInput.addEventListener('input', updateScenario);
renderRainfallChart();
updateScenario();
