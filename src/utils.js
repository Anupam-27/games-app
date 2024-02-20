import moment from 'moment';

const generateTimeOptions = () => {
    const options = [];
    const startTime = moment().set({ hour: 6, minute: 0 });
    const endTime = moment().set({ hour: 21, minute: 0 });

    while (startTime.isBefore(endTime)) {
        options.push({
            value: startTime.format('HH:mm'),
            label: startTime.format('hh:mm A'),
        });
        startTime.add(15, 'minutes');
    }

    return options;
};

export {
    generateTimeOptions
}