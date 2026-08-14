// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — New model, part of the New Test / Existing
//   Tests / Save feature: each saved test is one MDTestRecord living inside
//   MDPatient.measurements[] (see MDPatient.tsx's own changelog for the
//   full tree). `data` holds the actual test payload (the class formerly
//   known as the single MDPatientMeasurements object) — id/createdAt/
//   updatedAt are metadata about the test itself, not about the patient.
// ============================================

import { MDPatientMeasurements } from "./MDPatientMeasurements";

export class MDTestRecord {

    id: string = '';

    // 🔹 human-readable label so a test can be recognized at a glance
    // (Page8/Page11 headers, TestsListComponent) instead of only the raw
    // id. Auto-assigned by createTest (userSlice.ts), renamable via
    // renameActiveTest.
    name: string = '';

    createdAt: string = '';

    updatedAt: string = '';

    // 🔹 the actual test payload — body measurements, vitals, ergometry,
    // ergometryReports, everything TestComponent1-7 read/write today.
    data: MDPatientMeasurements = new MDPatientMeasurements();

    constructor(source?: Partial<MDTestRecord>) {

        Object.assign(this, source);

        // 🔹 ensure nested class instance (not a plain object)
        if (source?.data) {

            this.data = new MDPatientMeasurements(source.data);

        }

    }

}
