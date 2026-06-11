import { ErgometryUtil } from './ErgometrieUtil';

const TEST_SCENARIOS = {

    normalBike() {

        return ErgometryUtil
            .generateFakeErgometry({

                type: 'bike'
            });
    },

    normalRun() {

        return ErgometryUtil
            .generateFakeErgometry({

                type: 'run'
            });
    }
};

function generateFromScenario(
    name
) {

    return TEST_SCENARIOS[
        name
    ]();
}

export {

    TEST_SCENARIOS,

    generateFromScenario
};