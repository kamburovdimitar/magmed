// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — New Test / Existing Tests / Save feature:
//   `measurements` on MDPatient is now MDTestRecord[] (see MDPatient.tsx's
//   changelog), so the mock/dummy patients here start with an empty test
//   list (`measurements: []`) instead of a single blank
//   MDPatientMeasurements — matches the new shape; each patient just has no
//   tests yet until they click "New Test".
//
// 2026-08-21 (Claude) — DK: "gender ... още когато създаваме обект patient,
//   мисля че не се попълва ... това го ъпдейтни". Всичките 4 демо пациента
//   имаха `gender: ""` — сега истински "male"/"female".
//
// 2026-08-25 (Europe/Sofia) — DK: "продължаваме към wire-ване на
//   проксита" — wire-ваме към реалния magmed-server API (виж
//   C:\magmed\magmed-server\src\routes\patients.js), който пише в
//   истинския MongoDB Atlas "magmed" клъстър, вместо статичния in-memory
//   масив по-долу.
//
//   Старият `static data` масив стана `FALLBACK_DATA` — вече НЕ е основният
//   източник на истина (той е MongoDB през magmed-server), а само мрежа за
//   безопасност: ако magmed-server не е стартиран локално (забравено
//   `npm start` в C:\magmed\magmed-server), getAllUsers/getUserById тихо се
//   връщат към него (console.error + fallback), за да не увисне целият
//   клиент. addUser/updateUser НЕ fallback-ват — при провалена заявка
//   хвърлят грешката нагоре (по-добре ясен провал при запис, отколкото
//   тихо загубени данни, които после изглеждат все едно са се запазили).
//
//   Всички извикващи места минаха от синхронно UsersProxy.getAllUsers() на
//   await UsersProxy.getAllUsers() — виж changelog-овете на Page4.tsx/
//   Page9.tsx/Page1.tsx.
// ============================================

import { MDPatient } from "../model/MDPatient";

// 🔹 адресът на magmed-server (виж C:\magmed\magmed-server\.env, PORT).
// Засега hardcode-нат — стъпка отвъд днешния демо обхват е да дойде от
// build/env конфигурация, за да работи и извън localhost (напр. на тест
// сървър или на таблет).
const API_BASE = "http://localhost:4001";

class UsersProxy {

    // 🔹 само fallback за "сървърът-не-е-пуснат" случая — вече НЕ е
    // основният източник на истина.
    static FALLBACK_DATA: MDPatient[] = [
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

    static async getAllUsers(): Promise<MDPatient[]> {

        try {

            const response = await fetch(`${API_BASE}/api/patients`);

            if (!response.ok) {
                throw new Error(`Failed to load patients (${response.status})`);
            }

            return await response.json();

        } catch (error) {

            console.error('UsersProxy.getAllUsers error, magmed-server изглежда недостъпен — ползвам fallback данни:', error);
            return UsersProxy.FALLBACK_DATA;

        }

    }

    static async addUser(firstName: string, lastName: string, title: string, gender: string, birthdate: string, patientId: string) {

        const response = await fetch(`${API_BASE}/api/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: firstName,
                lastname: lastName,
                title,
                gender,
                birthdate,
                patientid: patientId
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result?.error || `Failed to add patient (${response.status})`);
        }

        return result;

    }

    static async updateUser(patient: MDPatient) {

        const response = await fetch(`${API_BASE}/api/patients/${patient.patientid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patient)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result?.error || `Failed to update patient (${response.status})`);
        }

        return result;

    }

    static async getUserById(userId: string) {

        try {

            const response = await fetch(`${API_BASE}/api/patients/${userId}`);

            if (!response.ok) {
                throw new Error(`Failed to load patient (${response.status})`);
            }

            return await response.json();

        } catch (error) {

            console.error('UsersProxy.getUserById error, magmed-server изглежда недостъпен — ползвам fallback данни:', error);

            return UsersProxy.FALLBACK_DATA.find(p => p.patientid === userId) ?? null;

        }

    }
}

export default UsersProxy
