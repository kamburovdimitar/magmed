import { MDPatientMeasurements }
    from "./MDPatientMeasurements";
import { MDTestRecord } from "./MDTestRecord";

// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — New Test / Existing Tests / Save feature:
//   `measurements` changed from a single MDPatientMeasurements object to
//   MDTestRecord[] — a flat array, DB-friendly (maps directly to a future
//   `tests` SQL table / collection, one row per test, no nested history).
//     MDPatient
//      └── measurements[]        <- array, one MDTestRecord per saved test
//            └── MDTestRecord
//                  ├── id / createdAt / updatedAt
//                  └── data        <- MDPatientMeasurements (unchanged)
//                        ├── ergometry
//                        └── ergometryReports[]
//   `activeTestId` tracks which test is currently open for editing;
//   Page8.tsx keeps a local draft of that test's `data` and only commits it
//   back into this array on Save (see Page8.tsx's own changelog). Known
//   breaking follow-up: Page11.tsx still reads/writes
//   `dataPatient.measurements.ergometry`/`.ergometryReports` as if it were
//   a single object — that legacy screen needs its own pass to work with
//   the new array shape; not touched in this change.
// ============================================

export class MDPatient {

    constructor(
        data?: Partial<MDPatient>
    ) {

        Object.assign(this, data);

        // 🔹 ensure nested array of class instances (not plain objects)
        if (data?.measurements) {

            this.measurements =
                data.measurements.map(
                    (t: any) => new MDTestRecord(t)
                );
        }
    }

    lastname: string = "";

    firstname: string = "";

    title: string = "";

    birthdate: string = "";

    gender: string = "";

    patientid: string = "";

    measurements: MDTestRecord[] = [];

    activeTestId: string = "";

    // 🔹 2026-08-20 — DK: "Training – Gesundheit" модул (5 нови PDF-а, план
    // обсъден с DK преди имплементация) — Personenspezifische Standardwerte
    // (запазени лични подразбирания за планиране на тренировки) живеят тук
    // (на пациента), НЕ в MDPatientMeasurements/MDTestRecord.data — за
    // разлика от 8-степенната прогресия (виж MDPatientMeasurements.tsx),
    // презетите стойности трябва да преживяват отделния тест и да са едни
    // и същи за всички тестове на този пациент. Форма ще се уточни при
    // строене на Kein Test таба.
    trainingsplanStandardwerte: any = {};
}