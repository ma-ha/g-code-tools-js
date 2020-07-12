#!/usr/local/bin/node
if ( ! process.argv[2] ) {
  console.error( 'Usage: gode-gen.js input.json > output.gcode' )
  process.exit()
}

let cnc = require( './' + process.argv[2] )
let arialN = require( './fonts/arial.json' )
let arialS = require( './fonts/arial_small.json' )

if ( ! cnc.passes && cnc.passes !== 0 ) { cnc.passes = 4 }
if ( ! cnc.passes && cnc.passes !== 0 ) { cnc.passes = 4 }

if ( ! cnc.passes && cnc.passes !== 0 ) { cnc.passes = 4 }
if ( ! cnc.fine ) { cnc.fine = 0.5 }

let mainToolRadius = cnc.ToolDia / 2

console.log(`( >>> ${cnc.PrjName} <<< )`)
console.log(`( Deepth: ${cnc.z} mm )`)
console.log(`( Tool: ${cnc.ToolDia} mm )`)
console.log('( ------ prepare ------ )')
console.log('G90 (absolute positioning)')
console.log('G21 (units is mm)')
console.log('G92 X0 Y0 Z0 (set pos to zero)')
console.log(`G01 F${(cnc.CutSpeed?cnc.CutSpeed:200)} (set speed)`)
toSafetyHeight()
console.log(`M03 S${(cnc.SpindleSpeed?cnc.SpindleSpeed:1000)} (spindle on)`)
console.log('( ------ main program ------ )')

for ( let spec of cnc.DoTemplates ) {
  doGCodeForTemplate( spec )
}

console.log('( ------ done ------ )')
toSafetyHeight()
console.log('M05')
console.log('G0 X0 Y0')
console.log('G0 Z0')

// ----------------------------------------------------------------------------
function doGCodeForTemplate( spec ) {
  console.log( '\n( --------------------------------------------- )' )
  console.log( '( '+spec.descr+' )' )
  try {
    let templateSpec = cnc.Template[ spec.Template ]
    for ( let element of templateSpec ) {
      try {
        switch ( element.type ) {

          case 'Circle': 
            console.log( `\n( ${spec.descr} > ${element.descr}: ${element.type} r=${element.r} mm )` )
            genGCodeCircle( 
              element.r,
              element.x + spec.x,
              element.y + spec.y,
              mainToolRadius
            )
            break

          case 'Rectangle': 
            console.log( `\n( ${spec.descr} > ${element.descr}: ${element.type} ${element.w} mm x ${element.h} mm)` )
            genGCodeRectangle( 
              element.x + spec.x,
              element.y + spec.y,
              element.w,
              element.h,
              mainToolRadius
            )
            break

          case 'Template': 
            doGCodeForTemplate({
              Template : element.Template,
              x : element.x + spec.x,
              y : element.y + spec.y,
              descr : element.descr
            })
            break

          case 'Drill':
            console.log( `\n( ${spec.descr} > ${element.descr}: ${element.type} )` )
            genGCodeDrill(
              element.x + spec.x,
              element.y + spec.y,
            )
            break

            case 'Text':
              console.log( `\n( ${spec.descr} > ${element.descr}: Text "${element.text}" )` )
              let options = {}
              if ( element.dir    ) { options.rot    = element.dir }
              if ( element.mirror ) { options.mirror = true }
              if ( element.pitch  ) { options.pitch  = element.pitch }
              gCodeText(
                element.text,
                element.size,
                element.x + spec.x,
                element.y + spec.y,
                options
              )
              break
  
            // case 'Line': 
              // TODO
              // break

          default: 
            console.error( `\n( ERR, type "${element.type}" unknown, ${spec.descr} > ${element.descr})` )
            console.log( `\n( ERR, type "${element.type}" unknown, ${spec.descr} > ${element.descr})` )
            // TODO
            break
        }
      } catch ( exc ) { 
        console.log( '(ERROR: '+exc.message+')' ) 
        console.error( '(ERROR: '+exc.message+')' ) 
      }
    }
  } catch ( exc ) { 
    console.log( '(ERROR: '+exc.message+')' ) 
    console.error( '(ERROR: '+exc.message+')' ) 
  }
}


// ----------------------------------------------------------------------------
function genGCodeDrill( x, y ) {
  console.log( `G0 X${v(x)} Y${v(y)}`)
  console.log( `G0 Z0.1`)
  console.log( `G1 Z${cnc.z}`)
  toSafetyHeight()
}

// ----------------------------------------------------------------------------
function genGCodeCircle( r, x, y, rTool ) {
  if ( r < rTool ) { return console.log('(ERROR: radius too small fro tool)')}
  let smallCircle = false
  if ( r <= rTool + cnc.fine ) { smallCircle = true }
  
  if ( smallCircle  ) {
    let r1 = r - rTool 
    console.log( `(small circle at ${x} ${y} )`)
    console.log( `G01 F${(cnc.CutSpeed?cnc.CutSpeed:200)} (set speed)`)
    console.log( `G0 X${v(x)} Y${v(y)}`)
    for ( let i = 1; i <= cnc.passes; i++ ) { 
      let z = cnc.z / cnc.passes * i
      console.log( `G1 Z${z}`)
      console.log( `G1 X${v(x-r1)} Y${v(y)}`)
      console.log( `G1 Z${cnc.z}`)
      console.log( `G3 X${v(x+r1)} Y${v(y)} I${v(r1)} J${v(0)}`)
      console.log( `G3 X${v(x-r1)} Y${v(y)} I${v(-r1)} J${v(0)}`)
    }
  } else {
    console.log( `(circle at ${x} ${y} )`)
    console.log( `G01 F${(cnc.CutSpeed?cnc.CutSpeed:200)} (set speed)`)
    let r1 = r - rTool - cnc.fine
    console.log( `( r1=${r1} )`)
    console.log( `G0 X${v(x-r1)} Y${v(y)}`)
    for ( let i = 1; i <= cnc.passes; i++ ) { 
      let z = cnc.z / cnc.passes * i
      console.log( `G1 Z${z}`)
      console.log( `G1 X${v(x-r1)} Y${v(y)}`)
      console.log( `G3 X${v(x+r1)} Y${v(y)} I${v(r1)} J${v(0)}`)
      console.log( `G3 X${v(x-r1)} Y${v(y)} I${v(-r1)} J${v(0)}`)
    }
    // fine cut 
    let r2 = r - rTool
    console.log( `( r2=${r2} )`)
    console.log( `G1 X${v(x-r2)} Y${v(y)}`)
    console.log( `G3 X${v(x+r2)} Y${v(y)} I${v(r2)} J${v(0)}`)
    console.log( `G3 X${v(x-r2)} Y${v(y)} I${v(-r2)} J${v(0)}`)      
  }
  toSafetyHeight()
}

// ----------------------------------------------------------------------------
function genGCodeRectangle( x, y, w, h, rTool ) {
  console.log( `G01 F${(cnc.CutSpeed?cnc.CutSpeed:200)} (set speed)`)
  if ( w < 2 * rTool ) {
    console.error('(ERROR: rectangle w too small for tool)') 
    return console.log('(ERROR: rectangle w too small for tool)')
  }
  if ( h < 2 * rTool ) {
    console.error('(ERROR: rectangle h too small for tool)')
    return console.log('(ERROR: rectangle h too small for tool)')
  }
  let small = false
  if ( w <= 2 * rTool + 1 ) { small = true }
  if ( h <= 2 * rTool + 1 ) { small = true }
  if ( small ) {
    console.log('(small)')
    console.log( `G1 X${v( x )} Y${v( y )}`)
    console.log( `G0 Z0.0`)
    for ( let i = 1; i <= cnc.passes; i++ ) { 
      let z = cnc.z / cnc.passes * i
      console.log( `G1 Z${v(z)}`)
      let dX = w/2 - rTool 
      let dY = h/2 - rTool 
      g1Rect( x, y, dX, dY )
    }
  } else {
    // rough cut 
    let dX = w/2 - rTool - cnc.fine
    let dY = h/2 - rTool - cnc.fine
    console.log( `G1 X${v( x - dX + 1 )} Y${v( y - dY + 1 )}`)
    console.log( `G0 Z0.0`)
    for ( let i = 1; i <= cnc.passes; i++ ) { 
      let z = cnc.z / cnc.passes * i
      console.log( `G1 Z${v(z)}`)
      g1Rect( x, y, dX, dY )
    }
    console.log( `( fine finish )`)
    // fine cut 
    dX = w/2 - rTool
    dY = h/2 - rTool
    g1Rect( x, y, dX, dY )
  }
  toSafetyHeight()
}

function g1Rect( x, y, dX, dY ) {
  console.log( `G1 X${v( x - dX )} Y${v( y - dY )}`)
  console.log( `G1 X${v( x + dX )} Y${v( y - dY )}`)
  console.log( `G1 X${v( x + dX )} Y${v( y + dY )}`)
  console.log( `G1 X${v( x - dX )} Y${v( y + dY )}`)
  console.log( `G1 X${v( x - dX )} Y${v( y - dY )}`)
}

// ----------------------------------------------------------------------------

function gCodeText( str, fontSize, xStart, yStart, options ) {
  console.log( 'G1 F100' )
  let x0 = xStart
  let y0 = yStart
  let xi = 0
  let yi = 0
  for ( let letter of str ) {
    console.log( '(Letter '+letter+')' )
    //console.log( 'G0 Z'+ ( options.z ? options.z : -0.1 ) )
    if ( letter == ' ' ) { 
      if ( options.mirror === true ) {
        if ( options.pitch ) {
          xi -= w * fontSize + options.pitch 
        } else {
          xi -= 0.5 * fontSize
        }
      } else {
        xi += 0.5 * fontSize
      }      
      continue
    }
    let letterSpec = arialN[ 'letter'+letter ]
    if ( fontSize < 10 ) {
      letterSpec = arialS[ 'letter'+letter ]
    } 
    if (  ! letterSpec ) { 
      console.error( 'ERROR: Letter "'+letter+'" not supported!' )
      continue
    }
    let cmdArr = letterSpec.cmds
    for ( let cmdLine of cmdArr ) {
      let x = xi + s( cmdLine.x, fontSize )
      let y = yi + s( cmdLine.y, fontSize )
      // console.log( `( x=${x} y=${y} )`)
      if ( options.mirror == true ) {
        console.log( `( mirror )`)
        x = xi - s( cmdLine.x, fontSize )
        y = yi + s( cmdLine.y, fontSize )
      }
      if ( options.rot ) {
        let xyRot = rot( x, y, options.rot )
        x = xyRot.x
        y = xyRot.y
      } 
      if ( cmdLine.cmd == 'G1' ) {
        console.log( cmdLine.cmd 
          + ' X' + v( x0 + x ) + ' Y' + v( y0 + y ) )
      } else if ( cmdLine.cmd == 'G0' ) {
        toSafetyHeight()
        console.log( cmdLine.cmd 
          + ' X' + v( x0 + x ) + ' Y' + v( y0 + y ) )
        console.log( 'G0 Z'+ ( cnc.fontZ != null ? cnc.fontZ : '-0.1' ) )
      } else {
        let cCmd =  cmdLine.cmd
        let i = s( cmdLine.i, fontSize )
        let j = s( cmdLine.j, fontSize )
        if ( options.mirror == true ) { 
          i = -i 
          if ( cCmd == 'G2' ) { cCmd = 'G3' } else { cCmd = 'G2' }
        }
        if ( options.rot ) {
          let xyRot = rot( i, j, options.rot )
          i = xyRot.x
          j = xyRot.y
        } 
          console.log( cCmd
          + ' X' + v( x0 + x ) + ' Y' + v( y0 + y ) 
          + ' I' + i + ' J' + j )
      }
    }
    let w = letterSpec.w 
    if ( options.mirror === true ) {
      if ( options.pitch ) {
        xi -= w * fontSize + options.pitch 
      } else {
        xi -= ( w + 0.2 )* fontSize 
      }
    } else {
      if ( options.pitch ) {
        xi += w * fontSize + options.pitch 
      } else {
        xi += ( w + 0.2 )* fontSize 
      }
    }
    toSafetyHeight()
  }
}


function rot( x, y, deg ) {
  let rad = ( deg + 0.01 ) / 180 * Math.PI
  let xr = x * Math.cos( rad ) - y * Math.sin( rad )
  let yr = x * Math.sin( rad ) + y * Math.cos( rad )
  // console.log( `( rot result ${xr} ${yr} )`)
  return { x: xr, y: yr }
}

// ============================================================================
// helper 
function toSafetyHeight() {
  console.log('G0 Z'+ ( cnc.SafeHeight ? cnc.SafeHeight : '5.0') +' (safety height)')
}

function v( val ) {
  // console.log( `( v ${val} )`)
  return Math.round( val * 1000 ) / 1000
}

// ----------------------------------------------------
// Helper: Print out scaled numbers in desired precision
function s( val, scale ) {
  return Math.round( ( val * scale ) * 1000 ) / 1000
}