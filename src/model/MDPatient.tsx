import { MDPatientMeasurements }
    from "./MDPatientMeasurements";

export class MDPatient {

    // MDPatient
    //  └── measurements
    //       ├── ergometry
    //       └── ergometryReports[]

    constructor(
        data?: Partial<MDPatient>
    ) {

        Object.assign(this, data);

        // 🔹 ensure nested object
        if (data?.measurements) {

            this.measurements =
                new MDPatientMeasurements(
                    data.measurements
                );
        }
    }

    lastname: string = "";

    firstname: string = "";

    title: string = "";

    birthdate: string = "";

    gender: string = "";

    patientid: string = "";

    measurements: MDPatientMeasurements = new MDPatientMeasurements();
}