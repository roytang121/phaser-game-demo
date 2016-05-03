<CsoundSynthesizer>
<CsOptions>
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 128
nchnls = 2
0dbfs = 2.0

instr  1				

idur		= p3
iamp		= p4			
ifreq		=  cpspch(p5)		
iattack	= p6			
idecay	= p7			
iwave		= 1

isus	= idur - iattack - idecay	


aenv	linseg	0,iattack,1,isus,1,idecay,0	
asig	oscili	aenv,ifreq,iwave			
	out	asig					
	endin


</CsInstruments>
<CsScore>
f1 0 16385 10 853.43 278.1 457.09 48.225 64.161 57.456 38.448 29.829 11.602 11.409

t0 120 

;	start	dur	amp	freq	attck	decay
i1	0	.2	4000	9.05	.02	.05
i1	+	.4	4000	9.04	.02	.05
i1	+	.2	4000	9.05	.02	.05
i1	+	.4	4000	9.07	.02	.05
i1	+	.4	4000	9.05	.02	.1
i1	+	.4	4000	9.09	.02	.1
i1	+	.8	4000	9.10	.02	.2

end
</CsScore>
</CsoundSynthesizer>
<bsbPanel>
 <label>Widgets</label>
 <objectName/>
 <x>100</x>
 <y>100</y>
 <width>320</width>
 <height>240</height>
 <visible>true</visible>
 <uuid/>
 <bgcolor mode="nobackground">
  <r>255</r>
  <g>255</g>
  <b>255</b>
 </bgcolor>
</bsbPanel>
<bsbPresets>
</bsbPresets>
