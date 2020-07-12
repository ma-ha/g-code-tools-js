( >>> Speed Test (OK for Polycarbonate) <<< )
( Deepth: -3.2 mm )
( Tool: 3 mm )
( ------ prepare ------ )
G90 (absolute positioning)
G21 (units is mm)
G92 X0 Y0 Z0 (set pos to zero)
G01 F150 (set speed)
G0 Z3 (safety height)
M03 S1000 (spindle on)
( ------ main program ------ )

( --------------------------------------------- )
( Speed Test )

( Speed Test > Rect: Rectangle 10 mm x 10 mm)
G1 X14.8 Y-2.2
G0 Z0.0
G1 Z-0.64
G1 X13.8 Y-3.2
G1 X20.2 Y-3.2
G1 X20.2 Y3.2
G1 X13.8 Y3.2
G1 X13.8 Y-3.2
G1 Z-1.28
G1 X13.8 Y-3.2
G1 X20.2 Y-3.2
G1 X20.2 Y3.2
G1 X13.8 Y3.2
G1 X13.8 Y-3.2
G1 Z-1.92
G1 X13.8 Y-3.2
G1 X20.2 Y-3.2
G1 X20.2 Y3.2
G1 X13.8 Y3.2
G1 X13.8 Y-3.2
G1 Z-2.56
G1 X13.8 Y-3.2
G1 X20.2 Y-3.2
G1 X20.2 Y3.2
G1 X13.8 Y3.2
G1 X13.8 Y-3.2
G1 Z-3.2
G1 X13.8 Y-3.2
G1 X20.2 Y-3.2
G1 X20.2 Y3.2
G1 X13.8 Y3.2
G1 X13.8 Y-3.2
( fine finish )
G1 X13.5 Y-3.5
G1 X20.5 Y-3.5
G1 X20.5 Y3.5
G1 X13.5 Y3.5
G1 X13.5 Y-3.5
G0 Z3 (safety height)

( Speed Test > Circle: Circle r=5 mm )
(circle at 5 0 )
( r1=3.2 )
G0 X1.8 Y0
G1 Z-0.64
G1 X1.8 Y0
G3 X8.2 Y0 I3.2 J0
G3 X1.8 Y0 I-3.2 J0
G1 Z-1.28
G1 X1.8 Y0
G3 X8.2 Y0 I3.2 J0
G3 X1.8 Y0 I-3.2 J0
G1 Z-1.92
G1 X1.8 Y0
G3 X8.2 Y0 I3.2 J0
G3 X1.8 Y0 I-3.2 J0
G1 Z-2.56
G1 X1.8 Y0
G3 X8.2 Y0 I3.2 J0
G3 X1.8 Y0 I-3.2 J0
G1 Z-3.2
G1 X1.8 Y0
G3 X8.2 Y0 I3.2 J0
G3 X1.8 Y0 I-3.2 J0
( r2=3.5 )
G1 X1.5 Y0
G3 X8.5 Y0 I3.5 J0
G3 X1.5 Y0 I-3.5 J0
G0 Z3 (safety height)

( Speed Test > Text: Text "ABC" )
G1 F100
(Letter A)
G0 Z3 (safety height)
G0 X25 Y0.226
G0 Z-0.1
G1 X26.583 Y4.8
G1 X27.476 Y4.813
G1 X29.046 Y0.348
G0 Z3 (safety height)
G0 X25.5 Y1.092
G0 Z-0.1
G1 X28.75 Y1.106
G0 Z3 (safety height)
(Letter B)
G0 Z3 (safety height)
G0 X30.529 Y2.598
G0 Z-0.1
G3 X31.157 Y2.599 I0.111 J130.66
G3 X31.665 Y2.603 I-0.237 J59.646
G3 X32.97 Y3.897 I-0.036 J1.342
G3 X32.063 Y4.854 I-0.923 J0.033
G2 X31.232 Y4.839 I-1.37 J54.617
G2 X29.687 Y4.827 I-4.315 J437.525
G1 X29.714 Y0.294
G2 X31.024 Y0.32 I2.308 J-83.274
G2 X32.299 Y0.324 I0.897 J-74.799
G3 X33.158 Y1.254 I0.005 J0.858
G3 X31.665 Y2.603 I-1.468 J-0.124
G0 Z3 (safety height)
(Letter C)
G0 Z3 (safety height)
G0 X37.535 Y3.974
G0 Z-0.1
G3 X37.049 Y4.54 I-0.942 J-0.318
G3 X35.939 Y4.813 I-1.126 J-2.184
G3 X34.472 Y4.204 I-0.014 J-2.039
G3 X33.794 Y2.621 I1.685 J-1.658
G3 X34.309 Y1.05 I2.422 J-0.076
G3 X35.932 Y0.267 I1.609 J1.262
G3 X37.249 Y0.596 I-0.019 J2.874
G3 X37.718 Y1.234 I-0.42 J0.801
G0 Z3 (safety height)
( ------ done ------ )
G0 Z3 (safety height)
M05
G0 X0 Y0
G0 Z0
