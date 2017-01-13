import Moment from 'moment';

export const getWeekdayMonthDay = (date) => {
  return Moment(date).format("ddd, MMM D");
};

export const getHrMinDuration = (dateStart, dateEnd) => {
  return Moment(dateStart).format("h:mm A") + ' to ' + Moment(dateEnd).format("h:mm A");
};
