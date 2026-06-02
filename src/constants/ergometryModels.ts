export const ERGOMETRY_MODELS = {

    DICKHUTH: 'dickhuth',

    FREIBURG: 'freiburg',

    LINEAR: 'linear',

    LTP: 'ltp',

    KEUL: 'keul',

    KEUL_LEGACY: 'keullegacy'

} as const;

export type ErgometryModel =
    typeof ERGOMETRY_MODELS[
    keyof typeof ERGOMETRY_MODELS
    ];