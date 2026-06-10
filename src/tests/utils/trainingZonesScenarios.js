const trainingZonesScenarios = [

    {
        label: '5 zones',
        chartStart: 0
    },

    {
        label: '4 zones',
        chartStart: 220
    },

    {
        label: '3 zones',
        chartStart: 250
    },

    {
        label: '2 zones',
        chartStart: 280
    },

    {
        label: '1 zone',
        chartStart: 314
    },

    {
        label: 'only E2',
        chartStart: 316
    }
];

function getVisibleZones(chartStart) {

    if (chartStart >= 316)
        return ['E2'];

    if (chartStart >= 314)
        return ['E1', 'E2'];

    if (chartStart >= 280)
        return ['GA2', 'E1', 'E2'];

    if (chartStart >= 250)
        return ['GA1', 'GA2', 'E1', 'E2'];

    return [
        'REG',
        'GA1',
        'GA2',
        'E1',
        'E2'
    ];
}

function generateFakeDataFromTestScenario(index = 2) {

    const scenario =
        trainingZonesScenarios[index];

    const fake =
        generateFakeErgometry();

    fake.chartStart =
        scenario.chartStart;

    fake.visible =
        getVisibleZones(
            scenario.chartStart
        );

    return fake;
}

export {

    trainingZonesScenarios,

    generateFakeDataFromTestScenario,

    getVisibleZones
};

export default trainingZonesScenarios;