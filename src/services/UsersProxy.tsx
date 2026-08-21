// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — New Test / Existing Tests / Save feature:
//   `measurements` on MDPatient is now MDTestRecord[] (see MDPatient.tsx's
//   changelog), so the mock/dummy patients here start with an empty test
//   list (`measurements: []`) instead of a single blank
//   MDPatientMeasurements — matches the new shape; each patient just has no
//   tests yet until they click "New Test".
// ============================================

import { MDPatient } from "../model/MDPatient";

class UsersProxy {


    // 🔹 2026-08-21 (Claude) — DK: "gender ... още когато създаваме обект
    // patient, мисля че не се попълва ... това го ъпдейтни, така че да е
    // попълнено правилно, защото аз ползвам хардкоднати стойности, все
    // още нямам бд." Всичките 4 демо пациента имаха `gender: ""` — сега
    // истински "male"/"female" (същите точни низове, които dropdown-ът в
    // HeaderComponent.tsx вече записва, и които ErgometrieUtil.js очаква).
    // тази дейта трябва да отиде в редукс , която ще идва
    static data: MDPatient[] = [
        {
            lastname: "Müller",
            firstname: "Hans",
            title: "Dr.",
            birthdate: "01.01.1980",
            gender: "male",
            patientid: "12345",
            measurements: [],
            activeTestId: ""
        },
        {
            lastname: "vasileva",
            firstname: "Anna",
            title: "mrs",
            birthdate: "02.02.1990",
            gender: "female",
            patientid: "67890",
            measurements: [],
            activeTestId: ""
        },
        {
            lastname: "dimitrova",
            firstname: "Anna",
            title: "mrs",
            birthdate: "02.02.1991",
            gender: "female",
            patientid: "67891",
            measurements: [],
            activeTestId: ""
        },
        {
            lastname: "Becker",
            firstname: "Peter",
            title: "Prof.",
            birthdate: "03.03.1975",
            gender: "male",
            patientid: "99887",
            measurements: [],
            activeTestId: ""
        }
    ];

    static getAllUsers() {
        return UsersProxy.data;
    }

    static async addUser(firstName: string, lastName: string, title: string, gender: string, birthdate: string, patientId: string) {
        const newPatient: MDPatient = {
            firstname: firstName,
            lastname: lastName,
            title: title,
            gender: gender,
            birthdate: birthdate,
            patientid: patientId,
            measurements: [],
            activeTestId: ""
        };

        this.data.push(newPatient);
    }

    static async updateUser(patient: MDPatient) {

        for (let i = 0; i < this.data.length; i++) {

            if (this.data[i].patientid === patient.patientid) {

                this.data[i].firstname = patient.firstname;
                this.data[i].lastname = patient.lastname;
                this.data[i].title = patient.title;
                this.data[i].birthdate = patient.birthdate;
                this.data[i].gender = patient.gender;
                this.data[i].measurements = patient.measurements;
                return this.data[i];
            }
        }

        return null;
    }


    // static async getAllUsers() {

    //     try {
    //         const response = await fetch('/api/users')

    //         if (!response.ok) {
    //             throw new Error('Failed to load users')
    //         }

    //         const data = await response.json()
    //         return data

    //     } catch (error) {

    //         console.error('UsersProxy.getUsers error:', error)
    //         return UsersProxy.data

    //     }

    // }

    static async getUserById(userId) {

        try {

            const response = await fetch(`/api/users/${userId}`)

            if (!response.ok) {
                throw new Error('Failed to load user')
            }

            const data = await response.json()
            return data

        } catch (error) {

            console.error('UsersProxy.getUserById error:', error)

            for (let i = 0; i < UsersProxy.data.length; i++) {
                if (UsersProxy.data[i].patientId == userId) {
                    return UsersProxy.data[i]
                }
            }

            return null

        }

    }
}



export default UsersProxy
