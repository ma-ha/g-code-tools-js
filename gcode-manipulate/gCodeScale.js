#!/usr/local/bin/node
if ( ! process.argv[3] ) {
  console.error( 'Usage: gCodeScale.js input.json scale > output.gcode' )
  console.error( '  scales: Xxxx Yyyy Iiiii Jjjjj' )
  process.exit()
}

let fileLines = require('fs').readFileSync( process.argv[2], 'utf-8').split(/\r?\n/)

let scale = process.argv[3]

console.log ( scale )
fileLines.forEach( (line) => {
    let newLine = ''
    line.split(' ').forEach( ( cmd ) => {
      if ( cmd.indexOf('Y') == 0 ) {
        let y = cmd.substr( 1 )
        let y2 = Math.round( ( y * scale ) * 100000 ) / 100000
        newLine += 'Y'+y2+' '
      } else if ( cmd.indexOf('X') == 0 ) {
        let x = cmd.substr( 1 )
        let x2 = Math.round( ( x * scale ) * 100000 ) / 100000
        newLine += 'X'+x2+' '
      } else if ( cmd.indexOf('I') == 0 ) {
        let y = cmd.substr( 1 )
        let y2 = Math.round( ( y * scale ) * 100000 ) / 100000
        newLine += 'I'+y2+' '
      } else if ( cmd.indexOf('J') == 0 ) {
        let x = cmd.substr( 1 )
        let x2 = Math.round( ( x * scale ) * 100000 ) / 100000
        newLine += 'X'+x2+' '
      } else {
        newLine += cmd + ' '
      }
    })
    console.log( newLine )
})

