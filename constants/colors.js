const colors = {
    cold: '#0B9EEF',
    chilly: '#EFDD0B',
    warm: '#EFB40B',
    hot: '#EF420B'
};

export const colorSwitch = (num) => {
    if (num < 0) {
        return colors.cold;
    } else if (num >= 0 && num <= 15) {
        return colors.chilly;
    } else if (num > 15 && num <= 30) {
        return colors.warm;
    } else {
        return colors.hot;
    }
};