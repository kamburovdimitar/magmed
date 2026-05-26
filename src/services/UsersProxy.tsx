import { MDPatient } from "../model/MDPatient";
import { MDPatientMeasurements } from "../model/MDPatientMeasurements";

class UsersProxy {


    // тази дейта трябва да отиде в редукс , която ще идва 
    static data: MDPatient[] = [
        {
            lastname: "Müller",
            firstname: "Hans",
            title: "Dr.",
            birthdate: "01.01.1980",
            gender: "",
            patientid: "12345",
            measurements: new MDPatientMeasurements()
        },
        {
            lastname: "vasileva",
            firstname: "Anna",
            title: "mrs",
            birthdate: "02.02.1990",
            gender: "",
            patientid: "67890",
            measurements: new MDPatientMeasurements()
        },
        {
            lastname: "dimitrova",
            firstname: "Anna",
            title: "mrs",
            birthdate: "02.02.1991",
            gender: "",
            patientid: "67891",
            measurements: new MDPatientMeasurements()
        },
        {
            lastname: "Becker",
            firstname: "Peter",
            title: "Prof.",
            birthdate: "03.03.1975",
            gender: "",
            patientid: "99887",
            measurements: new MDPatientMeasurements()
        }
    ];

    static getAllUsers() {
        return UsersProxy.data;
    }

    static async addUser(firstName: string, lastName: string, title: string, gender: string, birthdate: string, patientId: string, measurements: MDPatientMeasurements) {
        const newPatient: MDPatient = {
            firstname: firstName,
            lastname: lastName,
            title: title,
            gender: gender,
            birthdate: birthdate,
            patientid: patientId,
            measurements: new MDPatientMeasurements()
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
