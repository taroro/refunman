import moment from 'moment';

export function DateFormat(date) {
  let dayFullText = "";
  let dayShortText = "";
  let monthFullText = "";
  let monthShortText = "";
  let today = false;
  let value = date.split(' ');
  let dateSplit = value[0].split('/');
  let dateNum = dateSplit[0]*1;
  let year = (dateSplit[2]*1)+543;
  let timeText = value[1];
  if(value[0] == moment(new Date()).format('DD/MM/YYYY')) {
    today = true;
  }
    let day = moment(value[0], 'DD/MM/YYYY', true).format('dddd');
    switch(day) {
      case 'Sunday':
        dayFullText = "อาทิตย์";
        dayShortText = "อา.";
      break;
      case 'Monday':
        dayFullText = "จันทร์";
        dayShortText = "จ.";
      break;
      case 'Tuesday':
        dayFullText = "อังคาร";
        dayShortText = "อ.";
      break;
      case 'Wednesday':
        dayFullText = "พุธ";
        dayShortText = "พ.";
      break;
      case 'Thursday':
        dayFullText = "พฤหัสบดี";
        dayShortText = "พฤ.";
      break;
      case 'Friday':
        dayFullText = "ศุกร์";
        dayShortText = "ศ.";
      break;
      case 'Saturday':
        dayFullText = "เสาร์";
        dayShortText = "ส.";
      break;
    }

    let month = moment(value[0], 'DD/MM/YYYY', true).format('MM');
    switch(month) {
      case '01':
      monthFullText = "มกราคม";
      monthShortText = "ม.ค.";
      break;
      case '02':
      monthFullText = "กุมภาพันธ์";
      monthShortText = "ก.พ.";
      break;
      case '03':
      monthFullText = "มีนาคม";
      monthShortText = "มี.ค.";
      break;
      case '04':
      monthFullText = "เมษายน";
      monthShortText = "เม.ย.";
      break;
      case '05':
      monthFullText = "พฤษภาคม";
      monthShortText = "พ.ค.";
      break;
      case '06':
      monthFullText = "มิถุนายน";
      monthShortText = "มิ.ย.";
      break;
      case '07':
      monthFullText = "กรกฎาคม";
      monthShortText = "ก.ค.";
      break;
      case '08':
      monthFullText = "สิงหาคม";
      monthShortText = "ส.ค.";
      break;
      case '09':
      monthFullText = "กันยายน";
      monthShortText = "ก.ย.";
      break;
      case '10':
      monthFullText = "ตุลาคม";
      monthShortText = "ต.ค.";
      break;
      case '11':
      monthFullText = "พฤศจิกายน";
      monthShortText = "พ.ย.";
      break;
      case '12':
      monthFullText = "ธันวาคม";
      monthShortText = "ธ.ค.";
      break;
    
  }

  return {
    today,
    dateNum,
    dayFullText,
    dayShortText,
    monthFullText,
    monthShortText,
    timeText,
    year
  }
}