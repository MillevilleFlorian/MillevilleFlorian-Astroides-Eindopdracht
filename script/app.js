const apiKey = 'OeOk3e5EvtVx8DqjCM5JnppYA4CpSsMNvmTvYHMN';
const apiKey2 = 'zFEx9HWtQkefhbGplFlw8rEVfhB21p3NpevLSSB3';
const earth_icon = `<span data-date="" class="c-horizon__earth js-earth" style="left: 50%; bottom: 50%;">
<img src="img/earth.png"  class="c-earth">           
</span>`;

let text, max, min, totaal;
let year_max = 3000;
let year_min = 1000;
let afstand = [];

const TotaalAfstand = function (data) {
  afstand = [];
  for (let Element of data) {
    distance = Math.round(Element.miss_distance.kilometers);
    afstand.push(distance);
  }
  max = Math.max(...afstand);
  min = Math.min(...afstand);
  totaal = max - min;
};

const LoadAstroides = function (data, astroide) {
  const horizon = document.querySelector('.js-horizon');
  const name = document.querySelector('.js-name');
  const dia_max = document.querySelector('.js-dia-max');
  const dia_min = document.querySelector('.js-dia-min');
  const max_dist = document.querySelector('.js-max-distance');
  const max_dist2 = document.querySelector('.js-max-distance2');
  const list = document.querySelector('.js-list');
  for (let Element of data) {
    if (Element.name_limited == astroide) {
      dict = [];
      years = [];
      let innerHtml = '';
      for (let date of Element.close_approach_data) {
        // years.push(date.close_approach_date.slice(0, 4));
        if (date.close_approach_date > `${year_min}-01-01` && date.close_approach_date < `${year_max}-01-01`) {
          dict.push(date);
        }
      }
      // for (let year of years) {
      //   innerHtml += `<li class="c-info-list__item">${year}</li>`;
      // }
      // list.innerHTML = innerHtml;
      console.log(dict);
      name.innerHTML = Element.name;
      dia_max.innerHTML = parseFloat(Element.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2));
      dia_min.innerHTML = parseFloat(Element.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2));
      // close_approach = Element.close_approach_data;
      TotaalAfstand(dict);
      // max = max /2
      max_dist.innerHTML = `${Math.round(max / 1000000)} miljoen km`;
      max_dist2.innerHTML = `${Math.round(max / 1000000)} miljoen km`;
      length = dict.length;
      console.log(length);
      let graden = 360 / length;
      console.log(graden);
      text = `${earth_icon}`;
      id = 0;
      for (let date of dict) {
        distance = Math.round(date.miss_distance.kilometers);
        procent = (distance / max) * 50;
        text += `<span data-date="${date.close_approach_date.slice(0, 4)}" class="c-horizon__astroide js-astroide" style="left:${50 + procent * Math.cos(((0 + graden * id) * Math.PI) / 180)}%; bottom:${50 + procent * Math.sin(((0 + graden * id) * Math.PI) / 180)}%;"  class="c-astroide"> <img src="img/astroide.png"  class="c-astroide"></span>`;
        id += 1;
      }
      horizon.innerHTML = text;
    }
  }
};

const ShowOptions = function (data) {
  let id = 0;
  const select = document.querySelector('.js-select');
  for (let Element of data) {
    if (id == 0) {
      optie = `<option selected value="${id}">${Element.name_limited}</option>`;
    } else {
      optie += `<option value="${id}">${Element.name_limited}</option>`;
    }

    id += 1;
  }
  select.innerHTML = optie;
};

const get = (url) => fetch(url).then((r) => r.json());

const showResult = function (data) {
  console.log(data);
  ShowOptions(data);
  max = Math.max(...afstand);
  min = Math.min(...afstand);
  totaal = max - min;
  LoadAstroides(data, 'Eros');
  const select = document.querySelector('.js-select');
  const button = document.querySelector('.js-btn-search');
  const input_max = document.querySelector('.js-input-max');
  const input_min = document.querySelector('.js-input-min');
  const button_show_all = document.querySelector('.js-btn-show-all');
  select.addEventListener('change', function () {
    LoadAstroides(data, data[select.value].name_limited);
  });
  button.addEventListener('click', function () {
    year_max = input_max.value;
    year_min = input_min.value;
    LoadAstroides(data, data[select.value].name_limited);
  });
  button_show_all.addEventListener('click', function () {
    year_max = 9999;
    year_min = 0000;
    LoadAstroides(data, data[select.value].name_limited);
  });
};

async function getAPI() {
  const endPoint = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`;

  // Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
  const apiResponse = await get(endPoint);
  console.log(apiResponse)

  // Als dat gelukt is, gaan we naar onze showResult functie.
  const apiData = apiResponse.near_earth_objects;
  showResult(apiData);
}

document.addEventListener('DOMContentLoaded', function () {
  getAPI();
});

// astroide.style.setProperty('--local-astroide-position-left', `${50+ (25 * Math.cos((10.58*Math.PI)/180))}%`);
