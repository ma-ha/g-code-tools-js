/*
G-Gode must be prepared by copy replace:
- "X " > "X"
- "Y " > "Y"
- "I " > "I"
- "J " > "J"
- rm all "F*"
- "G00 Z 5.0000" > "(end)"
- rm header and footer
*/

let fileLines = require('fs').readFileSync( process.argv[2], 'utf-8').split(/\r?\n/)

let abc = { }
// this is what is expected from G-Code input
let letters = '-9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA' 
// or this? 
// let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'

// normal "path" based letters
// let have2parts = 'ADPOQR0469'
// let have3parts = 'B8'
// or 
// small "line" based letters
let have2parts = 'AEFQRTXY8'
let have3parts = 'HK'


let letterIdx = 0
let part = 0

// identifie all letters (-> var) in G-Code input
fileLines.forEach( ( line ) => {
  if ( line.indexOf('(end)') == 0 ) {
      if ( have2parts.indexOf( letters[ letterIdx ] ) >= 0 ) {
        if ( part == 1 ) {
          letterIdx ++
          part = 0  
        } else {
          part ++
        }
      } else if ( have3parts.indexOf( letters[ letterIdx ] ) >= 0 ) {
        if ( part == 2 ) {
          letterIdx ++
          part = 0  
        } else {
          part ++
        }
      } else {
        letterIdx ++
        part = 0
      }
  }
  // let sSign = ' '+part+' '
  let idx = 'letter'+ letters[ letterIdx ]
  if ( ! abc[ idx ] ) { abc[ idx ] = [] }
  if ( line.indexOf('G') == 0 ) {
    abc[ idx ].push( line )
    // sSign += ' + '
  } else {
    // sSign += '   '
  }
  // console.error( letters[ letterIdx ] + sSign +line )
})
let abcCoords= {}

// parse commands and adjust to (0/0) 
let y0 = 0
// valid for all letters:
let yMin = 100000
let yMax = 0
for ( let letter in abc ) {
  if ( letter == 'letterQ' || letter == 'letterJ') { continue }
  for ( let line of abc[ letter ] ) {
    let y = getCoord( 'Y', line )
    if ( y < yMin ) { yMin = y }
    // to scale to heigth of 1
    if ( y > yMax ) { yMax = y } 
  }
  if ( letter == 'letterF' ) break
}
console.error( `yMin=${yMin} yMax=${yMax}`)

let height = yMax - yMin

// crunch gCode to usable JSON spec
for ( let letter in abc ) {
  let letterDta = []
  let xMin =  10000
  let xMax = -10000
  // find min and max
  for ( let line of abc[ letter ] ) {
    let x = getCoord( 'X', line )
    // to move to (0,0)
    if ( x < xMin ) { xMin = x }
    // remember the width
    if ( x > xMax ) { xMax = x } 
  }
  for ( let line of abc[ letter ] ) {
    let x = ( getCoord( 'X', line ) - xMin ) / height
    let y = ( getCoord( 'Y', line ) - yMin ) / height
    if ( line.indexOf('G01') == 0 ) {
      letterDta.push({
        cmd: 'G1', x: v(x), y: v(y)
      })
    } else if ( line.indexOf('G02') == 0 ) {
      let i = getCoord( 'I', line ) / height
      let j = getCoord( 'J', line ) / height
      letterDta.push({
        cmd: 'G2', x: v(x), y: v(y), i: v(i), j: v(j)
      })
    } else if ( line.indexOf('G03') == 0 ) {
      let i = getCoord( 'I', line ) / height
      let j = getCoord( 'J', line ) / height
      letterDta.push({
        cmd: 'G3', x: v(x), y: v(y), i: v(i), j: v(j)
      })
    } else if ( line.indexOf('G00') == 0 ) {
      letterDta.push({
        cmd: 'G0', x: v(x), y: v(y)
      })
    }
  }
  if ( letterDta.length > 0 ) {
    abcCoords[ letter ] = {
      w : v( ( xMax -xMin ) / yMax ),
      cmds : letterDta
    }
  }
}

console.log( JSON.stringify( abcCoords, null, '  ' ) )


// ----------------------------------------------------
// Helper to parse coords from G-Code line:
function getCoord( coord, line ) {
  let x = null
  line.split(' ').forEach( ( cmd ) => {
    if ( cmd.indexOf( coord ) == 0 ) {
      x = Number.parseFloat( cmd.substr( 1 ) )
      // console.log( '__'+x )
    } else {      
    }
  })
  return x
}
// ----------------------------------------------------
// Helper: Print out smaller numbers
function v( val ) {
  return Number.parseFloat( val.toFixed( 4 ) )
}