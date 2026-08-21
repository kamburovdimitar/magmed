// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 — original version of this file called
// ErgometryModelsUtil.calculateTrainingZones({IANSPoint:{load:300}}) — the
// OLD single-argument, %-of-load-of-300 signature — and relied on
// trainingZonesScenarios.js's hardcoded chartStart cutoffs (220/250/280/
// 314/316), which were tuned by hand to line up with that old 300-load
// formula's boundaries (225/255/285/315). It also referenced `s.chartEnd`
// and `s.visible`, neither of which trainingZonesScenarios.js's scenario
// objects ever actually had (only `label`/`chartStart`) — so this file was
// never green with real assertions, only ever throwing before it got that
// far once the Phase-3 HF-cascade rewrite (2026-08-14) changed
// calculateTrainingZones()'s signature to (result, ergometryData, model,
// isRun, customPercents).
// 2026-08-14 (Europe/Sofia) — Rewritten to be self-contained and
// deterministic: uses the exact same fixed data/result fixture as
// calculateTrainingZones.test.js (no Math.random()-based
// generateFakeErgometry(), so results never vary run to run), calls the
// CURRENT 4-arg calculateTrainingZones() signature, and derives its own
// chartStart/chartEnd/expected-visible-zones scenarios directly from the
// REAL zone boundaries that fixture produces (137.5 / 182.5 / 227.5 /
// 272.5 — see comment below) instead of hand-tuned magic numbers aimed at
// a formula that no longer exists.
//
// Note: trainingZonesScenarios.js / getVisibleZones() themselves are left
// untouched — they're still used by Page11.tsx's "generate fake test
// scenario" developer button (cosmetic zone-visibility labels on a
// randomly-generated demo dataset, not real patient results), and touching
// their hardcoded thresholds is out of scope here. Flagged to DK separately
// as a low-priority follow-up.
// ============================================

import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('training zones visibility (visible-range-within-chart-viewport math)', () => {

    // 🔹 Identical fixture to calculateTrainingZones.test.js — a Freiburger
    // result over a fixed 6-stage curve. Running it through the real
    // calculateTrainingZones() gives:
    //   REG   0     → 137.5
    //   GA1   137.5 → 182.5
    //   GA2   182.5 → 227.5
    //   E1    227.5 → 272.5
    //   E2    272.5 → (open-ended / Number.MAX_VALUE)
    const data = [
        { stage: 1, load: 100, hf: 120, lactate: 1.0 },
        { stage: 2, load: 150, hf: 140, lactate: 1.5 },
        { stage: 3, load: 200, hf: 160, lactate: 2.5 },
        { stage: 4, load: 225, hf: 170, lactate: 3.5 },
        { stage: 5, load: 250, hf: 180, lactate: 5.5 },
        { stage: 6, load: 275, hf: 190, lactate: 8.5 }
    ];

    const result = {
        model: 'freiburg',
        IASPoint: { hf: 160, load: 200, lactate: 2.5 },
        IANSPoint: { hf: 180, load: 250, lactate: 5.5 }
    };

    const zones = ErgometryModelsUtil.calculateTrainingZones(result, data, 'freiburg', false);

    // sanity-check the fixture itself before relying on it below — if this
    // ever fails, the scenarios' hand-picked chartStart cutoffs (150/185/
    // 230/273) below need to move too.
    test('fixture sanity check — boundaries are the ones this file\'s scenarios assume', () => {
        expect(zones.REG.to).toBe(137.5);
        expect(zones.GA1.to).toBe(182.5);
        expect(zones.GA2.to).toBe(227.5);
        expect(zones.E1.to).toBe(272.5);
    });

    const CHART_END = 400;

    const scenarios = [
        { label: '5 zones (chartStart before every boundary)', chartStart: 0, visible: ['REG', 'GA1', 'GA2', 'E1', 'E2'] },
        { label: '4 zones (chartStart past REG.to)', chartStart: 150, visible: ['GA1', 'GA2', 'E1', 'E2'] },
        { label: '3 zones (chartStart past GA1.to)', chartStart: 185, visible: ['GA2', 'E1', 'E2'] },
        { label: '2 zones (chartStart past GA2.to)', chartStart: 230, visible: ['E1', 'E2'] },
        { label: 'only E2 (chartStart past E1.to)', chartStart: 273, visible: ['E2'] }
    ];

    scenarios.forEach((s) => {

        test(s.label, () => {

            const visible = {
                REG: Math.max(0, Math.min(zones.REG.to, CHART_END) - Math.max(zones.REG.from, s.chartStart)),
                GA1: Math.max(0, Math.min(zones.GA1.to, CHART_END) - Math.max(zones.GA1.from, s.chartStart)),
                GA2: Math.max(0, Math.min(zones.GA2.to, CHART_END) - Math.max(zones.GA2.from, s.chartStart)),
                E1: Math.max(0, Math.min(zones.E1.to, CHART_END) - Math.max(zones.E1.from, s.chartStart)),
                E2: Math.max(0, CHART_END - Math.max(zones.E2.from, s.chartStart))
            };

            Object.keys(visible).forEach((k) => {
                if (s.visible.includes(k)) {
                    expect(visible[k]).toBeGreaterThan(0);
                } else {
                    expect(visible[k]).toBe(0);
                }
            });

        });

    });

});
