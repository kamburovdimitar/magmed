// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-25 (Europe/Sofia) — DK: "направи го" — Save бутонът на теста
//   (Page8/Page10/Page11, `saveActiveTest`/`createTest`/`renameActiveTest`/
//   `setActiveTest` в userSlice.ts) досега пишеше само в Redux — при
//   презареждане на клиента данните от тестовете се губеха, защото никой
//   не викаше UsersProxy.updateUser() след тях.
//
//   Вместо да пипаме поотделно Page8/Page10/Page11 (три различни места,
//   лесно е да се пропусне някое бъдещо), сложихме синхронизацията на едно
//   централно място: този hook гледа `state.user.selectedUser` (целия
//   пациент — демографски данни + measurements[]) и при всяка негова
//   промяна праща PUT /api/patients/:patientid към magmed-server, без
//   значение кой reducer/страница я е предизвикала.
//
//   Debounce (800ms) — Page10.tsx auto-save-ва на ВСЯКА промяна на поле
//   (виж неговия changelog), т.е. потенциално на всяко натискане на клавиш
//   в числово поле. Без debounce това означава по един PUT към Mongo на
//   всеки клавиш. Изчакваме кратка пауза в промените, преди реално да
//   пратим заявката — по средата на бърз ввод не се стреля нищо.
//
//   Пропуска се: (1) първия mount (за да не пращаме PUT веднага след
//   зареждане на пациент от сървъра — щяхме просто да презапишем същите
//   данни обратно, безсмислено); (2) когато няма избран пациент.
//
//   Грешка при PUT (напр. сървърът не е пуснат) само се логва в конзолата
//   — не прекъсва работата с приложението (UI-то е вече оптимистично
//   ъпдейтнато през Redux, тестът си стои видим на екрана; просто няма да
//   оцелее презареждане, докато magmed-server не е достъпен).
// ============================================

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import UsersProxy from '../services/UsersProxy';

const SYNC_DEBOUNCE_MS = 800;

export default function useAutoSyncSelectedPatient() {

    const selectedUser = useSelector((state: any) => state.user.selectedUser);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRun = useRef(true);

    useEffect(() => {

        // 🔹 първия mount / първото "виждане" на selectedUser (обикновено
        // веднага след като е зареден от сървъра) — няма реална промяна за
        // синхронизиране, пропускаме.
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        if (!selectedUser || !selectedUser.patientid) {
            return;
        }

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {

            UsersProxy.updateUser(selectedUser).catch((error) => {
                console.error('[useAutoSyncSelectedPatient] Неуспешен запис към сървъра:', error);
            });

        }, SYNC_DEBOUNCE_MS);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };

    }, [selectedUser]);

}
