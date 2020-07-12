let fileLines = require('fs').readFileSync( process.argv[2], 'utf-8').split(/\r?\n/)

let xMin = 10000
let yMin = 10000
fileLines.forEach( (line) => {
  let y = yMin
  let x = xMin
  line.split(' ').forEach( ( cmd ) => {
    if ( cmd.indexOf('X') == 0 ) {
      x = Number.parseFloat( cmd.substr( 1 ) )
    }
    if ( cmd.indexOf('Y') == 0 ) {
      y = Number.parseFloat( cmd.substr( 1 ) )
    }
  })
  if ( x == 0 && y == 0 ) {
    // console.log( '// IGNORE '+ line )
  } else {
    if ( x < xMin ) { 
	//console.log( '// x-min '+ line )
      xMin = x 
    }  
    if ( y < yMin ) { 
	//console.log( '// y-min '+ line )
      yMin = y 
    }
  }
})
console.log( '(Min-X ' + xMin +')' )
console.log( '(Min-Y ' + yMin +')' )

fileLines.forEach( (line) => {
  let yP = line.indexOf('Y')
  let xP = line.indexOf('X')
  if ( yP  > 0 || xP > 0) {
    let newLine = ''
    let x = 0
    let y = 0
    line.split(' ').forEach( ( cmd ) => {
      if ( cmd.indexOf('Y') == 0 ) {
        y = cmd.substr( 1 )
        let y2 = Math.round( ( y - yMin ) * 100000 ) / 100000
        newLine += 'Y'+y2+' '
      } else if ( cmd.indexOf('X') == 0 ) {
        x = cmd.substr( 1 )
        let x2 = Math.round( ( x - xMin ) * 100000 ) / 100000
        newLine += 'X'+x2+' '
      } else {
        newLine += cmd + ' '
      }
    })
    if ( x == 0 && y == 0 ) {
      console.log( line )
    } else {
      console.log( newLine )
    }
  } else {
    console.log( line )
  }
})

