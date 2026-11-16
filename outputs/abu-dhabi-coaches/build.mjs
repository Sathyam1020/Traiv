import fs from 'node:fs/promises';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';
const out = new URL('./', import.meta.url).pathname;
const data = JSON.parse(await fs.readFile(new URL('../../reports/abu-dhabi-coaches-data.json', import.meta.url),'utf8'));
const software = {'Mohamed — Formax':'Client app advertised','Peter Maina — Fitness Express':'Fitness Express app','Mahmoud Eldawody':'Client dashboard advertised','NTRL':'NTRL App','Arron McCarthy-Gladstone':'Excelling coaching app'};
const headers=['Lead ID','Coach / business','Entity type','Public phone','Public email','Contact link / route','Online offer','Abu Dhabi evidence','Evidence type','Existing software','Notes','Service source','Location source','Checked','Outreach status'];
const wb=Workbook.create();
const all=[];
for(const [name,list,prefix,pending] of [['Online coaches',data.leads,'AD',false],['Needs confirmation',data.pending,'AD-P',true]]){
 const sh=wb.worksheets.add(name);sh.showGridLines=false;sh.tabColor=pending?'#C58A22':'#26354A';
 sh.getRange('A2').values=[[pending?'Online service needs confirmation':'Abu Dhabi online coaching prospects']];
 sh.getRange('A3').values=[[pending?'Directory tags only. Do not treat these as confirmed online coaches.':'Public-source checks: 13 Nov 2026. Contact availability and current base have not been confirmed by outreach.']];
 sh.getRange('A4').values=[['Count']];sh.getRange('B4').formulas=[[`=COUNTA(B7:B${list.length+6})`]];
 const rows=list.map((l,i)=>{
  const id=`${prefix}-${String(i+1).padStart(3,'0')}`;
  const route=l.contactType||(l.phone&&l.email?'Phone / email':l.phone?'Phone':l.email?'Email':'Website enquiry');
  const evidence=l.evidence||(l.url.includes('linktr.ee')?'Coach-owned social links':l.url.includes('uaepersonaltrainers')?'Directory profile':'Coach / business website');
  const notes=l.notes||'';
  const phone=l.phone?l.phone.replace(/^(\+971)(\d{2})(\d{3})(\d{4})$/,'$1 $2 $3 $4'):'';
  const vals=[id,l.name,l.type,phone,l.email||'',l.contact||route,l.online,l.location,evidence,l.software||software[l.name]||'Unknown',(l.contact?route+'. ':'')+notes,l.url,l.locationSource||l.url,new Date('2026-11-13T00:00:00Z'),pending?'Research further':'Researched'];
  all.push({...l,id,qualification:pending?'Likely online; needs confirmation':'Explicit online offer in public source',checked:data.checked});return vals;
 });
 sh.getRange('A6:O6').values=[headers];sh.getRange(`A7:O${list.length+6}`).values=rows;
 const table=sh.tables.add(`A6:O${list.length+6}`,true,pending?'PendingCoaches':'OnlineCoaches');table.style='TableStyleMedium2';
 sh.getRange(`A6:O${list.length+6}`).format.font={name:'Arial',size:10,color:'#202938'};
 sh.getRange(`A7:O${list.length+6}`).format.wrapText=true;
 sh.getRange(`A7:O${list.length+6}`).format.verticalAlignment='center';
 sh.getRange(`A7:O${list.length+6}`).format.rowHeight=90;
 sh.getRange('A6:O6').format={fill:'#26354A',font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},rowHeight:30,wrapText:true};
 sh.getRange('A2:O3').format.font={name:'Arial',size:11};sh.getRange('A2').format.font={name:'Arial',size:15,bold:true};
 const widths=[12,34,24,20,36,65,43,43,28,26,52,65,65,15,22];
 widths.forEach((w,i)=>sh.getRangeByIndexes(0,i,list.length+6,1).format.columnWidth=w);
 sh.getRange(`D7:E${list.length+6}`).setNumberFormat('@');sh.getRange(`N7:N${list.length+6}`).setNumberFormat('yyyy-mm-dd');
 sh.getRange(`O7:O${list.length+6}`).dataValidation={rule:{type:'list',values:['Research further','Researched','Contacted','Replied','Interested','Demo booked','Not interested','Do not contact']}};
 sh.freezePanes.freezeRows(6);sh.freezePanes.freezeColumns(2);
}
if(all.length!==50)throw Error('Expected 50 total records');
if(new Set(all.map(l=>l.name.toLowerCase())).size!==50)throw Error('Duplicate names');
for(const l of all){if(!l.phone&&!l.email&&!l.contact)throw Error('Missing contact '+l.name);if(l.phone&&!/^\+971\d{9}$/.test(l.phone))throw Error('Invalid phone '+l.name);new URL(l.url);}
wb.recalculate();
console.log(JSON.stringify(wb.worksheets.getItem('Online coaches').getRange('A7:F7').values));
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!',options:{useRegex:true,maxResults:20},maxChars:1500})).ndjson);
for(const name of ['Online coaches','Needs confirmation']){const p=await wb.render({sheetName:name,range:'A1:F10',scale:1,format:'png'});await fs.writeFile(out+name.replaceAll(' ','-')+'.png',new Uint8Array(await p.arrayBuffer()));}
const file=await SpreadsheetFile.exportXlsx(wb);await file.save(out+'Abu Dhabi coaching leads.xlsx');
const fields=['id','name','type','qualification','phone','email','contact','contactType','location','online','software','evidence','notes','url','locationSource','checked'];
const quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';
await fs.writeFile(out+'Abu Dhabi coaching leads.csv','\uFEFF'+fields.join(',')+'\r\n'+all.map(l=>fields.map(k=>quote(l[k])).join(',')).join('\r\n'));
console.log(JSON.stringify({total:all.length,explicit:data.leads.length,pending:data.pending.length,withPhone:all.filter(x=>x.phone).length,withEmail:all.filter(x=>x.email).length}));
