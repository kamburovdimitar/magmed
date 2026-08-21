// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-14 (Europe/Sofia) — New test file, covering the pieces of Page11.tsx
// business logic that were extracted into ErgometrieUtil.js specifically so
// they could be unit-tested without needing to render the full React screen:
// stripIncompleteLastRow / checkLoadPlausibility (Datenerfassung
// Eingabelogik, "3.32 CCC"), resolveArchiveSaveOrUpdate (Save vs Update
// semantics for the Archive button), and sanitizeHfInput/sanitizeLactateInput
// (Datenerfassung input format rules).
// ============================================

import { describe, test, expect } from 'vitest';
import { ErgometryUtil } from '../../utils/ErgometrieUtil';

describe('stripIncompleteLastRow', () => {

    test('removes the last row only when BOTH hf and lactate are empty', () => {

        const rows = [
            { stage: 0, hf: '120', lactate: '1.5' },
            { stage: 1, hf: '', lactate: '' }
        ];

        const result = ErgometryUtil.stripIncompleteLastRow(rows);

        expect(result.length).toBe(1);
        expect(result[0].stage).toBe(0);

    });

    test('keeps the last row if only ONE of hf/lactate is empty (Laktat is optional per spec)', () => {

        const rowsHfOnly = [
            { stage: 0, hf: '120', lactate: '1.5' },
            { stage: 1, hf: '140', lactate: '' }
        ];

        const rowsLactateOnly = [
            { stage: 0, hf: '120', lactate: '1.5' },
            { stage: 1, hf: '', lactate: '2.0' }
        ];

        expect(ErgometryUtil.stripIncompleteLastRow(rowsHfOnly).length).toBe(2);
        expect(ErgometryUtil.stripIncompleteLastRow(rowsLactateOnly).length).toBe(2);

    });

    test('treats null/undefined the same as empty string', () => {

        const rows = [
            { stage: 0, hf: '120', lactate: '1.5' },
            { stage: 1, hf: null, lactate: undefined }
        ];

        expect(ErgometryUtil.stripIncompleteLastRow(rows).length).toBe(1);

    });

    test('does not touch an incomplete row that is NOT last', () => {

        const rows = [
            { stage: 0, hf: '', lactate: '' },
            { stage: 1, hf: '140', lactate: '2.0' }
        ];

        expect(ErgometryUtil.stripIncompleteLastRow(rows).length).toBe(2);

    });

    test('handles empty/undefined input without throwing', () => {

        expect(ErgometryUtil.stripIncompleteLastRow([])).toEqual([]);
        expect(ErgometryUtil.stripIncompleteLastRow(undefined)).toBeUndefined();

    });

});

describe('checkLoadPlausibility', () => {

    test('returns null when load strictly increases stage over stage', () => {

        const rows = [
            { load: 50 }, { load: 100 }, { load: 150 }, { load: 200 }
        ];

        expect(ErgometryUtil.checkLoadPlausibility(rows)).toBeNull();

    });

    test('flags a decreasing load', () => {

        const rows = [
            { load: 100 }, { load: 150 }, { load: 120 }
        ];

        expect(ErgometryUtil.checkLoadPlausibility(rows)).not.toBeNull();

    });

    test('flags an identical (non-increasing) load — spec forbids equal values too', () => {

        const rows = [
            { load: 100 }, { load: 100 }, { load: 150 }
        ];

        expect(ErgometryUtil.checkLoadPlausibility(rows)).not.toBeNull();

    });

    test('uses the injected message function instead of a hardcoded string', () => {

        const rows = [{ load: 100 }, { load: 50 }];

        const message = ErgometryUtil.checkLoadPlausibility(rows, (key) => `TRANSLATED:${key}`);

        expect(message).toBe('TRANSLATED:plausibility_load_error_text');

    });

});

describe('resolveArchiveSaveOrUpdate', () => {

    test('appends a new report when loadedReportId is null (first-ever Archive click)', () => {

        const { reportId, updatedReports, wasUpdate } = ErgometryUtil.resolveArchiveSaveOrUpdate({
            existingReports: [],
            loadedReportId: null,
            buildUpdatedReport: () => { throw new Error('should not be called'); },
            buildNewReport: () => ({ id: 'new-1', createdAt: 'now' })
        });

        expect(wasUpdate).toBe(false);
        expect(reportId).toBe('new-1');
        expect(updatedReports).toEqual([{ id: 'new-1', createdAt: 'now' }]);

    });

    test('updates the SAME report in place when loadedReportId matches an existing entry (no duplicate)', () => {

        const existing = [
            { id: 'a', createdAt: 'old-a' },
            { id: 'b', createdAt: 'old-b' }
        ];

        const { reportId, updatedReports, wasUpdate, existingIndex } = ErgometryUtil.resolveArchiveSaveOrUpdate({
            existingReports: existing,
            loadedReportId: 'b',
            buildUpdatedReport: (prev) => ({ ...prev, createdAt: 'refreshed-b' }),
            buildNewReport: () => { throw new Error('should not be called'); }
        });

        expect(wasUpdate).toBe(true);
        expect(reportId).toBe('b');
        expect(existingIndex).toBe(1);
        expect(updatedReports.length).toBe(2);
        expect(updatedReports[1]).toEqual({ id: 'b', createdAt: 'refreshed-b' });
        // the OTHER report must be untouched
        expect(updatedReports[0]).toEqual({ id: 'a', createdAt: 'old-a' });

    });

    test('falls back to appending a new report when loadedReportId no longer exists (e.g. it was deleted)', () => {

        const existing = [{ id: 'a', createdAt: 'old-a' }];

        const { updatedReports, wasUpdate } = ErgometryUtil.resolveArchiveSaveOrUpdate({
            existingReports: existing,
            loadedReportId: 'deleted-id',
            buildUpdatedReport: () => { throw new Error('should not be called'); },
            buildNewReport: () => ({ id: 'new-2', createdAt: 'now' })
        });

        expect(wasUpdate).toBe(false);
        expect(updatedReports.length).toBe(2);
        expect(updatedReports[1].id).toBe('new-2');

    });

    test('never mutates the existingReports array it was given', () => {

        const existing = [{ id: 'a', createdAt: 'old-a' }];
        const existingCopy = JSON.parse(JSON.stringify(existing));

        ErgometryUtil.resolveArchiveSaveOrUpdate({
            existingReports: existing,
            loadedReportId: 'a',
            buildUpdatedReport: (prev) => ({ ...prev, createdAt: 'changed' }),
            buildNewReport: () => ({ id: 'new', createdAt: 'now' })
        });

        expect(existing).toEqual(existingCopy);

    });

});

describe('sanitizeHfInput', () => {

    test('strips everything that is not a digit', () => {

        expect(ErgometryUtil.sanitizeHfInput('1a2b3')).toBe('123');
        expect(ErgometryUtil.sanitizeHfInput('12,5')).toBe('125');
        expect(ErgometryUtil.sanitizeHfInput('')).toBe('');

    });

});

describe('sanitizeLactateInput', () => {

    test('accepts the spec formats: 0 / 0,0 / 0,00 / 0.0 / 0.00', () => {

        expect(ErgometryUtil.sanitizeLactateInput('0')).toBe('0');
        expect(ErgometryUtil.sanitizeLactateInput('1,5')).toBe('1,5');
        expect(ErgometryUtil.sanitizeLactateInput('1,55')).toBe('1,55');
        expect(ErgometryUtil.sanitizeLactateInput('1.5')).toBe('1.5');
        expect(ErgometryUtil.sanitizeLactateInput('1.55')).toBe('1.55');

    });

    test('caps at 2 decimal digits', () => {

        expect(ErgometryUtil.sanitizeLactateInput('1,5678')).toBe('1,56');

    });

    test('allows only ONE separator — a second one is dropped, not swapped in as a new decimal point', () => {

        expect(ErgometryUtil.sanitizeLactateInput('1,2,3')).toBe('1,23');
        expect(ErgometryUtil.sanitizeLactateInput('1.2.3')).toBe('1.23');

    });

    test('strips letters and other junk', () => {

        expect(ErgometryUtil.sanitizeLactateInput('abc1,5xyz')).toBe('1,5');

    });

});
