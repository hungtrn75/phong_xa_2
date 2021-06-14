export const cut = (value, cutStart, cutEnd) => {
  return (
    value.substring(0, cutStart) + value.substring(cutEnd + 1, value.length)
  );
};

export const transform = (quanKhus, tinhThanhs, quanHuyens) => {
  let data = [];
  quanKhus.map(el => {
    data.push({
      id: el.id,
      name: el.name,
      children: el.provinces.map(el2 => {
        const findProvince = tinhThanhs.find(el3 => el3.id === el2.id);
        return {
          id: findProvince.id,
          name: findProvince.name,
          children: findProvince.districts.map(el4 => {
            const findDistrict = quanHuyens.find(el5 => el5.id === el4.id);

            return {
              id: findDistrict.id,
              name: findDistrict.name,
              children: findDistrict.communes.map(el6 => ({
                id: el6.id,
                name: el6.name,
              })),
            };
          }),
        };
      }),
    });
  });

  return data;
};

export const getByLevel = (arr, level) => {
  if (level) {
    return arr.map(el => getByLevel(el.children, level - 1));
  }

  return arr;
};

export const isValidCoordinate = (lon, lat) =>
  lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;

export const formatCurrency = (n, separate = ',') => {
  try {
    if (!n) n = 0;
    var s =
      typeof n === 'number'
        ? parseInt(n).toString()
        : typeof n === 'string'
        ? n
        : '0';
    var regex = /\B(?=(\d{3})+(?!\d))/g;
    var ret = s.replace(regex, separate);
    return ret;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export function generateUUID() {
  var d = new Date().getTime();
  var d2 = 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
