import { ErgometryUtil } from "./ErgometrieUtil";
// ------------------------------------------------
// Person
// ------------------------------------------------

/**
 * ------------------------------------------------
 * #1 - Last Name
 * ------------------------------------------------
 */
function calculateLastName(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #2 - First Name
 * ------------------------------------------------
 */
function calculateFirstName(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #3 - Birth Date
 * ------------------------------------------------
 */
function calculateBirthDate(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #4 - Gender
 * ------------------------------------------------
 */
function calculateGender(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #5 - Title
 * ------------------------------------------------
 */
function calculateTitle(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #6 - Patient ID
 * ------------------------------------------------
 */
function calculatePatientId(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #7 - Age
 * ------------------------------------------------
 * MAGMED Codex:
 * Current Date - Birth Date
 *
 * 🔹 2026-08-21 (Claude) — DK: "аз какво трябва да въвеждам, за да получа
 * резултат?" / "нищо не разбирам от нея" (Training-Kein Test страницата
 * показваше HF max=220, Watt max=300 - чисти defaults). Причина: тази
 * функция вече съществуваше и беше exported, но НИКЪДЕ в приложението не
 * се извикваше - `_age` в MDPatientMeasurements си стоеше на 0 по default
 * (виж `expectedheartrate`/`sollLeistungNorm` getter-ите - 220-0=220,
 * ErgometrieUtil fallback 220). Codex #7# изрично казва type "A" =
 * Automatisch (не се въвежда ръчно никъде) - затова свързването е тук,
 * от MDPatient.birthdate, а не нов input.
 *
 * Освен това `new Date(birthDate)` беше счупено за формàта, който
 * приложението реално пази ("DD.MM.YYYY", виж HeaderComponent.tsx/
 * UsersProxy.tsx примерни пациенти "02.02.1991" и т.н.) - JS парсва това
 * като невалидна/непредвидима дата (различно в различните браузъри), а не
 * ден.месец.година. Сега парсваме изрично по формата, вместо да разчитаме
 * на Date() auto-detect.
 */
function calculateAge(
    birthDate
) {

    if (!birthDate) {
        return null;
    }

    const parts = String(birthDate).split('.');

    if (parts.length !== 3) {
        return null;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (!day || !month || !year) {
        return null;
    }

    const dob = new Date(year, month - 1, day);

    if (isNaN(dob.getTime())) {
        return null;
    }

    const today =
        new Date();

    let age =
        today.getFullYear() -
        dob.getFullYear();

    const monthDiff =
        today.getMonth() -
        dob.getMonth();

    if (
        monthDiff < 0 ||
        (
            monthDiff === 0 &&
            today.getDate() < dob.getDate()
        )
    ) {
        age--;
    }

    return age;
}

/**
 * ------------------------------------------------
 * #8 - Free Code
 * ------------------------------------------------
 */
function calculateCode8(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #9 - Free Code
 * ------------------------------------------------
 */
function calculateCode9(
    value
) {
    return value ?? null;
}

// ------------------------------------------------
// Body
// ------------------------------------------------

function calculateHeightCm(
    value
) {
    return value ?? null;
}

function calculateWeightKg(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #12 - Body Surface Area
 * ------------------------------------------------
 * MAGMED Codex:
 * 0.007184 × Weight^0.425 × Height^0.725
 */
function calculateBSA(
    heightCm,
    weightKg
) {

    if (
        heightCm == null ||
        weightKg == null
    ) {
        return null;
    }

    return Number(
        (
            0.007184 *
            Math.pow(weightKg, 0.425) *
            Math.pow(heightCm, 0.725)
        ).toFixed(2)
    );

}

/**
 * ------------------------------------------------
 * #13 - BMI
 * ------------------------------------------------
 */
function calculateBMI(
    heightCm,
    weightKg
) {

    if (
        !heightCm ||
        !weightKg
    ) {
        return null;
    }

    const heightM =
        heightCm / 100;

    return Number(
        (
            weightKg /
            (heightM * heightM)
        ).toFixed(1)
    );

}

function calculateWaistCm(
    value
) {
    return value ?? null;
}

function calculateHipCm(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #16 - WHR
 * ------------------------------------------------
 */
function calculateWHR(
    waistCm,
    hipCm
) {

    if (
        !hipCm
    ) {
        return null;
    }

    return Number(
        (
            waistCm /
            hipCm
        ).toFixed(2)
    );

}

function calculateBodyFatPercent(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #18 - Fat Mass
 * ------------------------------------------------
 */
function calculateFatMass(
    weightKg,
    bodyFatPercent
) {

    if (
        weightKg == null ||
        bodyFatPercent == null
    ) {
        return null;
    }

    return Number(
        (
            weightKg *
            (
                bodyFatPercent /
                100
            )
        ).toFixed(1)
    );

}

// ------------------------------------------------
// Vital
// ------------------------------------------------

function calculateRestBloodPressureSystolic(v){ return v ?? null; }
function calculateRestBloodPressureDiastolic(v){ return v ?? null; }
function calculateMaxBloodPressureSystolic(v){ return v ?? null; }
function calculateMaxBloodPressureDiastolic(v){ return v ?? null; }
function calculateRestHeartRate(v){ return v ?? null; }
function calculateMaxHeartRate(v){ return v ?? null; }

/**
 * ------------------------------------------------
 * #25 - Expected Heart Rate
 * ------------------------------------------------
 * MAGMED Codex:
 * 220 - Age
 */
function calculateExpectedHeartRate(
    age
) {

    if (
        age == null
    ) {
        return null;
    }

    return 220 - age;

}

function calculateCode26(
    value
) {
    return value ?? null;
}

// ------------------------------------------------
// Ergometry
// ------------------------------------------------

function calculateMaxSpeed(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #28 - Pace
 * ------------------------------------------------
 * MAGMED Codex:
 * 60 / Speed
 */
function calculatePace(
    speed
) {

    if (
        !speed
    ) {
        return null;
    }

    const totalSeconds =
        Math.round(
            3600 / speed
        );

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const seconds =
        totalSeconds % 60;

    return (
        String(minutes)
            .padStart(2,'0')
        +
        ':'
        +
        String(seconds)
            .padStart(2,'0')
    );

}

function calculateBikeErgometry(v){ return v ?? null; }
function calculateRunningErgometry(v){ return v ?? null; }

/**
 * ------------------------------------------------
 * #31 - SOLL Watt
 * ------------------------------------------------
 * TODO:
 * Official MAGMED Table
 */
function calculateSollWatt(
    bodySurfaceArea,
    age,
    gender
) {

    return null;

}

function calculateIstWatt(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #33 - SOLL Watt / kg
 * ------------------------------------------------
 */
function calculateSollWattKg(
    sollWatt,
    weightKg
) {

    if (
        !weightKg
    ) {
        return null;
    }

    return Number(
        (
            sollWatt /
            weightKg
        ).toFixed(2)
    );

}

/**
 * ------------------------------------------------
 * #34 - IST Watt / kg
 * ------------------------------------------------
 */
function calculateIstWattKg(
    istWatt,
    weightKg
) {

    if (
        !weightKg
    ) {
        return null;
    }

    return Number(
        (
            istWatt /
            weightKg
        ).toFixed(2)
    );

}

/**
 * ------------------------------------------------
 * #35 - IST %
 * ------------------------------------------------
 */
function calculateIstPercent(
    istWatt,
    sollWatt
) {

    if (
        !sollWatt
    ) {
        return null;
    }

    return Math.round(
        (
            istWatt *
            100
        ) /
        sollWatt
    );

}

/**
 * ------------------------------------------------
 * #36 - SOLL Weight Watt
 * ------------------------------------------------
 * TODO:
 * Official MAGMED Table
 */
function calculateSollWeightWatt(
    age,
    gender
) {

    return null;

}

/**
 * ------------------------------------------------
 * #37 - SOLL Weight Watt / kg
 * ------------------------------------------------
 */
function calculateSollWeightWattKg(
    sollWeightWatt,
    weightKg
) {

    if (
        !weightKg
    ) {
        return null;
    }

    return Number(
        (
            sollWeightWatt /
            weightKg
        ).toFixed(2)
    );

}

/**
 * ------------------------------------------------
 * #38 - IST Weight Watt / kg
 * ------------------------------------------------
 */
function calculateIstWeightWattKg(
    istWatt,
    weightKg
) {

    if (
        !weightKg
    ) {
        return null;
    }

    return Number(
        (
            istWatt /
            weightKg
        ).toFixed(2)
    );

}

/**
 * ------------------------------------------------
 * #39 - IST Weight %
 * ------------------------------------------------
 */
function calculateIstWeightPercent(
    istWatt,
    sollWeightWatt
) {

    if (
        !sollWeightWatt
    ) {
        return null;
    }

    return Math.round(
        (
            istWatt *
            100
        ) /
        sollWeightWatt
    );

}

/**
 * ------------------------------------------------
 * #40 - Karvonen HR
 * ------------------------------------------------
 */
function calculateKarvonenHeartRate(
    restHF,
    maxHF,
    intensityPercent
) {

    if (
        restHF == null ||
        maxHF == null
    ) {
        return null;
    }

    return Math.round(
        restHF +
        (
            (
                intensityPercent /
                100
            ) *
            (
                maxHF -
                restHF
            )
        )
    );

}

// ------------------------------------------------
// Free Codes
// ------------------------------------------------

function calculateCode41(
    value
) {
    return value ?? null;
}

function calculateCode42(
    value
) {
    return value ?? null;
}

function calculateCode43(
    value
) {
    return value ?? null;
}

function calculateCode44(
    value
) {
    return value ?? null;
}

// ------------------------------------------------
// Bike Lactate
// ------------------------------------------------

/**
 * ------------------------------------------------
 * #45 - IAS (LTP1) Watt
 * ------------------------------------------------
 * Automatically extracted from
 * lactate curve.
 */
function calculateIASWatt(
    IASPoint
) {

    return IASPoint?.load ?? null;

}

/**
 * ------------------------------------------------
 * #46 - IANS (LTP2) Watt
 * ------------------------------------------------
 * Automatically extracted from
 * lactate curve.
 */
function calculateIANSWatt(
    IANSPoint
) {

    return IANSPoint?.load ?? null;

}

/**
 * ------------------------------------------------
 * #47 - IAS Watt / kg
 * ------------------------------------------------
 */
function calculateIASWattKg(
    IASPoint,
    weightKg
) {

    return calculateWattPerKg(
        IASPoint?.load,
        weightKg
    );

}

/**
 * ------------------------------------------------
 * #48 - IANS Watt / kg
 * ------------------------------------------------
 */
function calculateIANSWattKg(
    IANSPoint,
    weightKg
) {

    return calculateWattPerKg(
        IANSPoint?.load,
        weightKg
    );

}

/**
 * ------------------------------------------------
 * #49 - IAS Heart Rate
 * ------------------------------------------------
 */
function calculateIASHeartRate(
    IASPoint
) {

    return IASPoint?.hf ?? null;

}

/**
 * ------------------------------------------------
 * #50 - IANS Heart Rate
 * ------------------------------------------------
 */
function calculateIANSHeartRate(
    IANSPoint
) {

    return IANSPoint?.hf ?? null;

}

/**
 * ------------------------------------------------
 * #51 - Heart Rate at X % IANS
 * ------------------------------------------------
 * MAGMED Codex:
 * (#Intensity × IANS HF) / 100
 */
function calculateIANSHeartRatePercent(
    intensityPercent,
    IANSHF
) {

    if (
        intensityPercent == null ||
        IANSHF == null
    ) {
        return null;
    }

    return Math.round(
        (
            intensityPercent /
            100
        ) *
        IANSHF
    );

}

function calculateCode52(
    value
) {
    return value ?? null;
}

// ------------------------------------------------
// Running Lactate
// ------------------------------------------------

/**
 * ------------------------------------------------
 * #53 - IAS Speed
 * ------------------------------------------------
 */
function calculateIASSpeed(
    IASPoint,
    ergoType
) {

    if (
        ergoType !== "run") {
        return null;
    }

    return IASPoint?.load ?? null;

}

/**
 * ------------------------------------------------
 * #54 - IANS Speed
 * ------------------------------------------------
 */
/**
 * ------------------------------------------------
 * #54 - IANS Speed
 * ------------------------------------------------
 */
function calculateIANSSpeed(
    IANSPoint,
    ergoType
) {

    if (
        ergoType !== "run"
        
    ) {
        return null;
    }

    return IANSPoint?.load ?? null;

}

/**
 * ------------------------------------------------
 * #55 - IAS Speed %
 * ------------------------------------------------
 * MAGMED:
 * IAS Speed ×100 / Max Speed
 */
function calculateIASSpeedPercent(
    IASSpeed,
    maxSpeed
) {

    if (
        IASSpeed == null ||
        maxSpeed == null ||
        maxSpeed <= 0
    ) {
        return null;
    }

    return Math.round(
        (
            IASSpeed *
            100
        ) /
        maxSpeed
    );

}

/**
 * ------------------------------------------------
 * #56 - IANS Speed %
 * ------------------------------------------------
 * MAGMED:
 * IANS Speed ×100 / Max Speed
 */
function calculateIANSSpeedPercent(
    IANSSpeed,
    maxSpeed
) {

    if (
        IANSSpeed == null ||
        maxSpeed == null ||
        maxSpeed <= 0
    ) {
        return null;
    }

    return Math.round(
        (
            IANSSpeed *
            100
        ) /
        maxSpeed
    );

}

/**
 * ------------------------------------------------
 * #57 - IAS Running HF
 * ------------------------------------------------
 */
function calculateIASRunningHeartRate(
    IASPoint
) {

    return IASPoint?.hf ?? null;

}

/**
 * ------------------------------------------------
 * #58 - IANS Running HF
 * ------------------------------------------------
 */
function calculateIANSRunningHeartRate(
    IANSPoint
) {

    return IANSPoint?.hf ?? null;

}

/**
 * ------------------------------------------------
 * #59 - Running HF at X % IANS
 * ------------------------------------------------
 */
function calculateIANSRunningHeartRatePercent(
    intensityPercent,
    IANSHF
) {

    if (
        intensityPercent == null ||
        IANSHF == null
    ) {
        return null;
    }

    return Math.round(
        (
            intensityPercent /
            100
        ) *
        IANSHF
    );

}

function calculateCode60(
    value
) {
    return value ?? null;
}

function calculateCode61(
    value
) {
    return value ?? null;
}

// ------------------------------------------------
// Bike Spiro
// ------------------------------------------------

/**
 * ------------------------------------------------
 * #62 - VO₂ Max Watt
 * ------------------------------------------------
 */
function calculateVO2MaxWatt(
    value
) {

    return value ?? null;

}

/**
 * ------------------------------------------------
 * #63 - VO₂ L/min
 * ------------------------------------------------
 */
function calculateVO2LMin(
    value
) {

    return value ?? null;

}

/**
 * ------------------------------------------------
 * #64 - VO₂ ml/kg
 * ------------------------------------------------
 * MAGMED:
 * (VO₂ L/min ×1000) / Weight
 */
function calculateVO2Kg(
    vo2LMin,
    weightKg
) {

    if (
        vo2LMin == null ||
        weightKg == null ||
        weightKg <= 0
    ) {
        return null;
    }

    return Number(
        (
            (
                vo2LMin *
                1000
            ) /
            weightKg
        ).toFixed(1)
    );

}

/**
 * ------------------------------------------------
 * #65 - VO₂ Max Heart Rate
 * ------------------------------------------------
 */
function calculateVO2MaxHeartRate(
    value
) {

    return value ?? null;

}

/**
 * ------------------------------------------------
 * #66 - VT1 Watt
 * ------------------------------------------------
 */
function calculateVT1Watt(
    value
) {

    return value ?? null;

}

/**
 * ------------------------------------------------
 * #67 - VT2 Watt
 * ------------------------------------------------
 */
function calculateVT2Watt(
    value
) {

    return value ?? null;

}

/**
 * ------------------------------------------------
 * #68 - VT1 Watt / kg
 * ------------------------------------------------
 */
function calculateVT1WattKg(
    vt1Watt,
    weightKg
) {

    return calculateWattPerKg(
        vt1Watt,
        weightKg
    );

}

/**
 * ------------------------------------------------
 * #69 - VT2 Watt / kg
 * ------------------------------------------------
 */
function calculateVT2WattKg(
    vt2Watt,
    weightKg
) {

    return calculateWattPerKg(
        vt2Watt,
        weightKg
    );

}

/**
 * ------------------------------------------------
 * #70 - VT1 VO₂ ml/kg
 * ------------------------------------------------
 */
function calculateVT1VO2Kg(
    value
) {

    return value ?? null;

}

/**
 * ------------------------------------------------
 * #71 - VT2 VO₂ ml/kg
 * ------------------------------------------------
 */
function calculateVT2VO2Kg(
    value
) {

    return value ?? null;

}

/**
 * ------------------------------------------------
 * #72 - VT1 % VO₂ Max
 * ------------------------------------------------
 * MAGMED:
 * VT1 ×100 / VO₂max
 */
function calculateVT1Percent(
    vt1,
    vo2Max
) {

    if (
        vt1 == null ||
        vo2Max == null ||
        vo2Max <= 0
    ) {
        return null;
    }

    return Math.round(
        (
            vt1 *
            100
        ) /
        vo2Max
    );

}

/**
 * ------------------------------------------------
 * #73 - VT2 % VO₂ Max
 * ------------------------------------------------
 */
function calculateVT2Percent(
    vt2,
    vo2Max
) {

    if (
        vt2 == null ||
        vo2Max == null ||
        vo2Max <= 0
    ) {
        return null;
    }

    return Math.round(
        (
            vt2 *
            100
        ) /
        vo2Max
    );

}


/**
 * ------------------------------------------------
 * VO₂ Heart Rate Helper
 * ------------------------------------------------
 * HF = HFmax × (% / 100)
 */
function calculateVO2HeartRate(
    maxHF,
    percent
) {

    if (
        maxHF == null
    ) {
        return null;
    }

    return Math.round(
        maxHF *
        (
            percent / 100
        )
    );

}

/**
 * ------------------------------------------------
 * #74 - VT1 Heart Rate
 * ------------------------------------------------
 */
function calculateVT1HeartRate(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #75 - VT2 Heart Rate
 * ------------------------------------------------
 */
function calculateVT2HeartRate(
    value
) {
    return value ?? null;
}




/**
 * ------------------------------------------------
 * #76 - HF @45% VO₂max
 * ------------------------------------------------
 */
function calculateVO245HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        45
    );
}

/**
 * ------------------------------------------------
 * #77 - HF @50% VO₂max
 * ------------------------------------------------
 */
function calculateVO250HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        50
    );
}

/**
 * ------------------------------------------------
 * #78 - HF @55% VO₂max
 * ------------------------------------------------
 */
function calculateVO255HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        55
    );
}

/**
 * ------------------------------------------------
 * #79 - HF @60% VO₂max
 * ------------------------------------------------
 */
function calculateVO260HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        60
    );
}

/**
 * ------------------------------------------------
 * #80 - HF @65% VO₂max
 * ------------------------------------------------
 */
function calculateVO265HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        65
    );
}

/**
 * ------------------------------------------------
 * #81 - HF @70% VO₂max
 * ------------------------------------------------
 */
function calculateVO270HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        70
    );
}

/**
 * ------------------------------------------------
 * #82 - HF @75% VO₂max
 * ------------------------------------------------
 */
function calculateVO275HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        75
    );
}

/**
 * ------------------------------------------------
 * #83 - HF @80% VO₂max
 * ------------------------------------------------
 */
function calculateVO280HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        80
    );
}

/**
 * ------------------------------------------------
 * #84 - HF @85% VO₂max
 * ------------------------------------------------
 */
function calculateVO285HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        85
    );
}

/**
 * ------------------------------------------------
 * #85 - HF @90% VO₂max
 * ------------------------------------------------
 */
function calculateVO290HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        90
    );
}

/**
 * ------------------------------------------------
 * #86 - HF @95% VO₂max
 * ------------------------------------------------
 */
function calculateVO295HeartRate(
    maxHF
) {
    return calculateVO2HeartRate(
        maxHF,
        95
    );
}

function calculateCode87(v){ return v ?? null; }
function calculateCode88(v){ return v ?? null; }
function calculateCode89(v){ return v ?? null; }

// ------------------------------------------------
// Running Spiro
// ------------------------------------------------

function calculateRunningVO2MaxSpeed(
    value
) {
    return value ?? null;
}

function calculateRunningVO2LMin(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #92 - Running VO₂ ml/kg
 * ------------------------------------------------
 */
function calculateRunningVO2Kg(
    vo2LMin,
    weightKg
) {

    return calculateVO2Kg(
        vo2LMin,
        weightKg
    );

}

function calculateCode93(v){ return v ?? null; }

function calculateVT1Speed(
    value
) {
    return value ?? null;
}

function calculateVT2Speed(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #96 - VT1 Pace
 * ------------------------------------------------
 * 60 / VT1 Speed
 */
function calculateVT1Pace(
    vt1Speed
) {

    return calculatePace(
        vt1Speed
    );

}

/**
 * ------------------------------------------------
 * #97 - VT2 Pace
 * ------------------------------------------------
 * 60 / VT2 Speed
 */
function calculateVT2Pace(
    vt2Speed
) {

    return calculatePace(
        vt2Speed
    );

}

function calculateVT1RunningVO2Kg(
    value
) {
    return value ?? null;
}

function calculateVT2RunningVO2Kg(
    value
) {
    return value ?? null;
}

/**
 * ------------------------------------------------
 * #100 - VT1 Running %
 * ------------------------------------------------
 */
function calculateVT1RunningPercent(
    vt1,
    vo2Max
) {

    return calculateVT1Percent(
        vt1,
        vo2Max
    );

}

/**
 * ------------------------------------------------
 * #101 - VT2 Running %
 * ------------------------------------------------
 */
function calculateVT2RunningPercent(
    vt2,
    vo2Max
) {

    return calculateVT2Percent(
        vt2,
        vo2Max
    );

}

function calculateVT1RunningHeartRate(
    value
) {
    return value ?? null;
}

function calculateVT2RunningHeartRate(
    value
) {
    return value ?? null;
}

// ------------------------------------------------
// Running VO₂ Zones
// ------------------------------------------------

function calculateRunningVO245HeartRate(maxHF){ return calculateVO245HeartRate(maxHF); }
function calculateRunningVO250HeartRate(maxHF){ return calculateVO250HeartRate(maxHF); }
function calculateRunningVO255HeartRate(maxHF){ return calculateVO255HeartRate(maxHF); }
function calculateRunningVO260HeartRate(maxHF){ return calculateVO260HeartRate(maxHF); }
function calculateRunningVO265HeartRate(maxHF){ return calculateVO265HeartRate(maxHF); }
function calculateRunningVO270HeartRate(maxHF){ return calculateVO270HeartRate(maxHF); }
function calculateRunningVO275HeartRate(maxHF){ return calculateVO275HeartRate(maxHF); }
function calculateRunningVO280HeartRate(maxHF){ return calculateVO280HeartRate(maxHF); }
function calculateRunningVO285HeartRate(maxHF){ return calculateVO285HeartRate(maxHF); }
function calculateRunningVO290HeartRate(maxHF){ return calculateVO290HeartRate(maxHF); }
function calculateRunningVO295HeartRate(maxHF){ return calculateVO295HeartRate(maxHF); }

function calculateCode115(
    value
) {
    return value ?? null;
}

// ------------------------------------------------
// Running Lactate Pace
// ------------------------------------------------

/**
 * ------------------------------------------------
 * #116 - IAS Pace
 * ------------------------------------------------
 */
function calculateIASPace(
    IASPoint
) {

    return calculatePace(
        IASPoint?.load
    );

}

/**
 * ------------------------------------------------
 * #117 - IANS Pace
 * ------------------------------------------------
 */
function calculateIANSPace(
    IANSPoint
) {

    return calculatePace(
        IANSPoint?.load
    );

}

// ------------------------------------------------
// Helpers
// ------------------------------------------------

function calculateWattPerKg(
    watt,
    weightKg
) {

    if (
        watt == null ||
        weightKg == null ||
        weightKg <= 0
    ) {
        return null;
    }

    return Number(
        (
            watt /
            weightKg
        ).toFixed(2)
    );

}


/**
 * ------------------------------------------------
 * VO₂ Percent
 * ------------------------------------------------
 *
 * TODO:
 * Official MAGMED formula not available.
 */
function calculateVO2Percent(
    point
) {

    return null;

}

function calculateIASHFPercent(
    IASPoint,
    hfMax
) {

    return ErgometryUtil.calculateHFPercent(
        IASPoint?.hf,
        hfMax
    );

}

function calculateIANSHFPercent(
    IANSPoint,
    hfMax
) {

    return ErgometryUtil.calculateHFPercent(
        IANSPoint?.hf,
        hfMax
    );

}

/**
 * ------------------------------------------------
 * IAS VO2 %
 * ------------------------------------------------
 */
function calculateIASVO2Percent(
    IASPoint
) {

       return "TODO";


}

/**
 * ------------------------------------------------
 * IANS VO2 %
 * ------------------------------------------------
 */
function calculateIANSVO2Percent(
    IANSPoint
) {

       return "TODO";


}

function calculateIASVO2(
    IASPoint
) {
    return null;
}

function calculateIANSVO2(
    IANSPoint
) {
    return null;
}

function calculateIASVO2Kg(
    IASPoint,
    weightKg
) {
    return null;
}

function calculateIANSVO2Kg(
    IANSPoint,
    weightKg
) {
    return null;
}





export const CodexUtil = {

    // ------------------------------------------------
    // Person
    // ------------------------------------------------

    calculateLastName,
    calculateFirstName,
    calculateBirthDate,
    calculateGender,
    calculateTitle,
    calculatePatientId,
    calculateAge,
    calculateCode8,
    calculateCode9,

    // ------------------------------------------------
    // Body
    // ------------------------------------------------

    calculateHeightCm,
    calculateWeightKg,
    calculateBSA,
    calculateBMI,
    calculateWaistCm,
    calculateHipCm,
    calculateWHR,
    calculateBodyFatPercent,
    calculateFatMass,

    // ------------------------------------------------
    // Vital
    // ------------------------------------------------

    calculateRestBloodPressureSystolic,
    calculateRestBloodPressureDiastolic,
    calculateMaxBloodPressureSystolic,
    calculateMaxBloodPressureDiastolic,
    calculateRestHeartRate,
    calculateMaxHeartRate,
    calculateExpectedHeartRate,
    calculateCode26,

    // ------------------------------------------------
    // Ergometry
    // ------------------------------------------------

    calculateMaxSpeed,
    calculatePace,
    calculateBikeErgometry,
    calculateRunningErgometry,

    calculateSollWatt,
    calculateIstWatt,

    calculateSollWattKg,
    calculateIstWattKg,
    calculateIstPercent,

    calculateSollWeightWatt,
    calculateSollWeightWattKg,
    calculateIstWeightWattKg,
    calculateIstWeightPercent,

    calculateKarvonenHeartRate,

    calculateCode41,
    calculateCode42,
    calculateCode43,
    calculateCode44,

    // ------------------------------------------------
    // Bike Lactate
    // ------------------------------------------------

    calculateIASWatt,
    calculateIANSWatt,

    calculateIASWattKg,
    calculateIANSWattKg,

    calculateIASHeartRate,
    calculateIANSHeartRate,

    calculateIANSHeartRatePercent,

    calculateCode52,

    // ------------------------------------------------
    // Running Lactate
    // ------------------------------------------------

    calculateIASSpeed,
    calculateIANSSpeed,

    calculateIASSpeedPercent,
    calculateIANSSpeedPercent,

    calculateIASRunningHeartRate,
    calculateIANSRunningHeartRate,

    calculateIANSRunningHeartRatePercent,

    calculateCode60,
    calculateCode61,

    // ------------------------------------------------
    // Bike Spiro
    // ------------------------------------------------

    calculateVO2MaxWatt,
    calculateVO2LMin,
    calculateVO2Kg,
    calculateVO2MaxHeartRate,

    calculateVT1Watt,
    calculateVT2Watt,

    calculateVT1WattKg,
    calculateVT2WattKg,

    calculateVT1VO2Kg,
    calculateVT2VO2Kg,

    calculateVT1Percent,
    calculateVT2Percent,

    calculateVT1HeartRate,
    calculateVT2HeartRate,

    calculateVO2HeartRate,

    calculateVO245HeartRate,
    calculateVO250HeartRate,
    calculateVO255HeartRate,
    calculateVO260HeartRate,
    calculateVO265HeartRate,
    calculateVO270HeartRate,
    calculateVO275HeartRate,
    calculateVO280HeartRate,
    calculateVO285HeartRate,
    calculateVO290HeartRate,
    calculateVO295HeartRate,

    calculateCode87,
    calculateCode88,
    calculateCode89,

    // ------------------------------------------------
    // Running Spiro
    // ------------------------------------------------

    calculateRunningVO2MaxSpeed,
    calculateRunningVO2LMin,
    calculateRunningVO2Kg,

    calculateCode93,

    calculateVT1Speed,
    calculateVT2Speed,

    calculateVT1Pace,
    calculateVT2Pace,

    calculateVT1RunningVO2Kg,
    calculateVT2RunningVO2Kg,

    calculateVT1RunningPercent,
    calculateVT2RunningPercent,

    calculateVT1RunningHeartRate,
    calculateVT2RunningHeartRate,

    calculateRunningVO245HeartRate,
    calculateRunningVO250HeartRate,
    calculateRunningVO255HeartRate,
    calculateRunningVO260HeartRate,
    calculateRunningVO265HeartRate,
    calculateRunningVO270HeartRate,
    calculateRunningVO275HeartRate,
    calculateRunningVO280HeartRate,
    calculateRunningVO285HeartRate,
    calculateRunningVO290HeartRate,
    calculateRunningVO295HeartRate,

    calculateCode115,

    // ------------------------------------------------
    // Running Lactate Pace
    // ------------------------------------------------

    calculateIASPace,
    calculateIANSPace,

    // ------------------------------------------------
    // Helpers
    // ------------------------------------------------

    calculateWattPerKg,

    calculateVO2Percent,
    calculateIASHFPercent,
    calculateIANSHFPercent,
    calculateIASVO2Percent,
    calculateIANSVO2Percent,

    
    calculateIANSSpeed,
    calculateIASVO2,
    calculateIANSVO2,
    calculateIASVO2Kg,
    calculateIANSVO2Kg,

    
    

};


