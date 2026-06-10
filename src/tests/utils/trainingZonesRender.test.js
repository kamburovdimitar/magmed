import { describe,test,expect } from 'vitest'; 
import {ErgometryModelsUtil} from '../../utils/ErgometryModelsUtil.js'; 
import {trainingZonesScenarios} from '../../tests/utils/trainingZonesScenarios.js';

describe('training zones visibility',()=>{

trainingZonesScenarios.forEach(s=>{

test(s.label,()=>{

const zones=ErgometryModelsUtil.calculateTrainingZones({IANSPoint:{load:300}});

const visible={
REG:Math.max(0,Math.min(zones.REG.to,s.chartEnd)-Math.max(zones.REG.from,s.chartStart)),
GA1:Math.max(0,Math.min(zones.GA1.to,s.chartEnd)-Math.max(zones.GA1.from,s.chartStart)),
GA2:Math.max(0,Math.min(zones.GA2.to,s.chartEnd)-Math.max(zones.GA2.from,s.chartStart)),
E1:Math.max(0,Math.min(zones.E1.to,s.chartEnd)-Math.max(zones.E1.from,s.chartStart)),
E2:Math.max(0,s.chartEnd-Math.max(zones.E2.from,s.chartStart))
};

console.log('\n==============================');
console.log('CASE=',s.label);
console.log('CHART=',s.chartStart,'→',s.chartEnd);
console.log('🟨 REG','visible=',visible.REG.toFixed(1),'load=',zones.REG.from,'→',zones.REG.to);
console.log('🟩 GA1','visible=',visible.GA1.toFixed(1),'load=',zones.GA1.from,'→',zones.GA1.to);
console.log('🟦 GA2','visible=',visible.GA2.toFixed(1),'load=',zones.GA2.from,'→',zones.GA2.to);
console.log('🟪 E1','visible=',visible.E1.toFixed(1),'load=',zones.E1.from,'→',zones.E1.to);
console.log('🟥 E2','visible=',visible.E2.toFixed(1),'load=',zones.E2.from,'→ INF');
console.log('EXPECTED=',s.visible.join(' | '));
console.log('==============================\n');

Object.keys(visible).forEach(k=>{

if(s.visible.includes(k))expect(visible[k]).toBeGreaterThan(0);
else expect(visible[k]).toBe(0);

});

});

});

});